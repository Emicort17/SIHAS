package utez.edu.mx.sihas.security.dto;

public class AuthResponse {
    private String jwt;
    private Long userId;
    private String username;
    private String rol;
    private long expiration;

    public AuthResponse(String jwt, Long userId, String username ,String rol, long expiration) {
        this.jwt = jwt;
        this.userId = userId;
        this.username = username;
        this.expiration = expiration;
        this.rol = rol;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
