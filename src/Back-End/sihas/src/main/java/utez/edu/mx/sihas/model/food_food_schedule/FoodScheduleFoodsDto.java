package utez.edu.mx.sihas.model.food_food_schedule;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class FoodScheduleFoodsDto {
    @NotNull(message = "El ID del horario es obligatorio")
    private Long foodScheduleId;

    @NotNull(message = "La lista de alimentos es obligatoria")
    private List<Long> foods;

    // Getters and setters
    public Long getFoodScheduleId() {
        return foodScheduleId;
    }

    public void setFoodScheduleId(Long foodScheduleId) {
        this.foodScheduleId = foodScheduleId;
    }

    public List<Long> getFoods() {
        return foods;
    }

    public void setFoods(List<Long> foods) {
        this.foods = foods;
    }
}
