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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "Usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

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

    @Column(name = "status", columnDefinition = "boolean")
    private boolean status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Rol> roles = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<FoodSchedule> foodSchedules;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<MonitorUser> monitoreosUsuario;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Alert> alerts;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Sleep> sleeps = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Exercise> exercises = new ArrayList<>();

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
        return id;
    }

    public void setId_user(Long id_user) {
        this.id = id_user;
    }

    public BiologicalData getBiologicalData() {
        return biologicalData;
    }

    public void setBiologicalData(BiologicalData biologicalData) {
        this.biologicalData = biologicalData;
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

    public void setMonitoreosUsuario(List<MonitorUser> monitoreosUsuario) {this.monitoreosUsuario = monitoreosUsuario;}

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

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public List<Exercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Sleep> getSleeps() {
        return sleeps;
    }

    public void setSleeps(List<Sleep> sleeps) {
        this.sleeps = sleeps;
    }

    public User() {
    }

    public User(String name, String surname, String lastname, String email, String password, boolean status) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.status = status;
    }
}
