package utez.edu.mx.sihas.model.exercise;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserDto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ExerciseDto {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long idExercise;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDate date;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime time;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Boolean status;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long user;

    public Long getIdExercise() {
        return idExercise;
    }

    public void setIdExercise(Long idExercise) {
        this.idExercise = idExercise;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
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
