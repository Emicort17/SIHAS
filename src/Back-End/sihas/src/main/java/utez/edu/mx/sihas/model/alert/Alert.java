package utez.edu.mx.sihas.model.alert;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Alerta")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_alerta;

    @Column(name = "tipo_alerta")
    private String type_alert;

    @Column(name = "descripcion")
    private String description;

    @Column(name = "estatus")
    private Boolean status;

    @Column(name = "fecha_programada")
    private LocalDateTime scheduled_date;
}
