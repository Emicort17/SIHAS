package utez.edu.mx.sihas.controller.food;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.sihas.service.food.FatSecretFullImportService;

@RestController
@RequestMapping("/api/import")
public class FoodImportController {

    private final FatSecretFullImportService importService;

    public FoodImportController(FatSecretFullImportService importService) {
        this.importService = importService;
    }

    @PostMapping("/all")
    public String importAllFoods() throws Exception {
        importService.bulkImportAll();
        return "Importación masiva completada";
    }
}
