package utez.edu.mx.sihas.email.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.email.IEmailService;
import utez.edu.mx.sihas.email.dto.EmailDto;
import utez.edu.mx.sihas.model.user.ChangePasswordEmailDto;
import utez.edu.mx.sihas.service.user.UserService;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    private final IEmailService emailService;
    private final UserService userService;

    @Autowired
    public EmailController(IEmailService emailService, UserService userService) {
        this.emailService = emailService;
        this.userService = userService;
    }

    @PostMapping("/send-email")
    public ResponseEntity<Message> sendEmail(@RequestBody EmailDto emailDto) {
        try {
            emailService.enviarCorreo(emailDto);
            return new ResponseEntity<>(new Message(emailDto, "El correo se envio", TypesResponse.SUCCESS), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message(e.getMessage(), "El correo no se envio", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/change-password")
    public ResponseEntity<Message> changePassword(@RequestBody ChangePasswordEmailDto dto) {
        return userService.resetPassword(dto);
    }

}
