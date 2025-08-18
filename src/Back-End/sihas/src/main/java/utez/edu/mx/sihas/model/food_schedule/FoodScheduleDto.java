package utez.edu.mx.sihas.model.food_schedule;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class FoodScheduleDto {
    private Long idFoodSchedule;

    @NotNull(groups = Register.class, message = "La fecha es obligatoria")
    private LocalDate date;

    @NotNull(groups = Register.class, message = "La hora es obligatoria")
    private LocalTime time;

    @NotNull(groups = Register.class, message = "El ID de usuario es obligatorio")
    private Long user;

    private String mealType;

    private List<Long> foods;

    public Long getIdFoodSchedule() {
        return idFoodSchedule;
    }

    public void setIdFoodSchedule(Long idFoodSchedule) {
        this.idFoodSchedule = idFoodSchedule;
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

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public List<Long> getFoods() {
        return foods;
    }

    public void setFoods(List<Long> foods) {
        this.foods = foods;
    }

    public interface Register {}
    public interface Modify {}
}