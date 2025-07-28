package utez.edu.mx.sihas.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.service.user.UserService;
import utez.edu.mx.sihas.utils.Message;

@Controller
@RequestMapping("/usuario")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getUseByID(@PathVariable Long id) {
        return userService.findByID(id);
    }

    @PostMapping("/save")
    public  ResponseEntity<Message> saveUser(@RequestBody UserDto  userDto) {
        return userService.save(userDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateUser(@RequestBody UserDto  userDto) {
        return userService.update(userDto);
    }

    @PutMapping("/update/status/true")
    public ResponseEntity<Message> updateStatusTrue(@PathVariable Long id) {
        return userService.updateStatus(id,true);
    }

    @PutMapping("/update/status/false")
    public ResponseEntity<Message> updateStatusFalse(@PathVariable Long id) {
        return userService.updateStatus(id,false);
    }

    /*

    @GetMapping("/all")
    public ResponseEntity<Message> getAllProducts() {
        return questionsService.findAll();
    }

    @GetMapping("/all/activos")
    public  ResponseEntity<Message> getAllActivos() {
        return questionsService.findByStatusActivo();
    }
    @GetMapping("/all/inactivos")
    public  ResponseEntity<Message> getAllInactivos() {
        return questionsService.findByStatusInactive();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getProductById(@PathVariable Long id) {
        return questionsService.findById(id);
    }

    @PostMapping("/save")
    public  ResponseEntity<Message> saveProduct(@RequestBody QuestionsDto questionsDto) {
        return questionsService.save(questionsDto);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateProduct(@RequestBody QuestionsDto questionsDto) {
        return questionsService.update(questionsDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message> deleteProduct(@PathVariable Long id) {

        return questionsService.changeStatus(id);
    }
     */
}
