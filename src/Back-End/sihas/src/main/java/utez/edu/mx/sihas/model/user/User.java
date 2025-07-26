package utez.edu.mx.sihas.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.sihas.model.alert.Alert;
import utez.edu.mx.sihas.model.biological_data.BiologicalData;
import utez.edu.mx.sihas.model.exercise.Exercise;
import utez.edu.mx.sihas.model.food_schedule.FoodSchedule;
import utez.edu.mx.sihas.model.monitoreo_user.MonitorUser;
import utez.edu.mx.sihas.model.rol.Rol;
import utez.edu.mx.sihas.model.sleep.Sleep;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "Usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id_user;

    @Column(name = "nombre", columnDefinition = "VARCHAR(30)")
    private String name;

    @Column(name = "apellido_p", columnDefinition = "VARCHAR(30)")
    private String surname;

    @Column(name = "apellido_m", columnDefinition = "VARCHAR(30)")
    private String lastname;

    @Column(name = "correo", columnDefinition = "VARCHAR(30)")
    private String email;

    @Column(name = "contrasena")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonIgnore
    private Set<Rol> roles = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<FoodSchedule> foodSchedules;

    @OneToMany(mappedBy = "user")
    private List<MonitorUser> monitoreosUsuario;

    @OneToMany(mappedBy = "user")
    private List<Alert> alerts;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Exercise exercise;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Sleep sleep;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private BiologicalData biologicalData;

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Long getId_user() {
        return id_user;
    }

    public void setId_user(Long id_user) {
        this.id_user = id_user;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public BiologicalData getBiologicalData() {
        return biologicalData;
    }

    public void setBiologicalData(BiologicalData biologicalData) {
        this.biologicalData = biologicalData;
    }

    public Sleep getSleep() {
        return sleep;
    }

    public void setSleep(Sleep sleep) {
        this.sleep = sleep;
    }

    public List<FoodSchedule> getFoodSchedules() {
        return foodSchedules;
    }

    public void setFoodSchedules(List<FoodSchedule> foodSchedules) {
        this.foodSchedules = foodSchedules;
    }

    public List<MonitorUser> getMonitoreosUsuario() {
        return monitoreosUsuario;
    }

    public void setMonitoreosUsuario(List<MonitorUser> monitoreosUsuario) {
        this.monitoreosUsuario = monitoreosUsuario;
    }

    public List<Alert> getAlerts() {
        return alerts;
    }

    public void setAlerts(List<Alert> alerts) {
        this.alerts = alerts;
    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }

    public User() {
    }

    public User(String email, String lastname, String name, String password, String surname) {
        this.email = email;
        this.id_user = id_user;
        this.lastname = lastname;
        this.name = name;
        this.password = password;
        this.surname = surname;
    }

}
