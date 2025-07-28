package utez.edu.mx.sihas.controller.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.service.exercise.ExerciseService;
import utez.edu.mx.sihas.utils.Message;

@Controller
@RequestMapping("/usuario/ejercisio")
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

    @PostMapping("/save")
    public  ResponseEntity<Message> saveExercise(@RequestBody ExerciseDto exerciseDto) {
        return exerciseService.save(exerciseDto);
    }
}
