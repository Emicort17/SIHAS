package utez.edu.mx.sihas.email;

import utez.edu.mx.sihas.email.dto.EmailDto;

public interface IEmailService {
    void enviarCorreo(EmailDto emailDto);
}
