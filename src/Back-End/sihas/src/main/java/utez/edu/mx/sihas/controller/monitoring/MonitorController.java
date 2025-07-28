package utez.edu.mx.sihas.controller.monitoring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.monitor.MonitorDto;
import utez.edu.mx.sihas.service.monitor.MonitorService;
import utez.edu.mx.sihas.utils.Message;

@Controller
@RequestMapping("/usuario/sleepMonitor")
public class MonitorController {

    private final MonitorService monitorService;

    @Autowired
    public MonitorController(MonitorService monitorService) {
        this.monitorService = monitorService;
    }
    @PostMapping("/save/{idUser}")
    public ResponseEntity<Message> saveMonitorSleep(@RequestBody MonitorDto sleepMonitorDto, @PathVariable Long idUser) {
        return monitorService.save(sleepMonitorDto,idUser);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateMonitorSleep(@RequestBody MonitorDto sleepMonitorDto) {
        return monitorService.update(sleepMonitorDto);
    }

    @GetMapping("/findAllBY/{id}")
    public ResponseEntity<Message> getAllMonitorById(@PathVariable Long id) {
        return monitorService.findMonitorPorUsuario(id);
    }

    @GetMapping("/findAll/monitor/all/{id}")
    public ResponseEntity<Message> getAllMonitorUserById(@PathVariable Long id) {
        return monitorService.findMonitorPorUsuario(id);
    }
    /*
    @GetMapping("/finby/{id}")
    public ResponseEntity<Message> getMonitorByID(@PathVariable Long id) {
        return monitorService.findByID(id);
    }
     */
}
