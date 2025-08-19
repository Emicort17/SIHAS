package utez.edu.mx.sihas.model.food;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;

import java.util.List;

public class FoodDto  {

    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long id_food;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private String name;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Integer quantity;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Double calories;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Double proteins;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Double fats;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Double carbohydrates;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Double fiber;


    public Long getId_food() {
        return id_food;
    }

    public void setId_food(Long id_food) {
        this.id_food = id_food;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getCalories() {
        return calories;
    }

    public void setCalories(Double calories) {
        this.calories = calories;
    }

    public Double getProteins() {
        return proteins;
    }

    public void setProteins(Double proteins) {
        this.proteins = proteins;
    }

    public Double getFats() {
        return fats;
    }

    public void setFats(Double fats) {
        this.fats = fats;
    }

    public Double getCarbohydrates() {
        return carbohydrates;
    }

    public void setCarbohydrates(Double carbohydrates) {
        this.carbohydrates = carbohydrates;
    }

    public Double getFiber() {return fiber;}

    public void setFiber(Double fiber) {this.fiber = fiber;}

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
