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
        SELECT m FROM MonitoreoUsuario mu
        JOIN mu.monitoreo m
        WHERE mu.usuario.id = :idUsuario
    """)
    List<Monitor> findMonitoreosPorUsuario(@Param("idUsuario") Long idUsuario);
}
