package utez.edu.mx.sihas.model.alert;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDateTime;

public class AlertDto {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long id_alerta;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private String type_alert;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private String description;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Boolean status;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDateTime scheduled_date;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long idRelacionado;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private User user;

    public Long getId_alerta() {
        return id_alerta;
    }

    public void setId_alerta(Long id_alerta) {
        this.id_alerta = id_alerta;
    }

    public String getType_alert() {
        return type_alert;
    }

    public void setType_alert(String type_alert) {
        this.type_alert = type_alert;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public LocalDateTime getScheduled_date() {
        return scheduled_date;
    }

    public void setScheduled_date(LocalDateTime scheduled_date) {
        this.scheduled_date = scheduled_date;
    }

    public Long getIdRelacionado() {
        return idRelacionado;
    }

    public void setIdRelacionado(Long idRelacionado) {
        this.idRelacionado = idRelacionado;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
