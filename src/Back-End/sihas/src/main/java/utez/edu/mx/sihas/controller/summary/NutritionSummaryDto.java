package utez.edu.mx.sihas.controller.summary;

public class NutritionSummaryDto {
    private Double kcal;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;

    public NutritionSummaryDto() {
    }

    public NutritionSummaryDto(Double kcal, Double protein, Double carbs, Double fat, Double fiber) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.fiber = fiber;
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

    public Double getFiber() {return fiber;}

    public void setFiber(Double fiber) {this.fiber = fiber;}
}
