package utez.edu.mx.sihas.model.food_schedule;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class FoodScheduleDto {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long idFoodSchedule;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDate date;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime time;

    @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long user;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private List<Long> foods;

    public @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalDate getDate() {
        return date;
    }

    public void setDate(@NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalDate date) {
        this.date = date;
    }

    public @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class}) Long getIdFoodSchedule() {
        return idFoodSchedule;
    }

    public void setIdFoodSchedule(@NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class}) Long idFoodSchedule) {
        this.idFoodSchedule = idFoodSchedule;
    }

    public @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalTime getTime() {
        return time;
    }

    public void setTime(@NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalTime time) {
        this.time = time;
    }

    public @NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) Long getUser() {
        return user;
    }

    public void setUser(@NotBlank(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) Long user) {
        this.user = user;
    }

    public @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) List<Long> getFoods() {
        return foods;
    }

    public void setFoods(@NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) List<Long> foods) {
        this.foods = foods;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
