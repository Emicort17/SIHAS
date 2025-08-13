package utez.edu.mx.sihas.controller.alert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.alert.AlertDto;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataDto;
import utez.edu.mx.sihas.service.alert.AlertService;
import utez.edu.mx.sihas.utils.Message;

@RestController
@RequestMapping("/api/usuario/alert")
public class AlertController {

    public final AlertService alertService;

    @Autowired
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveAlert(@Validated(AlertDto.Register.class) @RequestBody AlertDto alertDto ) {
        return alertService.save(alertDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateAlert(@Validated(AlertDto.Modify.class) @RequestBody AlertDto alertDto) {
        return alertService.update(alertDto);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Message> updateStatus(@PathVariable Long id) {
        return alertService.updateStatus(id);
    }

    @GetMapping("/all")
    public ResponseEntity<Message> getAllAlerts() {
        return alertService.findAll();
    }

}
