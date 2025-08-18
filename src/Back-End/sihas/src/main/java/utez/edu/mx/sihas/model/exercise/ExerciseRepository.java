package utez.edu.mx.sihas.model.exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise,Long> {
    @Query("SELECT COUNT(e) FROM Exercise e WHERE e.user.id = :userId AND e.status = true AND e.date >= :startDate")
    Integer countExercisesForUserSince(Long userId, LocalDate startDate);

    @Query("SELECT e FROM Exercise e WHERE e.user.id = :userId AND e.date BETWEEN :startDate AND :endDate")
    List<Exercise> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

}
