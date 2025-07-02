package utez.edu.mx.sihas.model.exercise;

public class Exercise {
  import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.util.Date;

@Entity
@Table(name = "Ejercicio")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_ejecicio;

    @Column(name = "fecha", columnDefinition = "DATE")
    private Date fecha;

    @Column(name = "estado", columnDefinition = "BOOLEAN")
    private boolean estado;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User usuario;

    public Exercise() {
    }

    public Exercise(Long id_ejecicio, Date fecha, boolean estado, User usuario) {
        this.id_ejecicio = id_ejecicio;
        this.fecha = fecha;
        this.estado = estado;
        this.usuario = usuario;
    }

    public Long getId_ejecicio() {
        return id_ejecicio;
    }

    public void setId_ejecicio(Long id_ejecicio) {
        this.id_ejecicio = id_ejecicio;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "Exercise{" +
                "id_ejecicio=" + id_ejecicio +
                ", fecha=" + fecha +
                ", estado=" + estado +
                ", usuario=" + usuario +
                '}';
    }
}
