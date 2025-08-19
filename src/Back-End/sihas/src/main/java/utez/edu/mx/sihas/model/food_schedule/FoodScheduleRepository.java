package utez.edu.mx.sihas.model.food_schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodScheduleRepository extends JpaRepository<FoodSchedule, Long> {
    List<FoodSchedule> findByUserId(Long userId);

    List<FoodSchedule> findByUserIdAndDate(Long userId, LocalDate date);
}
