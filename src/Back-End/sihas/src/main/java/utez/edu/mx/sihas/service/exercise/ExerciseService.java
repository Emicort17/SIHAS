package utez.edu.mx.sihas.service.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.exercise.Exercise;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.model.exercise.ExerciseRepository;
import utez.edu.mx.sihas.model.exercise.ExerciseSimpleDto;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.model.user.UserSimpleDto;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll() {
        List<Exercise> exerciseList= exerciseRepository.findAll();
        List<ExerciseSimpleDto> result = exerciseList.stream()
                .map(e -> new ExerciseSimpleDto(
                        e.getIdExercise(),
                        e.getDate(),
                        e.getTime(),
                        e.getStatus(),
                        new UserSimpleDto(e.getUser().getId_user())
                ))
                .toList();
        return new ResponseEntity<>(new Message(result, "Listado de ejercicios", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(Long id) {
        Optional<Exercise> exercise = exerciseRepository.findById(id);
        if (exercise.isPresent()) {
            Exercise e = exercise.get();
            ExerciseSimpleDto dto = new ExerciseSimpleDto(
                    e.getIdExercise(),
                    e.getDate(),
                    e.getTime(),
                    e.getStatus(),
                    new UserSimpleDto(e.getUser().getId_user())
            );
            return new ResponseEntity<>(new Message(dto, "Ejercicio encontrado", TypesResponse.SUCCESS), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new Message("No se encontró el ejercicio", TypesResponse.SUCCESS), HttpStatus.OK);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByCurrentWeek(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate sunday = today.with(DayOfWeek.SUNDAY);

        List<Exercise> exercises = exerciseRepository.findByUserIdAndDateBetween(userId, monday, sunday);
        if (exercises.isEmpty()) {
            return new ResponseEntity<>(new Message("No hay ejercicios en la semana", TypesResponse.SUCCESS), HttpStatus.OK);
        }
        List<ExerciseSimpleDto> result = exercises.stream()
                .map(e -> new ExerciseSimpleDto(
                        e.getIdExercise(),
                        e.getDate(),
                        e.getTime(),
                        e.getStatus(),
                        new UserSimpleDto(e.getUser().getId_user())
                ))
                .toList();
        return new ResponseEntity<>(new Message(result, "Ejercicios de la semana", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(ExerciseDto exerciseDto) {
        if(exerciseDto.getDate() == null){
            return new ResponseEntity<>(new Message("El Fecha requerida", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if(exerciseDto.getTime() == null){
            return new ResponseEntity<>(new Message("El Dato requerido", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(exerciseDto.getUser())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + exerciseDto.getUser()));

        Exercise exercise = new Exercise(exerciseDto.getDate(),exerciseDto.getTime(),true, user);
        exercise = exerciseRepository.saveAndFlush(exercise);

        if(exercise == null){
            return new ResponseEntity<>(new Message("El ejercisio no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(exercise, "El ejercisio se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }



}
