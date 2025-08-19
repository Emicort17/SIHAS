package utez.edu.mx.sihas.model.food_schedule;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class FoodScheduleDto {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long idFoodSchedule;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDate date;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime time;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long user;

    private String mealType;

    private List<Long> foods;

    public @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalDate getDate() {
        return date;
    }

    public void setDate(@NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalDate date) {
        this.date = date;
    }

    public @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class}) Long getIdFoodSchedule() {
        return idFoodSchedule;
    }

    public void setIdFoodSchedule(@NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class}) Long idFoodSchedule) {
        this.idFoodSchedule = idFoodSchedule;
    }

    public @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalTime getTime() {
        return time;
    }

    public void setTime(@NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) LocalTime time) {
        this.time = time;
    }

    public @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) Long getUser() {
        return user;
    }

    public void setUser(@NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) Long user) {
        this.user = user;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) List<Long> getFoods() {
        return foods;
    }

    public void setFoods(@NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class}) List<Long> foods) {
        this.foods = foods;
    }

    public interface Register{}
    public interface Modify{}
}
