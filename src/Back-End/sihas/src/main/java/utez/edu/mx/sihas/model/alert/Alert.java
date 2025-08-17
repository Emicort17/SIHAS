package utez.edu.mx.sihas.model.alert;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Alerta")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_alerta;

    @Column(name = "tipo_alerta", columnDefinition = "VARCHAR(30)")
    private String type_alert;

    @Column(name = "descripcion", columnDefinition = "VARCHAR(50)")
    private String description;

    @Column(name = "estatus", columnDefinition = "BOOLEAN")
    private Boolean status;

    @Column(name = "fecha_programada")
    private LocalDate scheduled_date;

    @Column(name = "hora")
    private LocalTime scheduled_time;

    @Column(name = "un_dia")
    private Boolean oneDay;

    @Column(name = "id_relacionado")
    private Long idRelacionado;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonIgnore
    private User user;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId_alerta() {
        return id_alerta;
    }

    public void setId_alerta(Long id_alerta) {
        this.id_alerta = id_alerta;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getType_alert() {
        return type_alert;
    }

    public void setType_alert(String type_alert) {
        this.type_alert = type_alert;
    }

    public Long getIdRelacionado() {
        return idRelacionado;
    }

    public void setIdRelacionado(Long idRelacionado) {
        this.idRelacionado = idRelacionado;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getOneDay() {
        return oneDay;
    }

    public void setOneDay(Boolean oneDay) {
        this.oneDay = oneDay;
    }

    public LocalDate getScheduled_date() {
        return scheduled_date;
    }

    public void setScheduled_date(LocalDate scheduled_date) {
        this.scheduled_date = scheduled_date;
    }

    public LocalTime getScheduled_time() {
        return scheduled_time;
    }

    public void setScheduled_time(LocalTime scheduled_time) {
        this.scheduled_time = scheduled_time;
    }

    public Alert() {
    }

    public Alert(String description, Long id_alerta, Long idRelacionado,
                 Boolean oneDay, LocalDate scheduled_date,
                 LocalTime scheduled_time, Boolean status,
                 String type_alert, User user) {
        this.description = description;
        this.id_alerta = id_alerta;
        this.idRelacionado = idRelacionado;
        this.oneDay = oneDay;
        this.scheduled_date = scheduled_date;
        this.scheduled_time = scheduled_time;
        this.status = status;
        this.type_alert = type_alert;
        this.user = user;
    }

}
