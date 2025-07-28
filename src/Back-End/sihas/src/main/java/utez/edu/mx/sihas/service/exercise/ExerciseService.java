package utez.edu.mx.sihas.service.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.exercise.Exercise;
import utez.edu.mx.sihas.model.exercise.ExerciseDto;
import utez.edu.mx.sihas.model.exercise.ExerciseRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll() {
        List<Exercise> exerciseList= exerciseRepository.findAll();
        if(!exerciseList.isEmpty()){
            return new ResponseEntity<>(new Message(exerciseList,"Listado de ejercisios", TypesResponse.SUCCESS), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(new Message(exerciseList,"No existe listado", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(ExerciseDto exerciseDto) {
        if(exerciseDto.getDate() == null){
            return new ResponseEntity<>(new Message("El Fecha requerida", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if(exerciseDto.getTime() == null){
            return new ResponseEntity<>(new Message("El Dato requerido", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        Exercise exercise = new Exercise(exerciseDto.getDate(),exerciseDto.getTime(),true,exerciseDto.getUser());
        exercise = exerciseRepository.saveAndFlush(exercise);

        if(exercise == null){
            return new ResponseEntity<>(new Message("El ejercisio no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(exercise, "El ejercisio se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }



}
