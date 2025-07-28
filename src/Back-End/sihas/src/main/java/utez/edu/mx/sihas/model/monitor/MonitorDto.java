package utez.edu.mx.sihas.model.monitor;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.monitoreo_user.MonitorUser;
import utez.edu.mx.sihas.model.user.User;

import java.util.Date;
import java.util.List;

public class MonitorDto {

    @NotNull(groups = {Modifying.class, MonitorDto.ChangeStatus.class})
    private Long idMonitor;

    @NotBlank(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
    private String requestStatus;

    @NotBlank(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
    private Date requestDate;

    @NotBlank(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
    private Date responseDate;

    @NotBlank(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
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

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
