package utez.edu.mx.sihas.model.monitor;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.monitoreo_user.MonitorUser;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "monitoreo")
public class Monitor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_monitoreo")
    private Long idMonitor;

    @Column(name = "estado_solicitud", columnDefinition = "VARCHAR(255)")
    private String requestStatus;

    @Column(name = "fecha_solicitud", columnDefinition = "DATE")
    private Date requestDate;

    @Column(name = "fecha_respuesta", columnDefinition = "DATE")
    private Date responseDate;

    @OneToMany(mappedBy = "monitor")
    private List<MonitorUser> monitoreosUsuario;

    public Long getIdMonitor() {
        return idMonitor;
    }

    public void setIdMonitor(Long idMonitor) {
        this.idMonitor = idMonitor;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public Date getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Date requestDate) {
        this.requestDate = requestDate;
    }

    public Date getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(Date responseDate) {
        this.responseDate = responseDate;
    }

    public List<MonitorUser> getMonitoreosUsuario() {
        return monitoreosUsuario;
    }

    public void setMonitoreosUsuario(List<MonitorUser> monitoreosUsuario) {
        this.monitoreosUsuario = monitoreosUsuario;
    }

    public Monitor() {
    }

    public Monitor(String requestStatus, Date requestDate, Date responseDate) {
        this.requestStatus = requestStatus;
        this.requestDate = requestDate;
        this.responseDate = responseDate;
    }

    @Override
    public String toString() {
        return "SleepMonitor{" +
                "idMonitor=" + idMonitor +
                ", requestStatus='" + requestStatus + '\'' +
                ", requestDate=" + requestDate +
                ", responseDate=" + responseDate +
                '}';
    }
}
