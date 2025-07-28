package utez.edu.mx.sihas.service.biological_data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.biological_data.BiologicalData;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataDto;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.Optional;

@Transactional
@Service
public class BiologicalDataService {

    private final BiologicalDataRepository  biologicalDataRepository;

    @Autowired
    public BiologicalDataService(BiologicalDataRepository biologicalDataRepository) {
        this.biologicalDataRepository = biologicalDataRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(BiologicalDataDto biologicalData) {
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

        BiologicalData biolicaDataSave = new BiologicalData(biologicalData.getDate(),biologicalData.getWeight(),biologicalData.getHeight()
                ,biologicalData.getAge(),biologicalData.getBmi(),biologicalData.getFatPercentage(),biologicalData.getUser());


        biolicaDataSave = biologicalDataRepository.saveAndFlush(biolicaDataSave);
        if (biolicaDataSave == null) {
            return new ResponseEntity<>(new Message("La biogical Data no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);

        }

        return new ResponseEntity<>(new Message(biolicaDataSave, "La biogical Data se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(BiologicalDataDto biologicalData) {
        Optional<BiologicalData> biologicaDataOptional = biologicalDataRepository.findById(biologicalData.getIdData());
        if(!biologicaDataOptional.isPresent()){
            return new ResponseEntity<>(new Message("El user no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
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
            return new ResponseEntity<>(new Message("La bioligica data no se actualizó",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(bioUpdate,"La bioligica data se actualizó correctamente",TypesResponse.SUCCESS),HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByID(Long  id) {
        Optional<BiologicalData> bioList = biologicalDataRepository.findById(id);
        return new ResponseEntity<>(new Message(bioList,"Listado de biologica data", TypesResponse.SUCCESS), HttpStatus.OK);
    }
}
