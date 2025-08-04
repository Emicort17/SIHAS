package utez.edu.mx.sihas.controller.summary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class PatientSummaryDto {
    private Double kcal;
    private Double protein;
    private Double carbs;
    private Double fat;

    private List<Double> sleepHoursPerDay;

    private Integer currentExerciseCount;
    private Integer exerciseGoal;

    public PatientSummaryDto() {
    }

    public PatientSummaryDto(Double kcal, Double protein, Double carbs, Double fat, List<Double> sleepHoursPerDay, Integer currentExerciseCount, Integer exerciseGoal) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.sleepHoursPerDay = sleepHoursPerDay;
        this.currentExerciseCount = currentExerciseCount;
        this.exerciseGoal = exerciseGoal;
    }
}
