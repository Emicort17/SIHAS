package utez.edu.mx.sihas.controller.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.service.exercise.ExerciseService;
import utez.edu.mx.sihas.utils.Message;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/usuario/ejercicio")
public class ExerciseController {
    private final ExerciseService   exerciseService;

    @Autowired
    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }
    @GetMapping("/all")
    public ResponseEntity<Message> getAllExercises() {
        return exerciseService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getExerciseById(@PathVariable Long id) {
        return exerciseService.findById(id);
    }

    @GetMapping("/semana/{id}")
    public ResponseEntity<Message> getExercisesByWeek(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return exerciseService.findByWeek(id, date);
    }

    @PostMapping("/save")
    public  ResponseEntity<Message> saveExercise(@Validated(ExerciseDto.Register.class) @RequestBody ExerciseDto exerciseDto) {
        return exerciseService.save(exerciseDto);
    }
}
