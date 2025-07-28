package utez.edu.mx.sihas.model.biological_data;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.util.Date;

@Entity
@Table(name = "Datos_Biologicos")
public class BiologicalData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_datos_biologicos")
    private Long idData;

    @Column(name = "fecha", columnDefinition = "DATE")
    private Date date;

    @Column(name = "peso", columnDefinition = "DOUBLE")
    private Double weight;

    @Column(name = "altura", columnDefinition = "DOUBLE")
    private Double height;

    @Column(name = "edad", columnDefinition = "INTEGER")
    private Integer age;

    @Column(name = "imc", columnDefinition = "DOUBLE")
    private Double bmi;

    @Column(name = "porcentaje_Grasa", columnDefinition = "DOUBLE")
    private Double fatPercentage;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private User user;

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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getIdData() {
        return idData;
    }

    public void setIdData(Long idData) {
        this.idData = idData;
    }

    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getFatPercentage() {
        return fatPercentage;
    }

    public void setFatPercentage(Double fatPercentage) {
        this.fatPercentage = fatPercentage;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BiologicalData() {
    }

    public BiologicalData(Date date, Double weight, Double height, Integer age, Double bmi, Double fatPercentage, User user) {
        this.date = date;
        this.weight = weight;
        this.height = height;
        this.age = age;
        this.bmi = bmi;
        this.fatPercentage = fatPercentage;
        this.user = user;
    }

    @Override
    public String toString() {
        return "BiologicalData{" +
                "idData=" + idData +
                ", date=" + date +
                ", weight=" + weight +
                ", height=" + height +
                ", age=" + age +
                ", bmi=" + bmi +
                ", fatPercentage=" + fatPercentage +
                '}';
    }
}
