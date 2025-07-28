package utez.edu.mx.sihas.controller.biological_data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.biological_data.BiologicalDataDto;
import utez.edu.mx.sihas.service.biological_data.BiologicalDataService;
import utez.edu.mx.sihas.utils.Message;

@Controller
@RequestMapping("/usuario/biologicalData")
public class BiologicalDataController {
    private final BiologicalDataService biologicalDataService;

    @Autowired
    public BiologicalDataController(BiologicalDataService biologicalDataService) {
        this.biologicalDataService = biologicalDataService;
    }

    @PostMapping("/save")
    public ResponseEntity<Message> saveBiologicalData(@RequestBody BiologicalDataDto biologicalDataDto) {
        return biologicalDataService.save(biologicalDataDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateBiologicalData(@RequestBody BiologicalDataDto biologicalDataDto) {
        return biologicalDataService.update(biologicalDataDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getUseByID(@PathVariable Long id) {
        return biologicalDataService.findByID(id);
    }

}
