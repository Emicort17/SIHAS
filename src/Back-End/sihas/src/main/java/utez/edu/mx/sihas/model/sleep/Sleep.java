package utez.edu.mx.sihas.model.sleep;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.alert.Alert;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "Sueño")
public class Sleep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sueño")
    private Long idSleep;

    @Column(name = "fecha", columnDefinition = "DATE")
    private LocalDate date;

    @Column(name = "hora_inicio", columnDefinition = "TIME")
    private LocalTime startTime;

    @Column(name = "hora_final", columnDefinition = "TIME")
    private LocalTime endTime;

    @Column(name = "total_horas", columnDefinition = "DOUBLE")
    private Double totalHours;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private User user;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public Long getIdSleep() {
        return idSleep;
    }

    public void setIdSleep(Long idSleep) {
        this.idSleep = idSleep;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Sleep{" +
                "idSleep=" + idSleep +
                ", date=" + date +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", totalHours=" + totalHours +
                '}';
    }

    public Sleep() {
    }

    public Sleep(LocalDate date, LocalTime endTime, LocalTime startTime, Long idSleep, Double totalHours) {
        this.date = date;
        this.endTime = endTime;
        this.startTime = startTime;
        this.idSleep = idSleep;
        this.totalHours = totalHours;
    }
}
