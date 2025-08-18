package utez.edu.mx.sihas.model.alert;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AlertDto {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long id_alert;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private String type_alert;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private String description;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Boolean status;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDate scheduled_date;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime scheduled_time;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Boolean oneDay;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long idRelacionado;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long user;

    public Long getId_alert() {
        return id_alert;
    }

    public void setId_alert(Long id_alerta) {
        this.id_alert = id_alerta;
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

    public LocalDate getScheduled_date() {
        return scheduled_date;
    }

    public void setScheduled_date(LocalDate scheduled_date) {
        this.scheduled_date = scheduled_date;
    }

    public LocalTime getScheduled_time() {
        return scheduled_time;
    }

    public void setScheduled_time(LocalTime scheduled_time) {
        this.scheduled_time = scheduled_time;
    }

    public Boolean getOneDay() {
        return oneDay;
    }

    public void setOneDay(Boolean oneDay) {
        this.oneDay = oneDay;
    }

    public Long getIdRelacionado() {
        return idRelacionado;
    }

    public void setIdRelacionado(Long idRelacionado) {
        this.idRelacionado = idRelacionado;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
