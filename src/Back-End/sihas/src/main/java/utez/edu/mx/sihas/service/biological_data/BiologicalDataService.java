package utez.edu.mx.sihas.service.biological_data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.biological_data.BiologicalData;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataDto;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.Optional;

@Transactional
@Service
public class BiologicalDataService {

    private final BiologicalDataRepository  biologicalDataRepository;

    private final UserRepository userRepository;

    @Autowired
    public BiologicalDataService(BiologicalDataRepository biologicalDataRepository,
                                  UserRepository userRepository) {
        this.biologicalDataRepository = biologicalDataRepository;
        this.userRepository = userRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(BiologicalDataDto biologicalDataDto) {
        if (biologicalDataDto.getDate() == null) {
            return new ResponseEntity<>(new Message("La fecha es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalDataDto.getWeight() == null || biologicalDataDto.getWeight() == 0) {
            return new ResponseEntity<>(new Message("El peso el necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalDataDto.getHeight() == null || biologicalDataDto.getHeight() ==0) {
            return new ResponseEntity<>(new Message("La altura es necesaria ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalDataDto.getAge()== null ||  biologicalDataDto.getAge() ==0) {
            return new ResponseEntity<>(new Message("La edad es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalDataDto.getBmi() == null ||  biologicalDataDto.getBmi() ==0) {
            return new ResponseEntity<>(new Message("El bmi es necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalDataDto.getFatPercentage() == null ||  biologicalDataDto.getFatPercentage() ==0) {
            return new ResponseEntity<>(new Message("El porcentaje de grasa es necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Optional<User> userOptional = userRepository.findById(biologicalDataDto.getUser());

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(new Message("El usuario no existe", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
        }

        Optional<BiologicalData> existingBioData = biologicalDataRepository.findByUser(userOptional.get());

        if (existingBioData.isPresent()) {
            return new ResponseEntity<>(new Message("Este usuario ya tiene datos biológicos asignados", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        User user = userOptional.get();

        BiologicalData biologicalData = new BiologicalData(
                biologicalDataDto.getDate(),
                biologicalDataDto.getWeight(),
                biologicalDataDto.getHeight(),
                biologicalDataDto.getAge(),
                biologicalDataDto.getBmi(),
                biologicalDataDto.getFatPercentage(),
                user
        );

        biologicalData = biologicalDataRepository.saveAndFlush(biologicalData);

        if (biologicalData == null) {
            return new ResponseEntity<>(new Message("los datos biologicos no se pudieron ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);

        }

        return new ResponseEntity<>(new Message(biologicalData, "Los datos biologicos se registraron correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(BiologicalDataDto biologicalData) {
        Optional<User> userOptional = userRepository.findById(biologicalData.getUser());
        if(userOptional.isEmpty()){
            return new ResponseEntity<>(new Message("El usuario no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }
        Optional<BiologicalData> biologicaDataOptional = biologicalDataRepository.findById(biologicalData.getIdData());
        if (biologicaDataOptional.isEmpty()) {
            return new ResponseEntity<>(new Message("no existen estos datos biologicos", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
        }

        if (biologicalData.getDate() == null) {
            return new ResponseEntity<>(new Message("La fecha es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalData.getWeight() == null || biologicalData.getWeight() == 0) {
            return new ResponseEntity<>(new Message("El peso el necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalData.getHeight() == null || biologicalData.getHeight() ==0) {
            return new ResponseEntity<>(new Message("La altura es necesaria ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalData.getAge()== null ||  biologicalData.getAge() ==0) {
            return new ResponseEntity<>(new Message("La edad es necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalData.getBmi() == null ||  biologicalData.getBmi() ==0) {
            return new ResponseEntity<>(new Message("El bmi es necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (biologicalData.getFatPercentage() == null ||  biologicalData.getFatPercentage() ==0) {
            return new ResponseEntity<>(new Message("El porcentaje de grasa es necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        BiologicalData bioUpdate = biologicaDataOptional.get();
        bioUpdate.setDate(biologicalData.getDate());
        bioUpdate.setWeight(biologicalData.getWeight());
        bioUpdate.setHeight(biologicalData.getHeight());
        bioUpdate.setAge(biologicalData.getAge());
        bioUpdate.setBmi(biologicalData.getBmi());
        bioUpdate.setFatPercentage(biologicalData.getFatPercentage());

        bioUpdate = biologicalDataRepository.saveAndFlush(bioUpdate);

        if(bioUpdate == null){
            return new ResponseEntity<>(new Message("Los datos biologicos no se actualizaron",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(bioUpdate,"Los datos biologicos se actualizo correctamente",TypesResponse.SUCCESS),HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByID(Long  id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(new Message("El usuario no existe", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
        }
        Optional<BiologicalData> biologicalData = biologicalDataRepository.findByUser(userOptional.get());
        if (biologicalData.isEmpty()) {
            return new ResponseEntity<>(new Message("No se encontraron datos biológicos para este usuario", TypesResponse.WARNING), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new Message(biologicalData.get(), "Datos biológicos del usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }
}
