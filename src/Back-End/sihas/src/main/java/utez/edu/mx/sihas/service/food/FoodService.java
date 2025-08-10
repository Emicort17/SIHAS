package utez.edu.mx.sihas.service.food;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.alert.Alert;
import utez.edu.mx.sihas.model.alert.AlertDto;
import utez.edu.mx.sihas.model.food.Food;
import utez.edu.mx.sihas.model.food.FoodDto;
import utez.edu.mx.sihas.model.food.FoodRepository;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodSchedule;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodScheduleRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
@Service
@Transactional
public class FoodService {

    private final FoodRepository foodRepository;

    @Autowired
    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(FoodDto foodDto) {
        if (foodDto.getName().length() > 30) {
            return new ResponseEntity<>(new Message("El nombre excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getQuantity() == 0) {
            return new ResponseEntity<>(new Message("La cantidad debe ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getCalories() == 0) {
            return new ResponseEntity<>(new Message("Las calorias debe ser necesarias ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getProteins()==0) {
            return new ResponseEntity<>(new Message("Las proteinas deben de ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getFats()==0) {
            return new ResponseEntity<>(new Message("Las grasas deben ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getCarbohydrates()==0) {
            return new ResponseEntity<>(new Message("Los carbohidratos deben ser necesarios ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Food fodSave = new  Food(foodDto.getName()
               ,foodDto.getQuantity(),foodDto.getCalories(),foodDto.getProteins()
               ,foodDto.getFats(),foodDto.getCarbohydrates(), foodDto.getFiber());

        fodSave = foodRepository.saveAndFlush(fodSave);
        if (fodSave == null) {
            return new ResponseEntity<>(new Message("El alimento no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(fodSave, "El alimento registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }


    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(FoodDto foodDto) {
        Optional<Food> fooOptional = foodRepository.findById(foodDto.getId_food());

        if(!fooOptional.isPresent()){
            return new ResponseEntity<>(new Message("La alerta no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (foodDto.getName().length() > 30) {
            return new ResponseEntity<>(new Message("El nombre excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getQuantity() == 0) {
            return new ResponseEntity<>(new Message("La cantidad debe ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getCalories() == 0) {
            return new ResponseEntity<>(new Message("Las calorias debe ser necesarias ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getProteins()==0) {
            return new ResponseEntity<>(new Message("Las proteinas deben de ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getFats()==0) {
            return new ResponseEntity<>(new Message("Las grasas deben ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodDto.getCarbohydrates()==0) {
            return new ResponseEntity<>(new Message("Los carbohidratos deben ser necesarios ", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        if(foodDto.getFiber() == 0){
            return new ResponseEntity<>(new Message("La fibra debe ser necesaria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }


        Food foodUpdate = fooOptional.get();
        foodUpdate.setName(foodDto.getName());
        foodUpdate.setQuantity(foodDto.getQuantity());
        foodUpdate.setCalories(foodDto.getCalories());
        foodUpdate.setProteins(foodDto.getProteins());
        foodUpdate.setFats(foodDto.getFats());
        foodUpdate.setCarbohydrates(foodDto.getCarbohydrates());
        foodUpdate.setFiber(foodDto.getFiber());
        foodUpdate = foodRepository.saveAndFlush(foodUpdate);
        if (foodUpdate == null) {
            return new ResponseEntity<>(new Message("El alimento no se pudo actualizar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(foodUpdate, "El alimento se actualizo correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll() {
        List<Food> foodList = foodRepository.findAll();
        return new ResponseEntity<>(new Message(foodList,"Listado de alimentos", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByID(Long  id) {
        Optional<Food> foodList = foodRepository.findById(id);

        return new ResponseEntity<>(new Message(foodList,"Alimento por ID", TypesResponse.SUCCESS), HttpStatus.OK);
    }


}
