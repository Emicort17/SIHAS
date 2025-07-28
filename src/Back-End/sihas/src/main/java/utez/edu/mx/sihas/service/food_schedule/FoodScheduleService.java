package utez.edu.mx.sihas.service.food_schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.food.Food;
import utez.edu.mx.sihas.model.food.FoodDto;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodSchedule;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodScheduleRepository;
import utez.edu.mx.sihas.model.food_schedule.FoodSchedule;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleDto;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.Optional;

@Transactional
@Service
public class FoodScheduleService {
    private final FoodScheduleRepository foodScheduleRepository;
    private final FoodFoodScheduleRepository foodFoodScheduleRepository;

    @Autowired
    public FoodScheduleService(FoodScheduleRepository foodScheduleRepository, FoodFoodScheduleRepository foodFoodScheduleRepository) {
        this.foodScheduleRepository = foodScheduleRepository;
        this.foodFoodScheduleRepository = foodFoodScheduleRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(FoodScheduleDto foodScheduleDto,Long fodId) {
        if (foodScheduleDto.getDate() == null) {
            return new ResponseEntity<>(new Message("El nombre excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodScheduleDto.getTime() == null) {
            return new ResponseEntity<>(new Message("La cantidad debe ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        FoodSchedule foodScheduleSave = new FoodSchedule(foodScheduleDto.getDate(), foodScheduleDto.getTime(), foodScheduleDto.getUser());

        foodScheduleSave = foodScheduleRepository.saveAndFlush(foodScheduleSave);
        if (foodScheduleSave == null) {
            return new ResponseEntity<>(new Message("El horario de alimento no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        } else {
            Food fodSave = new Food();
            fodSave.setId_food(fodId);
            FoodFoodSchedule foodFoodScheduleSave = new FoodFoodSchedule(fodSave, foodScheduleSave);
            foodFoodScheduleRepository.saveAndFlush(foodFoodScheduleSave);
            return new ResponseEntity<>(new Message(foodScheduleSave, "El horario de alimento se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
        }

    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(FoodScheduleDto foodScheduleDto) {
        Optional<FoodSchedule> foodScheduleOptional = foodScheduleRepository.findById(foodScheduleDto.getIdFoodSchedule());

        if(!foodScheduleOptional.isPresent()){
            return new ResponseEntity<>(new Message("La alerta no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (foodScheduleDto.getDate() == null) {
            return new ResponseEntity<>(new Message("El nombre excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodScheduleDto.getTime() == null) {
            return new ResponseEntity<>(new Message("La cantidad debe ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        FoodSchedule foodScheduleUpdate = new FoodSchedule();

        foodScheduleUpdate.setDate(foodScheduleDto.getDate());
        foodScheduleUpdate.setTime(foodScheduleDto.getTime());

        foodScheduleUpdate = foodScheduleRepository.saveAndFlush(foodScheduleUpdate);
        if (foodScheduleUpdate == null) {
            return new ResponseEntity<>(new Message("El horario no se pudo actualizar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(foodScheduleUpdate, "El horario se actualizo correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }
}
