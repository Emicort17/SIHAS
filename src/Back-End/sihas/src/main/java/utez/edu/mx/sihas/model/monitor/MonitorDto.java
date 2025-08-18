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

    @NotNull(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
    private String requestStatus;

    @NotBlank(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
    private Date requestDate;

    private Date responseDate;

    @NotBlank(groups = {MonitorDto.Register.class, MonitorDto.Modify.class})
    private List<Long> user;

    public @NotNull(groups = {Modifying.class, ChangeStatus.class}) Long getIdMonitor() {
        return idMonitor;
    }

    public void setIdMonitor(@NotNull(groups = {Modifying.class, ChangeStatus.class}) Long idMonitor) {
        this.idMonitor = idMonitor;
    }

    public @NotBlank(groups = {Register.class, Modify.class}) Date getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(@NotBlank(groups = {Register.class, Modify.class}) Date requestDate) {
        this.requestDate = requestDate;
    }

    public @NotBlank(groups = {Register.class, Modify.class}) String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(@NotBlank(groups = {Register.class, Modify.class}) String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public Date getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(Date responseDate) {
        this.responseDate = responseDate;
    }

    public @NotBlank(groups = {Register.class, Modify.class}) List<Long> getUser() {
        return user;
    }

    public void setUser(@NotBlank(groups = {Register.class, Modify.class}) List<Long> user) {
        this.user = user;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
