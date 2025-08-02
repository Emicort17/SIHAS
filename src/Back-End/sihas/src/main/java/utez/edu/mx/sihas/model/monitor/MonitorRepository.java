package utez.edu.mx.sihas.model.monitor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.sihas.model.monitoreo_user.MonitorUser;

import java.util.List;

@Repository
public interface MonitorRepository extends JpaRepository<Monitor,Long>{

    @Query("""
        SELECT m FROM MonitorUser mu
        JOIN mu.monitor m
        WHERE mu.user.id_user = :idUsuario
    """)
    List<Monitor> findMonitoreosPorUsuario(@Param("idUsuario") Long idUsuario);
}
