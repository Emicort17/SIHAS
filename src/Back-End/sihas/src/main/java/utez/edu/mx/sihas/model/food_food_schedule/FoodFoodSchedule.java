package utez.edu.mx.sihas.model.food_food_schedule;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.food.Food;
import utez.edu.mx.sihas.model.food_schedule.FoodSchedule;

@Entity
@Table(name = "alimento_con_horario_alimento")
public class FoodFoodSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alimento_horario_alimento")
    private Long idFoodFoodSchedule;

    @ManyToOne
    @JoinColumn(name = "id_alimento")
    private Food food;

    @ManyToOne
    @JoinColumn(name = "id_horario_alimento")
    @JsonIgnore
    private FoodSchedule foodSchedule;

    public FoodFoodSchedule(Food food, FoodSchedule foodSchedule) {
        this.food = food;
        this.foodSchedule = foodSchedule;
    }
    public FoodFoodSchedule() {

    }

    public Long getIdFoodFoodSchedule() {
        return idFoodFoodSchedule;
    }

    public void setIdFoodFoodSchedule(Long idFoodFoodSchedule) {
        this.idFoodFoodSchedule = idFoodFoodSchedule;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public FoodSchedule getFoodSchedule() {
        return foodSchedule;
    }

    public void setFoodSchedule(FoodSchedule foodSchedule) {
        this.foodSchedule = foodSchedule;
    }
}
