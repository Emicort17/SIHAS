package utez.edu.mx.sihas.model.exercise;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.time.LocalTime;



@Entity
@Table(name = "Ejercicio")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ejercicio")
    private Long idExercise;

    @Column(name = "fecha", columnDefinition = "DATE")
    private LocalDate date;

    @Column(name = "hora", columnDefinition = "TIME")
    private LocalTime time;

    @Column(name = "estado", columnDefinition = "BOOLEAN")
    private Boolean status;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private User user;

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
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

    public Long getIdExercise() {
        return idExercise;
    }

    public void setIdExercise(Long idExercise) {
        this.idExercise = idExercise;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Exercise() {
    }

    public Exercise( LocalDate date, LocalTime time, Boolean status, User user) {
        this.date = date;
        this.time = time;
        this.status = status;
        this.user = user;
    }

    @Override
    public String toString() {
        return "Exercise{" +
                "idExercise=" + idExercise +
                ", date=" + date +
                ", status=" + status +
                ", user=" + user +
                '}';
    }
}
