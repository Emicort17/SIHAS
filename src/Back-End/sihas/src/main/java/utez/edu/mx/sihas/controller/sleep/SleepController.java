package utez.edu.mx.sihas.controller.sleep;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.sleep.SleepDto;
import utez.edu.mx.sihas.service.sleep.SleepService;
import utez.edu.mx.sihas.utils.Message;

@RestController
@RequestMapping("/api/usuario/horario/dormir")
public class SleepController {

    public final SleepService sleepService;

    @Autowired
    public SleepController(SleepService sleepService) {
        this.sleepService = sleepService;
    }

    @GetMapping("/all")
    public ResponseEntity<Message> getAllSleep() {
        return sleepService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getSleepByID(@PathVariable Long id) {
        return sleepService.findByUser(id);
    }

    @PostMapping("/save")
    public  ResponseEntity<Message> saveSleep(@Validated(SleepDto.Register.class) @RequestBody SleepDto sleepDto) {
        return sleepService.save(sleepDto);
    }
}
