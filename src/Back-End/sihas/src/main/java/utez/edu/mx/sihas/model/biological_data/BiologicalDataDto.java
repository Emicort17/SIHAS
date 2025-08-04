package utez.edu.mx.sihas.model.biological_data;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Modifying;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserDto;

import java.util.Date;

public class BiologicalDataDto {

    @NotNull(groups = {Modifying.class, BiologicalDataDto.ChangeStatus.class})
    private Long idData;


    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Date date;
    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Double weight;
    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Double height;
    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Integer age;
    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Double bmi;
    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Double fatPercentage;
    @NotBlank(groups = {BiologicalDataDto.Register.class, BiologicalDataDto.Modify.class})
    private Long user;

    public Long getIdData() {
        return idData;
    }

    public void setIdData(Long idData) {
        this.idData = idData;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }

    public Double getFatPercentage() {
        return fatPercentage;
    }

    public void setFatPercentage(Double fatPercentage) {
        this.fatPercentage = fatPercentage;
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
