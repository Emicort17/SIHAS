package utez.edu.mx.sihas.model.food_schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodScheduleRepository extends JpaRepository<FoodSchedule, Long> {
}
