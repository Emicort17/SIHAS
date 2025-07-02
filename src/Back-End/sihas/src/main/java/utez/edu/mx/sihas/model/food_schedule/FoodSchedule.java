package utez.edu.mx.sihas.model.food_schedule;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Horario_Alimento")
public class FoodSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_horario_alimento;

    @Column(name = "fecha", columnDefinition = "DATE")
    private LocalDate fecha;

    @Column(name = "fecha", columnDefinition = "DATE")
    private LocalTime hora;
}
