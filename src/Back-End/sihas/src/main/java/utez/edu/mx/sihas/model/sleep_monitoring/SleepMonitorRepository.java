package utez.edu.mx.sihas.model.sleep_monitoring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SleepMonitorRepository extends JpaRepository<SleepMonitor,Long>{
}
