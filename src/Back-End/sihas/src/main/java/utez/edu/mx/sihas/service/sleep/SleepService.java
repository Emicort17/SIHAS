package utez.edu.mx.sihas.service.sleep;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.rol.Rol;
import utez.edu.mx.sihas.model.sleep.Sleep;
import utez.edu.mx.sihas.model.sleep.SleepDto;
import utez.edu.mx.sihas.model.sleep.SleepRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.List;
import java.util.Set;

@Transactional
@Service
public class SleepService {

    private final SleepRepository sleepRepository;

    private final UserRepository userRepository;

    @Autowired
    public SleepService(SleepRepository sleepRepository, UserRepository userRepository) {
        this.sleepRepository = sleepRepository;
        this.userRepository = userRepository;
    }
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save( SleepDto sleep) {
        if (sleep.getDate() == null) {
            return new ResponseEntity<>(new Message("La fecha es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (sleep.getStartTime() == null) {
            return new ResponseEntity<>(new Message("La hora inicio necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (sleep.getEndTime() == null) {
            return new ResponseEntity<>(new Message("La hora fin necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (sleep.getTotalHours() == null || sleep.getTotalHours() == 0) {
            return new ResponseEntity<>(new Message("Total horas necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(sleep.getUser())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Sleep sleepSave = new  Sleep(sleep.getDate(),sleep.getStartTime(),sleep.getEndTime(),sleep.getTotalHours(), user);

        sleepSave = sleepRepository.saveAndFlush(sleepSave);
        if (sleepSave == null) {
            return new ResponseEntity<>(new Message("El sueño no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);

        }

        return new ResponseEntity<>(new Message(sleepSave, "El sueño se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll() {
        List<Sleep> sleepList = sleepRepository.findAll();
        return new ResponseEntity<>(new Message(sleepList,"Listado de sueño", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByUser(Long userId){
        List<Sleep> sleepList = sleepRepository.findByUserId(userId);
        if (sleepList.isEmpty()) {
            return new ResponseEntity<>(new Message(sleepList,"No hay registros de sueño para este usuario", TypesResponse.SUCCESS), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message(sleepList, "Listado de sueño del usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }


}
