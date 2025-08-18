package utez.edu.mx.sihas.model.exercise;

import lombok.Getter;
import lombok.Setter;
import utez.edu.mx.sihas.model.user.UserSimpleDto;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ExerciseSimpleDto {

    private Long idExercise;
    private LocalDate date;
    private LocalTime time;
    private Boolean status;
    private UserSimpleDto user;

    public ExerciseSimpleDto(Long idExercise, LocalDate date, LocalTime time, Boolean status, UserSimpleDto user) {
        this.idExercise = idExercise;
        this.date = date;
        this.time = time;
        this.status = status;
        this.user = user;
    }
}
