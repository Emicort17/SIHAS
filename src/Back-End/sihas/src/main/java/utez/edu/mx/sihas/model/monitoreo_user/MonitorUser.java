package utez.edu.mx.sihas.model.monitoreo_user;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.monitor.Monitor;
import utez.edu.mx.sihas.model.user.User;

@Entity
@Table(name = "monitoreo_usuario")
public class MonitorUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_monitoreo_usuario")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_monitoreo")
    private Monitor monitor;

}
