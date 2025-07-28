package utez.edu.mx.sihas.model.monitoreo_user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import utez.edu.mx.sihas.model.monitor.Monitor;

import java.util.List;

public interface MonitorUserRepository extends JpaRepository<MonitorUser,Long> {
    List<Monitor> findMonitoreosPorUsuario(@Param("userId") Long userId);

}
