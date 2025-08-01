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
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MonitorService {

    private final MonitorUserRepository monitorUserRepository;
    private final MonitorRepository monitorRepository;
    private final UserRepository userRepository;

    @Autowired
    public MonitorService(MonitorUserRepository monitorUserRepository, MonitorRepository monitorRepository, UserRepository userRepository) {
        this.monitorUserRepository = monitorUserRepository;
        this.monitorRepository = monitorRepository;
        this.userRepository = userRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(MonitorDto monitorDto) {

        if (monitorDto.getRequestStatus().length()> 30) {
            return new ResponseEntity<>(new Message("El estado de solicitud excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (monitorDto.getRequestDate() == null) {
            return new ResponseEntity<>(new Message("La fecha de solicitud es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        List<User> ListOfUsers = userRepository.findAllById(monitorDto.getUser());

        if (ListOfUsers.isEmpty()) {
            return new ResponseEntity<>(new Message("El usuario no existe", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
        }


        Monitor saveMonitor = new Monitor(
                monitorDto.getRequestStatus(),
                monitorDto.getRequestDate(),
                monitorDto.getResponseDate(),
                new ArrayList<>()
        );
        saveMonitor = monitorRepository.saveAndFlush(saveMonitor);
        List<MonitorUser> monitorUsers = new ArrayList<>();
        for (User user : ListOfUsers) {
            MonitorUser monitorUser = new MonitorUser(user, saveMonitor);
            monitorUserRepository.saveAndFlush(monitorUser);
            monitorUsers.add(monitorUser);
            saveMonitor.getMonitoreosUsuario().add(monitorUser);
        }

        saveMonitor.setMonitoreosUsuario(monitorUsers);
        if (saveMonitor == null) {
            return new ResponseEntity<>(new Message("El monitoreo no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(saveMonitor, "El monitoreo se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(MonitorDto monitorDto) {
        Optional<Monitor> monitorOptional = monitorRepository.findById(monitorDto.getIdMonitor());
        if(!monitorOptional.isPresent()){
            return new ResponseEntity<>(new Message("El user no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (monitorDto.getRequestStatus().length()> 30) {
            return new ResponseEntity<>(new Message("El estado de solicitud excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (monitorDto.getRequestDate() == null) {
            return new ResponseEntity<>(new Message("La fecha de solicitud es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Monitor monitorToUpdate = monitorOptional.get();
        monitorToUpdate.setRequestStatus(monitorDto.getRequestStatus());
        monitorToUpdate.setRequestDate(monitorDto.getRequestDate());
        monitorToUpdate.setResponseDate(monitorDto.getResponseDate());
        monitorToUpdate = monitorRepository.saveAndFlush(monitorToUpdate);

        List<User> listOfUsers = userRepository.findAllById(monitorDto.getUser());
        if (listOfUsers.size() != monitorDto.getUser().size()) {
            return new ResponseEntity<>(new Message("Uno o más IDs de usuarios proporcionados no existen", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
        }

        monitorUserRepository.deleteAllById(monitorToUpdate.getIdMonitor());

        List<MonitorUser> newMonitorUsers = new ArrayList<>();
        for (User user : listOfUsers) {
            MonitorUser monitorUser = new MonitorUser(user, monitorToUpdate);
            newMonitorUsers.add(monitorUser);
        }

        monitorToUpdate.setMonitoreosUsuario(newMonitorUsers);

        if(monitorToUpdate == null){
            return new ResponseEntity<>(new Message("El monitor de sueño no se actualizó",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(monitorToUpdate,"El monitor de sueño se actualizó correctamente",TypesResponse.SUCCESS),HttpStatus.OK);
    }

    public ResponseEntity<Message> findMonitorPorUsuario(Long id) {
        List<Monitor> monitorUsersList = monitorRepository.findMonitoreosPorUsuario(id);
        return new ResponseEntity<>(new Message(monitorUsersList,"Listado de monitor usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }

}
