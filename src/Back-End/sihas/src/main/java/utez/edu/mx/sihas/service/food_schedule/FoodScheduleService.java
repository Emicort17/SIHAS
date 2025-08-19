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
import utez.edu.mx.sihas.model.food_food_schedule.FoodScheduleFoodsDto;
import utez.edu.mx.sihas.model.food_schedule.FoodSchedule;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleDto;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.time.LocalDate;
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
        try {
            List<FoodSchedule> schedules = foodScheduleRepository.findAll();
            return new ResponseEntity<>(new Message(schedules, "Horarios obtenidos correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error al obtener horarios: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Message> findByUserAndDay(Long userId, LocalDate date) {
        List<FoodSchedule> schedules = foodScheduleRepository.findByUserIdAndDate(userId, date);
        if (schedules.isEmpty()) {
            return new ResponseEntity<>(new Message("No hay horarios para este usuario y día", TypesResponse.SUCCESS), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message(schedules, "Horarios encontrados", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<Message> save(FoodScheduleDto foodScheduleDto) {
        try {
            // Validate inputs
            if (foodScheduleDto.getDate() == null) {
                return new ResponseEntity<>(new Message("La fecha es obligatoria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }
            if (foodScheduleDto.getTime() == null) {
                return new ResponseEntity<>(new Message("La hora es obligatoria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }
            if (foodScheduleDto.getUser() == null) {
                return new ResponseEntity<>(new Message("El ID de usuario es obligatorio", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }

            // Check user existence
            User user = userRepository.findById(foodScheduleDto.getUser())
                    .orElseThrow(() -> new IllegalArgumentException("El usuario con ID " + foodScheduleDto.getUser() + " no existe"));

            // Check food IDs
            List<Food> foods = foodScheduleDto.getFoods() != null
                    ? foodRepository.findAllById(foodScheduleDto.getFoods())
                    : new ArrayList<>();
            if (!foodScheduleDto.getFoods().isEmpty() && foods.size() != foodScheduleDto.getFoods().size()) {
                return new ResponseEntity<>(new Message("Uno o más IDs de alimentos no son válidos", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }

            // Save FoodSchedule
            FoodSchedule foodSchedule = new FoodSchedule(
                    foodScheduleDto.getDate(),
                    foodScheduleDto.getTime(),
                    user
            );
            if (foodScheduleDto.getMealType() != null) {
                foodSchedule.setMealType(foodScheduleDto.getMealType());
            }
            foodSchedule = foodScheduleRepository.saveAndFlush(foodSchedule);

            // Save FoodFoodSchedule entries
            List<FoodFoodSchedule> foodFoodSchedules = new ArrayList<>();
            for (Food food : foods) {
                if (foodFoodScheduleRepository.existsByFoodIdAndFoodScheduleId(food.getId_food(), foodSchedule.getIdFoodSchedule())) {
                    continue;
                }
                FoodFoodSchedule foodFoodSchedule = new FoodFoodSchedule(food, foodSchedule);
                foodFoodSchedules.add(foodFoodScheduleRepository.saveAndFlush(foodFoodSchedule));
            }
            foodSchedule.setFoodFoodSchedules(foodFoodSchedules);

            return new ResponseEntity<>(new Message(foodSchedule, "Horario de alimento registrado correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new Message(e.getMessage(), TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error interno al registrar el horario: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<Message> update(FoodScheduleDto foodScheduleDto) {
        try {
            // Validate ID
            if (foodScheduleDto.getIdFoodSchedule() == null) {
                return new ResponseEntity<>(new Message("El ID del horario es obligatorio", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }

            // Check if FoodSchedule exists
            Optional<FoodSchedule> foodScheduleOptional = foodScheduleRepository.findById(foodScheduleDto.getIdFoodSchedule());
            if (!foodScheduleOptional.isPresent()) {
                return new ResponseEntity<>(new Message("El horario de alimento no existe", TypesResponse.ERROR), HttpStatus.NOT_FOUND);
            }

            // Validate inputs
            if (foodScheduleDto.getDate() == null) {
                return new ResponseEntity<>(new Message("La fecha es obligatoria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }
            if (foodScheduleDto.getTime() == null) {
                return new ResponseEntity<>(new Message("La hora es obligatoria", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }
            if (foodScheduleDto.getUser() == null) {
                return new ResponseEntity<>(new Message("El ID de usuario es obligatorio", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }

            // Check user existence
            User user = userRepository.findById(foodScheduleDto.getUser())
                    .orElseThrow(() -> new IllegalArgumentException("El usuario con ID " + foodScheduleDto.getUser() + " no existe"));

            // Check food IDs
            List<Food> foods = foodScheduleDto.getFoods() != null
                    ? foodRepository.findAllById(foodScheduleDto.getFoods())
                    : new ArrayList<>();
            if (!foodScheduleDto.getFoods().isEmpty() && foods.size() != foodScheduleDto.getFoods().size()) {
                return new ResponseEntity<>(new Message("Uno o más IDs de alimentos no son válidos", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }

            // Update FoodSchedule
            FoodSchedule foodSchedule = foodScheduleOptional.get();
            foodSchedule.setDate(foodScheduleDto.getDate());
            foodSchedule.setTime(foodScheduleDto.getTime());
            foodSchedule.setUser(user);
            if (foodScheduleDto.getMealType() != null) {
                foodSchedule.setMealType(foodScheduleDto.getMealType());
            }
            foodSchedule = foodScheduleRepository.saveAndFlush(foodSchedule);

            // Delete existing FoodFoodSchedule entries
            foodFoodScheduleRepository.deleteByFoodScheduleId(foodSchedule.getIdFoodSchedule());

            // Save new FoodFoodSchedule entries
            List<FoodFoodSchedule> foodFoodSchedules = new ArrayList<>();
            for (Food food : foods) {
                if (foodFoodScheduleRepository.existsByFoodIdAndFoodScheduleId(food.getId_food(), foodSchedule.getIdFoodSchedule())) {
                    continue;
                }
                FoodFoodSchedule foodFoodSchedule = new FoodFoodSchedule(food, foodSchedule);
                foodFoodSchedules.add(foodFoodScheduleRepository.saveAndFlush(foodFoodSchedule));
            }
            foodSchedule.setFoodFoodSchedules(foodFoodSchedules);

            return new ResponseEntity<>(new Message(foodSchedule, "El horario se actualizó correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new Message(e.getMessage(), TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error interno al actualizar el horario: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<Message> addFoodsToSchedule(FoodScheduleFoodsDto foodScheduleFoodsDto) {
        try {
            // Validate foodScheduleId
            FoodSchedule foodSchedule = foodScheduleRepository.findById(foodScheduleFoodsDto.getFoodScheduleId())
                    .orElseThrow(() -> new IllegalArgumentException("El horario con ID " + foodScheduleFoodsDto.getFoodScheduleId() + " no existe"));

            // Validate food IDs
            List<Food> foods = foodRepository.findAllById(foodScheduleFoodsDto.getFoods());
            if (foods.size() != foodScheduleFoodsDto.getFoods().size()) {
                return new ResponseEntity<>(new Message("Uno o más IDs de alimentos no son válidos", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
            }

            // Save FoodFoodSchedule entries
            List<FoodFoodSchedule> foodFoodSchedules = new ArrayList<>();
            for (Food food : foods) {
                if (foodFoodScheduleRepository.existsByFoodIdAndFoodScheduleId(food.getId_food(), foodSchedule.getIdFoodSchedule())) {
                    continue;
                }
                FoodFoodSchedule foodFoodSchedule = new FoodFoodSchedule(food, foodSchedule);
                foodFoodSchedules.add(foodFoodScheduleRepository.saveAndFlush(foodFoodSchedule));
            }

            foodSchedule.setFoodFoodSchedules(foodFoodSchedules);
            return new ResponseEntity<>(new Message(foodSchedule, "Alimentos agregados al horario correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new Message(e.getMessage(), TypesResponse.ERROR), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error interno al agregar alimentos: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
