package utez.edu.mx.sihas.model.biological_data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.sihas.model.user.User;

import java.util.Optional;

@Repository
public interface BiologicalDataRepository extends JpaRepository <BiologicalData,Long>{

    Optional<BiologicalData> findByUser(User user);

}
