package utez.edu.mx.sihas.model.food_food_schedule;

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
    private FoodSchedule foodSchedule;
}
