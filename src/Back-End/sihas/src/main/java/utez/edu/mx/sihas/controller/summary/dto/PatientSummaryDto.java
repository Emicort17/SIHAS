package utez.edu.mx.sihas.controller.summary.dto;

import java.util.List;

public class PatientSummaryDto {

    private Double kcal;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;
    private List<Double> sleepHoursPerDay;
    private Integer currentExerciseCount;
    private Integer exerciseGoal;

    public PatientSummaryDto() {
    }

    public PatientSummaryDto(Double kcal, Double protein, Double carbs, Double fat,Double fiber, List<Double> sleepHoursPerDay, Integer currentExerciseCount, Integer exerciseGoal
                           ) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.sleepHoursPerDay = sleepHoursPerDay;
        this.currentExerciseCount = currentExerciseCount;
        this.exerciseGoal = exerciseGoal;
    }

    public Double getKcal() {
        return kcal;
    }

    public void setKcal(Double kcal) {
        this.kcal = kcal;
    }

    public Double getProtein() {
        return protein;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public Double getCarbs() {
        return carbs;
    }

    public void setCarbs(Double carbs) {
        this.carbs = carbs;
    }

    public Double getFat() {
        return fat;
    }

    public void setFat(Double fat) {
        this.fat = fat;
    }

    public List<Double> getSleepHoursPerDay() {
        return sleepHoursPerDay;
    }

    public void setSleepHoursPerDay(List<Double> sleepHoursPerDay) {
        this.sleepHoursPerDay = sleepHoursPerDay;
    }

    public Integer getCurrentExerciseCount() {
        return currentExerciseCount;
    }

    public void setCurrentExerciseCount(Integer currentExerciseCount) {
        this.currentExerciseCount = currentExerciseCount;
    }

    public Integer getExerciseGoal() {
        return exerciseGoal;
    }

    public void setExerciseGoal(Integer exerciseGoal) {
        this.exerciseGoal = exerciseGoal;
    }

    public Double getFiber() {
        return fiber;
    }

    public void setFiber(Double fiber) {
        this.fiber = fiber;
    }
}
