package utez.edu.mx.sihas.model.food;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodSchedule;

import java.util.List;

@Entity
@Table(name = "alimento")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alimento")
    private Long id_alimento; // Changed from id_food

    @Column(name = "nombre", columnDefinition = "VARCHAR(150)")
    private String name;

    @Column(name = "cantidad", columnDefinition = "INTEGER")
    private Integer quantity;

    @Column(name = "calorias", columnDefinition = "DOUBLE")
    private Double calories;

    @Column(name = "proteinas", columnDefinition = "DOUBLE")
    private Double proteins;

    @Column(name = "grasas", columnDefinition = "DOUBLE")
    private Double fats;

    @Column(name = "carbohidratos", columnDefinition = "DOUBLE")
    private Double carbohydrates;

    @Column(name = "fibra", columnDefinition = "DOUBLE")
    private Double fiber;

    @OneToMany(mappedBy = "food")
    @JsonIgnore
    private List<FoodFoodSchedule> foodFoodSchedules;

    public Food() {
    }

    public Food(String name, Integer quantity, Double calories,
                Double proteins, Double fats, Double carbohydrates,
                Double fiber) {
        this.name = name;
        this.quantity = quantity;
        this.calories = calories;
        this.proteins = proteins;
        this.fats = fats;
        this.carbohydrates = carbohydrates;
        this.fiber = fiber;
    }

    public Long getId_alimento() {
        return id_alimento;
    }

    public void setId_alimento(Long id_alimento) {
        this.id_alimento = id_alimento;
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

    public Double getFiber() {
        return fiber;
    }

    public void setFiber(Double fiber) {
        this.fiber = fiber;
    }

    public List<FoodFoodSchedule> getFoodFoodSchedules() {
        return foodFoodSchedules;
    }

    public void setFoodFoodSchedules(List<FoodFoodSchedule> foodFoodSchedules) {
        this.foodFoodSchedules = foodFoodSchedules;
    }

    @Override
    public String toString() {
        return "Food{" +
                "id_alimento=" + id_alimento +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", calories=" + calories +
                ", proteins=" + proteins +
                ", fats=" + fats +
                ", carbohydrates=" + carbohydrates +
                ", fiber=" + fiber +
                '}';
    }
}