package utez.edu.mx.sihas.model.food_food_schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.sihas.controller.summary.NutritionSummaryDto;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodFoodScheduleRepository extends JpaRepository<FoodFoodSchedule, Long> {
    @Modifying
    @Query("DELETE FROM FoodFoodSchedule ffs WHERE ffs.foodSchedule.idFoodSchedule = :foodScheduleId")
    void deleteByFoodScheduleId(@Param("foodScheduleId") Long foodScheduleId);

    @Query("SELECT CASE WHEN COUNT(ffs) > 0 THEN true ELSE false END " +
            "FROM FoodFoodSchedule ffs WHERE ffs.food.id_alimento = :foodId AND ffs.foodSchedule.idFoodSchedule = :foodScheduleId")
    boolean existsByFoodIdAndFoodScheduleId(@Param("foodId") Long foodId, @Param("foodScheduleId") Long foodScheduleId);

    @Query("SELECT new utez.edu.mx.sihas.controller.summary.NutritionSummaryDto(" +
            "SUM(f.calories), SUM(f.proteins), SUM(f.carbohydrates), SUM(f.fats), SUM(f.fiber)) " +
            "FROM FoodFoodSchedule ffs " +
            "JOIN ffs.food f " +
            "JOIN ffs.foodSchedule fs " +
            "WHERE fs.user.id = :userId AND fs.date >= :startDate")
    NutritionSummaryDto getNutritionSummaryForUser(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate
    );
}