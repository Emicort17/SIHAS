package utez.edu.mx.sihas.model.biological_data;

import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.util.Date;

@Entity
@Table(name = "Datos_Biologicos")
public class BiologicalData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_datos;
    @Column(name = "fecha",columnDefinition = "DATE")
    private Date fecha;

    @Column(name = "peso",columnDefinition = "DOUBLE")
    private double peso;

    @Column(name = "altura",columnDefinition = "DOUBLE")
    private double altura;

    @Column(name = "edad",columnDefinition = "INTEGER")
    private int edad;

    @Column(name = "imc",columnDefinition = "DOUBLE")
    private double imc;

    @Column(name = "porcentaje_Grasa",columnDefinition = "DOUBLE")
    private double porcentajeGrasa;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User usuario;

    public BiologicalData() {
    }

    public BiologicalData(Long id_datos, Date fecha, double peso, double altura, int edad, double imc, double porcentajeGrasa, User usuario) {
        this.id_datos = id_datos;
        this.fecha = fecha;
        this.peso = peso;
        this.altura = altura;
        this.edad = edad;
        this.imc = imc;
        this.porcentajeGrasa = porcentajeGrasa;
        this.usuario = usuario;
    }

    public Long getId_datos() {
        return id_datos;
    }

    public void setId_datos(Long id_datos) {
        this.id_datos = id_datos;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public double getAltura() {
        return altura;
    }

    public void setAltura(double altura) {
        this.altura = altura;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public double getImc() {
        return imc;
    }

    public void setImc(double imc) {
        this.imc = imc;
    }

    public double getPorcentajeGrasa() {
        return porcentajeGrasa;
    }

    public void setPorcentajeGrasa(double porcentajeGrasa) {
        this.porcentajeGrasa = porcentajeGrasa;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "BiologicalData{" +
                "id_datos=" + id_datos +
                ", fecha=" + fecha +
                ", peso=" + peso +
                ", altura=" + altura +
                ", edad=" + edad +
                ", imc=" + imc +
                ", porcentajeGrasa=" + porcentajeGrasa +
                ", usuario=" + usuario +
                '}';
    }
}
