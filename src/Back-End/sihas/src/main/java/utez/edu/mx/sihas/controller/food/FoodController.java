package utez.edu.mx.sihas.controller.food;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.food.FoodDto;
import utez.edu.mx.sihas.model.monitor.MonitorDto;
import utez.edu.mx.sihas.service.food.FoodService;
import utez.edu.mx.sihas.utils.Message;

@RestController
@RequestMapping("/api/usuario/alimento")
public class FoodController {

    private final FoodService foodService;

    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveAlimento(@Validated(FoodDto.Register.class) @RequestBody FoodDto foodDto) {
        return foodService.save(foodDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateAlimento(@Validated(FoodDto.Modify.class)@RequestBody FoodDto foodDto) {
        return foodService.update(foodDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getAlimentoById(@PathVariable Long id) {
        return foodService.findByID(id);
    }

    @GetMapping("/all")
    public ResponseEntity<Message> getAllAlimento() {
        return foodService.findAll();
    }

}
