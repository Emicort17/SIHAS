package utez.edu.mx.sihas.model.user;




import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.rol.Rol;

import java.util.List;

public class UserDto {
    @NotNull(groups = {Modifying.class,ChangeStatus.class})
    private Long id_user;

    @NotBlank(groups = {Register.class,Modify.class})
    private String name;
    @NotBlank(groups = {Register.class,Modify.class})
    private String surname;
    @NotBlank(groups = {Register.class,Modify.class})
    private String lastname;
    @NotBlank(groups = {Register.class,Modify.class})
    private String email;
    @NotBlank(groups = {Register.class,Modify.class})
    private String password;
    @NotBlank(groups = {Register.class,Modify.class})
    private String status;
    @NotBlank(groups = {Register.class,Modify.class})
    private String rol;

    public Long getId_user() {
        return id_user;
    }

    public void setId_user(Long id_user) {
        this.id_user = id_user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
