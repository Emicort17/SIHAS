package utez.edu.mx.sihas.model.sleep_monitoring;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.util.Date;

@Entity
@Table(name = "monitoreo_usuario")import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.util.Date;

@Entity
@Table(name = "monitoreo_usuario")
public class SleepMonitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_monitoreo;

    @Column(name = "estado_solicitud",columnDefinition = "VARCHAR(255)")
    private String estado_solicitud;

    @Column(name = "fecha_solicitud",columnDefinition = "DATE")
    private Date fecha_solicitud;

    @Column(name = "fecha_respuesta",columnDefinition = "DATE")
    private Date fecha_respuesta;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User usuario;

    public SleepMonitor() {
    }

    public SleepMonitor(Long id_monitoreo, String estado_solicitud, Date fecha_solicitud, Date fecha_respuesta, User usuario) {
        this.id_monitoreo = id_monitoreo;
        this.estado_solicitud = estado_solicitud;
        this.fecha_solicitud = fecha_solicitud;
        this.fecha_respuesta = fecha_respuesta;
        this.usuario = usuario;
    }

    public Long getId_monitoreo() {
        return id_monitoreo;
    }

    public void setId_monitoreo(Long id_monitoreo) {
        this.id_monitoreo = id_monitoreo;
    }

    public String getEstado_solicitud() {
        return estado_solicitud;
    }

    public void setEstado_solicitud(String estado_solicitud) {
        this.estado_solicitud = estado_solicitud;
    }

    public Date getFecha_solicitud() {
        return fecha_solicitud;
    }

    public void setFecha_solicitud(Date fecha_solicitud) {
        this.fecha_solicitud = fecha_solicitud;
    }

    public Date getFecha_respuesta() {
        return fecha_respuesta;
    }

    public void setFecha_respuesta(Date fecha_respuesta) {
        this.fecha_respuesta = fecha_respuesta;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "SleepMonitor{" +
                "id_monitoreo=" + id_monitoreo +
                ", estado_solicitud='" + estado_solicitud + '\'' +
                ", fecha_solicitud=" + fecha_solicitud +
                ", fecha_respuesta=" + fecha_respuesta +
                ", usuario=" + usuario +
                '}';
    }
}
