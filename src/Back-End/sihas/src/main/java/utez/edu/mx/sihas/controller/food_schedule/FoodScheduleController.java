package utez.edu.mx.sihas.controller.food_schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.food_food_schedule.FoodScheduleFoodsDto;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleDto;
import utez.edu.mx.sihas.service.food_schedule.FoodScheduleService;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/usuario/horarioalimento")
public class FoodScheduleController {

    private final FoodScheduleService foodScheduleService;

    @Autowired
    public FoodScheduleController(FoodScheduleService foodScheduleService) {
        this.foodScheduleService = foodScheduleService;
    }

    @GetMapping("/all")
    public ResponseEntity<Message> getAllFoodSchedules() {
        try {
            return foodScheduleService.findAll();
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error al obtener horarios: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/day/{userId}")
    public ResponseEntity<Message> findByUserAndDay(@PathVariable Long userId) {
        return foodScheduleService.findByUserAndDay(userId, java.time.LocalDate.now());
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveFoodSchedule(@Validated(FoodScheduleDto.Register.class) @RequestBody FoodScheduleDto foodScheduleDto) {
        try {
            return foodScheduleService.save(foodScheduleDto);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error al procesar la solicitud: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add-foods")
    public ResponseEntity<Message> addFoodsToSchedule(@Validated @RequestBody FoodScheduleFoodsDto foodScheduleFoodsDto) {
        try {
            return foodScheduleService.addFoodsToSchedule(foodScheduleFoodsDto);
        } catch (Exception e) {
            return new ResponseEntity<>(new Message("Error al agregar alimentos: " + e.getMessage(), TypesResponse.ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateFoodSchedule(
            @Validated(FoodScheduleDto.Modify.class) @RequestBody FoodScheduleDto foodScheduleDto) {
        return foodScheduleService.update(foodScheduleDto);
    }
}
