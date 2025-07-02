package utez.edu.mx.sihas.model.user;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Column(name = "nombre", columnDefinition = "VARCHAR(30)")
    private String name;

    @Column(name = "apellido_p", columnDefinition = "VARCHAR(30)")
    private String surname;

    @Column(name = "apellido_m", columnDefinition = "VARCHAR(30)")
    private String lastname;

    @Column(name = "correo", columnDefinition = "VARCHAR(30)")
    private String email;

    @Column(name = "contrasena", columnDefinition = "VARCHAR(30)")
    private String password;
}
