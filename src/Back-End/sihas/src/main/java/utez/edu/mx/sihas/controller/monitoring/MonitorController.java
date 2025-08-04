package utez.edu.mx.sihas.controller.monitoring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.monitor.MonitorDto;
import utez.edu.mx.sihas.service.monitor.MonitorService;
import utez.edu.mx.sihas.utils.Message;

@RestController
@RequestMapping("/api/profesional/monitor")
public class MonitorController {

    private final MonitorService monitorService;

    @Autowired
    public MonitorController(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveMonitorSleep(@RequestBody MonitorDto sleepMonitorDto) {
        return monitorService.save(sleepMonitorDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateMonitorSleep(@RequestBody MonitorDto sleepMonitorDto) {
        return monitorService.update(sleepMonitorDto);
    }

    @GetMapping("/findAllBY/{id}")
    public ResponseEntity<Message> getAllMonitorById(@PathVariable Long id) {
        return monitorService.findMonitorPorUsuario(id);
    }
}
