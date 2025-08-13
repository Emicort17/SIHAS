package utez.edu.mx.sihas.email.dto;

import java.util.Random;


public class EmailDto {
    private String destinatario;
    private String asunto;
    private String token;

    public String getDestinatario() {
        return destinatario;
    }
    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }
    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public EmailDto() {
        this.token = generarToken();
    }

    private String generarToken() {
        Random random = new Random();
        StringBuilder pinBuilder = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            pinBuilder.append(random.nextInt(10));
        }
        return pinBuilder.toString();
    }
}
