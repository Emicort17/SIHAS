package utez.edu.mx.sihas.model.food_food_schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodFoodScheduleRepository extends JpaRepository<FoodFoodSchedule, Long> {


}
