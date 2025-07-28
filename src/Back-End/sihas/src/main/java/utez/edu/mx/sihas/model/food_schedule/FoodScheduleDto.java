package utez.edu.mx.sihas.model.food_schedule;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.time.LocalTime;

public class FoodScheduleDto {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long idFoodSchedule;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDate date;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime time;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getIdFoodSchedule() {
        return idFoodSchedule;
    }

    public void setIdFoodSchedule(Long idFoodSchedule) {
        this.idFoodSchedule = idFoodSchedule;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
