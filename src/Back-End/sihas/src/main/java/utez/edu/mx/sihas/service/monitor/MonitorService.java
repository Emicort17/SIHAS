package utez.edu.mx.sihas.service.monitor;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import utez.edu.mx.sihas.model.monitor.Monitor;
import utez.edu.mx.sihas.model.monitor.MonitorRepository;
import utez.edu.mx.sihas.model.monitoreo_user.MonitorUser;
import utez.edu.mx.sihas.model.monitor.MonitorDto;
import utez.edu.mx.sihas.model.monitoreo_user.MonitorUserRepository;

import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MonitorService {

    private final MonitorUserRepository monitorUserRepository;
    private final MonitorRepository monitorRepository;
    @Autowired
    public MonitorService(MonitorUserRepository monitorUserRepository, MonitorRepository monitorRepository) {
        this.monitorUserRepository = monitorUserRepository;
        this.monitorRepository = monitorRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(MonitorDto monitorDto, Long idUser) {

        if (monitorDto.getRequestStatus().length()> 30) {
            return new ResponseEntity<>(new Message("El estado de solicitud excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (monitorDto.getRequestDate() == null) {
            return new ResponseEntity<>(new Message("La fecha de solicitud es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (monitorDto.getRequestDate() == null) {
            return new ResponseEntity<>(new Message("La fecha de respues es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Monitor saveMonitor = new Monitor(monitorDto.getRequestStatus(),monitorDto.getRequestDate(),monitorDto.getResponseDate());
        saveMonitor = monitorRepository.saveAndFlush(saveMonitor);
        if (saveMonitor == null) {
            return new ResponseEntity<>(new Message("El control  no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }
        User userSave = new User();
        userSave.setId_user(idUser);
        MonitorUser saveMonitorUser = new MonitorUser(userSave,saveMonitor);
        monitorUserRepository .saveAndFlush(saveMonitorUser);

        return new ResponseEntity<>(new Message(saveMonitor, "El control se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(MonitorDto monitorDto) {
        Optional<Monitor> monitorUserOptional = monitorRepository.findById(monitorDto.getIdMonitor());
        if(!monitorUserOptional.isPresent()){
            return new ResponseEntity<>(new Message("El user no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (monitorDto.getRequestStatus().length()> 30) {
            return new ResponseEntity<>(new Message("El estado de solicitud excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (monitorDto.getRequestDate() == null) {
            return new ResponseEntity<>(new Message("La fecha de solicitud es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (monitorDto.getResponseDate() == null) {
            return new ResponseEntity<>(new Message("La fecha de respues es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Monitor monitorUserUpdate = monitorUserOptional.get();
        monitorUserUpdate.setRequestStatus(monitorDto.getRequestStatus());
        monitorUserUpdate.setRequestDate(monitorDto.getRequestDate());
        monitorUserUpdate.setResponseDate(monitorUserUpdate.getResponseDate());

        monitorUserUpdate = monitorRepository.saveAndFlush(monitorUserUpdate);

        if(monitorUserUpdate == null){
            return new ResponseEntity<>(new Message("El monitor de sueño no se actualizó",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(monitorUserUpdate,"El monitor de sueño se actualizó correctamente",TypesResponse.SUCCESS),HttpStatus.OK);
    }

    public ResponseEntity<Message> findMonitorPorUsuario(Long id) {
        List<Monitor> monitorUsersList = monitorUserRepository.findMonitoreosPorUsuario(id);
        return new ResponseEntity<>(new Message(monitorUsersList,"Listado de monitor usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAllByMonitorAllId(Long id) {
        List<Monitor> listMonitor = monitorUserRepository.findMonitoreosPorUsuario(id);
        return new ResponseEntity<>(new Message(listMonitor,"Listado de monitor usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }


    /*
    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAllById(Long id) {
        List<MonitorUser> monitorUsersList = monitorUserRepository.findAllById(Collections.singleton(id));
        return new ResponseEntity<>(new Message(monitorUsersList,"Listado de monitor usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByID(Long  id) {
        Optional<MonitorUser> monitorUserById = monitorUserRepository.findById(id);
        return new ResponseEntity<>(new Message(monitorUserById,"Listado de monitor by id", TypesResponse.SUCCESS), HttpStatus.OK);
    }
    */
}
