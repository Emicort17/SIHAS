package utez.edu.mx.sihas.controller.summary;

import lombok.Data;

@Data
public class NutritionSummaryDto {
    private Double kcal;
    private Double protein;
    private Double carbs;
    private Double fat;

    public NutritionSummaryDto(Double kcal, Double protein, Double carbs, Double fat) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
    }

    public NutritionSummaryDto() {
    }

    public Double getKcal() {
        return kcal;
    }

    public Double getProtein() {
        return protein;
    }

    public Double getCarbs() {
        return carbs;
    }

    public Double getFat() {
        return fat;
    }

    public void setKcal(Double kcal) {
        this.kcal = kcal;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public void setCarbs(Double carbs) {
        this.carbs = carbs;
    }

    public void setFat(Double fat) {
        this.fat = fat;
    }
}
