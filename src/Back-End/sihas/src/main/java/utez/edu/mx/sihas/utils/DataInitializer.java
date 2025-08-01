package utez.edu.mx.sihas.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import utez.edu.mx.sihas.model.rol.Rol;
import utez.edu.mx.sihas.model.rol.RolRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;

import java.util.Optional;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, RolRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            Optional<Rol> optionalRole = roleRepository.findByName("USUARIO");
            if (!optionalRole.isPresent()) {
                Rol roleUsuario = new Rol("USUARIO");
                roleRepository.saveAndFlush(roleUsuario);

                Optional<User> optionalUser = userRepository.findByEmail("20223tn012@utez.edu.mx");
                if (!optionalUser.isPresent()) {
                    User userNormal = new User("Maximiliano", "Carrera", "Oropeza", "20223tn012@utez.edu.mx", passwordEncoder.encode("password123"), true);
                    userNormal.getRoles().add(roleUsuario);
                    userRepository.saveAndFlush(userNormal);
                }
            }

            optionalRole = roleRepository.findByName("PROFESIONAL");
            if (!optionalRole.isPresent()) {
                Rol roleProfesional = new Rol("PROFESIONAL");
                roleRepository.saveAndFlush(roleProfesional);

                Optional<User> optionalUser = userRepository.findByEmail("20223tn021@utez.edu.mx");
                if (!optionalUser.isPresent()) {
                    User userProfesional = new User("Diego Eduardo", "Jaimez", "Flores", "20223tn021@utez.edu.mx", passwordEncoder.encode("password123"), true);
                    userProfesional.getRoles().add(roleProfesional);
                    userRepository.saveAndFlush(userProfesional);
                }
            }

        };
    }
}
