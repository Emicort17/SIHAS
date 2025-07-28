package utez.edu.mx.sihas.controller.food;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.food.FoodDto;
import utez.edu.mx.sihas.model.monitor.MonitorDto;
import utez.edu.mx.sihas.service.food.FoodService;
import utez.edu.mx.sihas.utils.Message;

@Controller
@RequestMapping("/usuario/alimento")
public class FoodController {

    private final FoodService foodService;

    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveAlimento(@RequestBody FoodDto foodDto) {
        return foodService.save(foodDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateMonitorSleep(@RequestBody FoodDto foodDto) {
        return foodService.update(foodDto);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Message> getAllMonitorById(@PathVariable Long id) {
        return foodService.findByID(id);
    }

    @GetMapping("/all")
    public ResponseEntity<Message> getAllPesonas() {
        return foodService.findAll();
    }

    @GetMapping("/all/food/by/user/{id}")
    public ResponseEntity<Message> getAllfoodByUserID (@PathVariable Long id) {
        return foodService.findAllFood(id);
    }

}
