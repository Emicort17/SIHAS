package utez.edu.mx.sihas.controller.food_schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.food_schedule.FoodScheduleDto;
import utez.edu.mx.sihas.service.food_schedule.FoodScheduleService;
import utez.edu.mx.sihas.utils.Message;

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
    public ResponseEntity<Message> findAllFoodSchedules() {
        return foodScheduleService.findAll();
    }

    // Ya trae del día actual
    @GetMapping("/day/{userId}")
    public ResponseEntity<Message> findByUserAndDay(@PathVariable Long userId) {
        return foodScheduleService.findByUserAndDay(userId, java.time.LocalDate.now());
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveFoodSchedule(
            @Validated(FoodScheduleDto.Register.class) @RequestBody FoodScheduleDto foodScheduleDto) {
        return foodScheduleService.save(foodScheduleDto, foodScheduleDto.getIdFoodSchedule());
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateFoodSchedule(
            @Validated(FoodScheduleDto.Modify.class) @RequestBody FoodScheduleDto foodScheduleDto) {
        return foodScheduleService.update(foodScheduleDto);
    }
}
