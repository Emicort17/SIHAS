package utez.edu.mx.sihas.model.sleep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import utez.edu.mx.sihas.model.user.User;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SleepRepository extends JpaRepository<Sleep,Long> {
    @Query("SELECT SUM(s.totalHours) FROM Sleep s WHERE s.user.id = :userId AND s.date = :date")
    Double getTotalSleepHoursForDay(Long userId, LocalDate date);

    List<Sleep> user(User user);

    List<Sleep> findByUserId(Long userId);
}
