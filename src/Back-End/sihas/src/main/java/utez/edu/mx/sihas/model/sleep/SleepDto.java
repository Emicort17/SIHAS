package utez.edu.mx.sihas.model.sleep;


import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;

import java.time.LocalDate;
import java.time.LocalTime;

public class SleepDto {
    @NotNull(groups = {Modifying.class, ExerciseDto.ChangeStatus.class})
    private Long idSleep;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalDate date;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime startTime;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private LocalTime endTime;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Double totalHours;

    @NotNull(groups = {ExerciseDto.Register.class, ExerciseDto.Modify.class})
    private Long user;

    public Long getIdSleep() {
        return idSleep;
    }

    public void setIdSleep(Long idSleep) {
        this.idSleep = idSleep;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public interface Register{}
    public interface Modify{}
    public interface ChangeStatus{}
}
