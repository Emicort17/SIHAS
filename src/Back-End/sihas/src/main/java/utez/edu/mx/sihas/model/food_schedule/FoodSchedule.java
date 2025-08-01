package utez.edu.mx.sihas.model.food_schedule;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.alert.Alert;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodSchedule;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "Horario_Alimento")
public class FoodSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario_alimento")
    private Long idFoodSchedule;

    @Column(name = "fecha", columnDefinition = "DATE")
    private LocalDate date;

    @Column(name = "hora", columnDefinition = "TIME")
    private LocalTime time;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "foodSchedule")
    private List<FoodFoodSchedule> foodFoodSchedules;

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

    public Long getIdFoodSchedule() {
        return idFoodSchedule;
    }

    public void setIdFoodSchedule(Long idFoodSchedule) {
        this.idFoodSchedule = idFoodSchedule;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<FoodFoodSchedule> getFoodFoodSchedules() {
        return foodFoodSchedules;
    }

    public void setFoodFoodSchedules(List<FoodFoodSchedule> foodFoodSchedules) {
        this.foodFoodSchedules = foodFoodSchedules;
    }

    public FoodSchedule() {
    }

    public FoodSchedule( LocalDate date, LocalTime time, User user) {
        this.date = date;
        this.time = time;
        this.user = user;
    }

    @Override
    public String toString() {
        return "FoodSchedule{" +
                "idFoodSchedule=" + idFoodSchedule +
                ", date=" + date +
                ", time=" + time +
                '}';
    }
}
