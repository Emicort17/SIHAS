package utez.edu.mx.sihas.service.food_schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.food.Food;
import utez.edu.mx.sihas.model.food.FoodDto;
import utez.edu.mx.sihas.model.food.FoodRepository;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodSchedule;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodScheduleRepository;
import utez.edu.mx.sihas.model.food_schedule.FoodSchedule;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleDto;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class FoodScheduleService {
    private final FoodScheduleRepository foodScheduleRepository;
    private final FoodFoodScheduleRepository foodFoodScheduleRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    @Autowired
    public FoodScheduleService(FoodScheduleRepository foodScheduleRepository, FoodFoodScheduleRepository foodFoodScheduleRepository, UserRepository userRepository, FoodRepository foodRepository) {
        this.foodScheduleRepository = foodScheduleRepository;
        this.foodFoodScheduleRepository = foodFoodScheduleRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll() {
        List<FoodSchedule> foodSchedules = foodScheduleRepository.findAll();
        if (foodSchedules.isEmpty()) {
            return new ResponseEntity<>(new Message("No hay horarios de alimentos registrados", TypesResponse.WARNING), HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(new Message(foodSchedules, "Horarios de alimentos encontrados", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(FoodScheduleDto foodScheduleDto,Long fodId) {
        if (foodScheduleDto.getDate() == null) {
            return new ResponseEntity<>(new Message("El nombre excedio el limite de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodScheduleDto.getTime() == null) {
            return new ResponseEntity<>(new Message("La cantidad debe ser necesarias", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(foodScheduleDto.getUser())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));

        List<Food> listOfFoods = foodRepository.findAllById(foodScheduleDto.getFoods());
        if (listOfFoods.isEmpty()) {
            return new ResponseEntity<>(new Message("No se encontraron alimentos con los IDs proporcionados", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        FoodSchedule foodScheduleSave =
                new FoodSchedule(
                        foodScheduleDto.getDate(),
                        foodScheduleDto.getTime(),
                        user);
        foodScheduleSave = foodScheduleRepository.saveAndFlush(foodScheduleSave);

        List<FoodFoodSchedule> foodFoodSchedules = new ArrayList<>();
        for (Food food : listOfFoods) {
            FoodFoodSchedule foodFoodSchedule = new FoodFoodSchedule(food, foodScheduleSave);
            foodFoodScheduleRepository.saveAndFlush(foodFoodSchedule);
            foodFoodSchedules.add(foodFoodSchedule);
        }

        foodScheduleSave.setFoodFoodSchedules(foodFoodSchedules);


        if (foodScheduleSave == null) {
            return new ResponseEntity<>(new Message("El horario de alimento no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(foodScheduleSave, "El horario de alimento se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(FoodScheduleDto foodScheduleDto) {
        Optional<FoodSchedule> foodScheduleOptional = foodScheduleRepository.findById(foodScheduleDto.getIdFoodSchedule());

        if(!foodScheduleOptional.isPresent()){
            return new ResponseEntity<>(new Message("El horario de alimento no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (foodScheduleDto.getDate() == null) {
            return new ResponseEntity<>(new Message("La fecha es obligatoria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (foodScheduleDto.getTime() == null) {
            return new ResponseEntity<>(new Message("El tiempo es obligatoria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(foodScheduleDto.getUser())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));

        FoodSchedule foodScheduleUpdate = foodScheduleOptional.get();
        foodScheduleUpdate.setIdFoodSchedule(foodScheduleDto.getIdFoodSchedule());
        foodScheduleUpdate.setUser(user);
        foodScheduleUpdate.setDate(foodScheduleDto.getDate());
        foodScheduleUpdate.setTime(foodScheduleDto.getTime());
        foodScheduleUpdate = foodScheduleRepository.saveAndFlush(foodScheduleUpdate);

        foodFoodScheduleRepository.deleteAllByIdFoodFoodSchedule(foodScheduleUpdate.getIdFoodSchedule());

        List<Food> listOfFoods = foodRepository.findAllById(foodScheduleDto.getFoods());

        List<FoodFoodSchedule> foodFoodSchedules = new ArrayList<>();
        for (Food food : listOfFoods) {
            FoodFoodSchedule foodFoodSchedule = new FoodFoodSchedule(food, foodScheduleUpdate);
            foodFoodSchedules.add(foodFoodSchedule);
        }

        foodScheduleUpdate.setFoodFoodSchedules(foodFoodSchedules);

        if (foodScheduleUpdate == null) {
            return new ResponseEntity<>(new Message("El horario no se pudo actualizar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(foodScheduleUpdate, "El horario se actualizo correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }
}
