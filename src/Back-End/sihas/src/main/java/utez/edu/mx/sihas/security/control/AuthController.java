package utez.edu.mx.sihas.security.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.sihas.model.rol.Rol;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.security.JwtUtil;
import utez.edu.mx.sihas.security.UserDetailsServiceImpl;
import utez.edu.mx.sihas.security.dto.AuthRequest;
import utez.edu.mx.sihas.security.dto.AuthResponse;

@RestController
public class AuthController {
    private final AuthenticationManager authenticationManager;

    private final UserDetailsServiceImpl userDetailsService;

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;


    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/api/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new Exception("Usuario o contraseña incorrectos", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        long expirationTime = jwtUtil.getExpirationTime();

        String rolString =  user.getRoles().stream()
                .findFirst()
                .map(Rol::getName)
                .orElse("Sin rol");

        return new AuthResponse(jwt, user.getId_user(), user.getEmail(), rolString,expirationTime, user.isStatus());
    }
}
