package utez.edu.mx.sihas.model.biological_data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BiologicalDataRepository  extends JpaRepository <BiologicalData,Long>{
}
