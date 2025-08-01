package utez.edu.mx.sihas.model.rol;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Rol")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRole;

    @Column(name = "nombre", columnDefinition = "VARCHAR(30)")
    private String name;

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Long getIdRole() {
        return idRole;
    }

    public void setIdRole(Long idRole) {
        this.idRole = idRole;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Rol() {
    }

    public Rol(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Rol{" +
                "id_rol=" + idRole +
                ", name='" + name + '\'' +
                '}';
    }
}

