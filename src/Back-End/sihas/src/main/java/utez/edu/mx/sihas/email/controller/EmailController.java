package utez.edu.mx.sihas.email.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.sihas.email.IEmailService;
import utez.edu.mx.sihas.email.dto.EmailDto;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    private final IEmailService emailService;

    public EmailController(IEmailService emailService) {
        this.emailService = emailService;
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

}
