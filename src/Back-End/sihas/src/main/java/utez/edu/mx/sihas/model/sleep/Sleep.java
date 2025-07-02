package utez.edu.mx.sihas.model.sleep;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "Sueño")
public class Sleep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_sueño;

    @Column(name = "fecha",columnDefinition = "DATE")
    private Date fecha;

    @Column(name = "hora_inicio",columnDefinition = "DATETIME")
    private LocalDateTime hora_inicio;

    @Column(name = "hora_final",columnDefinition = "DATETIME")
    private LocalDateTime hora_final;

    @Column(name = "total_horas",columnDefinition = "DOUBLE")
    private double total_horas;
    /*
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User usuario;
    */
    public Sleep() {
    }
    //, User usuario
    public Sleep(Long id_sueño, Date fecha, LocalDateTime hora_inicio, LocalDateTime hora_final, double total_horas) {
            this.id_sueño = id_sueño;
            this.fecha = fecha;
            this.hora_inicio = hora_inicio;
            this.hora_final = hora_final;
            this.total_horas = total_horas;
           // this.usuario = usuario;
        }

 
    public Long getId_sueño() {
        return id_sueño;
    }

    public void setId_sueño(Long id_sueño) {
        this.id_sueño = id_sueño;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getHora_inicio() {
        return hora_inicio;
    }

    public void setHora_inicio(LocalDateTime hora_inicio) {
        this.hora_inicio = hora_inicio;
    }

    public LocalDateTime getHora_final() {
        return hora_final;
    }

    public void setHora_final(LocalDateTime hora_final) {
        this.hora_final = hora_final;
    }

    public double getTotal_horas() {
        return total_horas;
    }

    public void setTotal_horas(double total_horas) {
        this.total_horas = total_horas;
    }
    /*
    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }
    ", usuario=" + usuario +
    */
    @Override
    public String toString() {
        return "Sleep{" +
                "id_sueño=" + id_sueño +
                ", fecha=" + fecha +
                ", hora_inicio=" + hora_inicio +
                ", hora_final=" + hora_final +
                ", total_horas=" + total_horas +
                
                '}';
    }
}
