package utez.edu.mx.sihas.model.food;

import jakarta.persistence.*;

@Entity
@Table(name = "Alimento")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_food;

    @Column(name = "nombre", columnDefinition = "VARCHAR(30)")
    private String name;

    @Column(name = "cantidad", columnDefinition = "INT")
    private Integer quantity;

    @Column(name = "calorias", columnDefinition = "DOUBLE")
    private Double calories;

    @Column(name = "proteinas", columnDefinition = "DOUBLE")
    private Double proteins;

    @Column(name = "grasas", columnDefinition = "DOUBLE")
    private Double fats;

    @Column(name = "carbohidratos", columnDefinition = "DOUBLE")
    private Double carbohydrates;

}

