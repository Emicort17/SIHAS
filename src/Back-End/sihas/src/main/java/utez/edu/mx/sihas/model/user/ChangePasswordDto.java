package utez.edu.mx.sihas.model.user;

public class ChangePasswordDto {
    private Long userid;
    private String token;
    private String tokenUser;
    private String currentPassword;
    private String newPassword;

    public ChangePasswordDto() {
    }
    public ChangePasswordDto(Long userid, String currentPassword, String newPassword) {
        this.userid = userid;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenUser() {
        return tokenUser;
    }

    public void setTokenUser(String tokenUser) {
        this.tokenUser = tokenUser;
    }

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

}
