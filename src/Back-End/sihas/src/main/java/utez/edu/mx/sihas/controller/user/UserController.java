package utez.edu.mx.sihas.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.controller.summary.dto.PatientSummaryDto;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.service.summary.PatientSummaryService;
import utez.edu.mx.sihas.service.user.UserService;
import utez.edu.mx.sihas.utils.Message;

@RestController
@RequestMapping("/api/usuario")
public class UserController {
    private final UserService userService;
    private final PatientSummaryService patientSummaryService;
    @Autowired
    public UserController(UserService userService, PatientSummaryService patientSummaryService) {
        this.userService = userService;
        this.patientSummaryService = patientSummaryService;
    }

    @PostMapping("/register")
    public  ResponseEntity<Message> saveUser(@RequestBody UserDto  userDto) {
        return userService.save(userDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getUseByID(@PathVariable Long id) {
        return userService.findByID(id);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateUser(@RequestBody UserDto  userDto) {
        return userService.update(userDto);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Message> updateStatus(@PathVariable Long id) {
        return userService.updateStatus(id);
    }

    @GetMapping("/summary/{userId}")
    @ResponseBody
    public PatientSummaryDto getSummary(@PathVariable Long userId) {
        return patientSummaryService.getSummaryForUser(userId);
    }
}
