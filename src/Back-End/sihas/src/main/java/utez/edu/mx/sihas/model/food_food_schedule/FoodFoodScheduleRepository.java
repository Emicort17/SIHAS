package utez.edu.mx.sihas.model.food_food_schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodFoodScheduleRepository extends JpaRepository<FoodFoodSchedule, Long> {
    void deleteAllByIdFoodFoodSchedule(Long idFoodSchedule);
}
