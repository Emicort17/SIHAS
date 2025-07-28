package utez.edu.mx.sihas.model.monitoreo_user;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.monitor.Monitor;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.util.Date;

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

    public MonitorUser() {
    }

    public MonitorUser(User user, Monitor monitor) {
        this.user = user;
        this.monitor = monitor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Monitor getMonitor() {
        return monitor;
    }

    public void setMonitor(Monitor monitor) {
        this.monitor = monitor;
    }
}
