package utez.edu.mx.sihas.model.alert;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDateTime;

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
    private LocalDateTime scheduled_date;

    @Column(name = "id_relacionado")
    private Long idRelacionado;

    @ManyToOne
    @JoinColumn(name = "id_user")
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

    public LocalDateTime getScheduled_date() {
        return scheduled_date;
    }

    public void setScheduled_date(LocalDateTime scheduled_date) {
        this.scheduled_date = scheduled_date;
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

    public Alert() {
    }

    public Alert(Long id_alerta, String type_alert, String description, Boolean status, LocalDateTime scheduled_date) {
        this.id_alerta = id_alerta;
        this.type_alert = type_alert;
        this.description = description;
        this.status = status;
        this.scheduled_date = scheduled_date;
    }

    @Override
    public String toString() {
        return "Alert{" +
                "description='" + description + '\'' +
                ", id_alerta=" + id_alerta +
                ", type_alert='" + type_alert + '\'' +
                ", status=" + status +
                ", scheduled_date=" + scheduled_date +
                '}';
    }
}
