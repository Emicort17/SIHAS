package utez.edu.mx.sihas.service.alert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.alert.Alert;
import utez.edu.mx.sihas.model.alert.AlertDto;
import utez.edu.mx.sihas.model.alert.AlertRepository;
import utez.edu.mx.sihas.model.biological_data.BiologicalData;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataDto;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;


    @Autowired
    public AlertService(AlertRepository alertRepository, UserRepository userRepository) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(AlertDto alertDto) {
        if (alertDto.getType_alert().length() > 30) {
            return new ResponseEntity<>(new Message("El tipo de alerta excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (alertDto.getDescription().length() > 50) {
            return new ResponseEntity<>(new Message("La descripcion excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        if(alertDto.getScheduled_date() == null) {
            return new ResponseEntity<>(new Message("La fecha programada es necesaria ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        if (alertDto.getScheduled_time() == null) {
            return new ResponseEntity<>(new Message("La hora es necesaria ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        if (alertDto.getOneDay() == null) {
            return new ResponseEntity<>(new Message("El estatus de hoy es necesario ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        if (alertDto.getIdRelacionado() == 0||alertDto.getIdRelacionado() == null ) {
            return new ResponseEntity<>(new Message("El id relacionado es necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findById(alertDto.getUser())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Alert alert= new Alert(alertDto.getDescription()
                ,alertDto.getId_alert(), alertDto.getIdRelacionado()
                ,alertDto.getOneDay(), alertDto.getScheduled_date()
                ,alertDto.getScheduled_time(), alertDto.getStatus()
                ,alertDto.getType_alert(), user);


        alert = alertRepository.saveAndFlush(alert);
        if (alert == null) {
            return new ResponseEntity<>(new Message("La alerta no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);

        }

        return new ResponseEntity<>(new Message(alert, "La alerta se  registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(AlertDto alertDto) {
        Optional<Alert> alertaOptional = alertRepository.findById(alertDto.getId_alert());

        if(!alertaOptional.isPresent()){
            return new ResponseEntity<>(new Message("La alerta no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (alertDto.getType_alert().length() > 30) {
            return new ResponseEntity<>(new Message("El tipo de alerta excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (alertDto.getDescription().length() > 50) {
            return new ResponseEntity<>(new Message("La descripcion excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (alertDto.getScheduled_date() == null) {
            return new ResponseEntity<>(new Message("La fecha programada es necesaria ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (alertDto.getScheduled_time() == null) {
            return new ResponseEntity<>(new Message("La hora es necesaria ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (alertDto.getOneDay() == null) {
            return new ResponseEntity<>(new Message("El estatus de hoy es necesario ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (alertDto.getIdRelacionado() == 0||alertDto.getIdRelacionado() == null ) {
            return new ResponseEntity<>(new Message("El id relacionado es necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Alert alerUpdate = alertaOptional.get();
        alerUpdate.setType_alert(alertDto.getType_alert());
        alerUpdate.setDescription(alertDto.getDescription());
        alerUpdate.setStatus(alertDto.getStatus());
        alerUpdate.setOneDay(alertDto.getOneDay());
        alerUpdate.setScheduled_time(alertDto.getScheduled_time());
        alerUpdate.setScheduled_date(alertDto.getScheduled_date());
        alerUpdate.setIdRelacionado(alertDto.getIdRelacionado());

        if (alerUpdate == null) {
            return new ResponseEntity<>(new Message("La alerta no se pudo actualizar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(alerUpdate, "La alerta se actualizo correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }


    public ResponseEntity<Message> updateStatus(Long id) {
        Optional<Alert> alertaOptional = alertRepository.findById(id);

        if (!alertaOptional.isPresent()) {
            return new ResponseEntity<>(new Message("Alerta no encontrada",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        Alert alerUpdate = alertaOptional.get();
        alerUpdate.setStatus(!alerUpdate.getStatus());
        alertRepository.saveAndFlush(alerUpdate);

        return new ResponseEntity<>(new Message(alerUpdate.getStatus(), "Se ha atualizado el status", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll() {
        List<Alert> alerts = alertRepository.findAll();
        return new ResponseEntity<>(new Message(alerts,"Listado de alertas", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAllByUser(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(new Message("Usuario no encontrado", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
        }
        User user = userOptional.get();
        List<Alert> alerts = alertRepository.findAllByUser(user);
        if (alerts.isEmpty()) {
            return new ResponseEntity<>(new Message("No hay alertas para este usuario", TypesResponse.WARNING), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message(alerts, "Listado de alertas del usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }
}
