package utez.edu.mx.sihas.model.rol;

import jakarta.persistence.*;

@Entity
@Table(name = "Rol")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_rol;

    @Column(name = "nombre", columnDefinition = "VARCHAR(30)")
    private String name;
}

