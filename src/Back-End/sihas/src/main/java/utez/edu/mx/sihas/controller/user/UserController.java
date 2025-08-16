package utez.edu.mx.sihas.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sihas.controller.summary.dto.PatientSummaryDto;
import utez.edu.mx.sihas.model.user.ChangePasswordDto;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.service.summary.PatientSummaryService;
import utez.edu.mx.sihas.service.summary.ReportService;
import utez.edu.mx.sihas.service.user.UserService;
import utez.edu.mx.sihas.utils.Message;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/usuario")
public class UserController {
    private final UserService userService;
    private final PatientSummaryService patientSummaryService;
    private final ReportService reportService;

    @Autowired
    public UserController(UserService userService, PatientSummaryService patientSummaryService, ReportService reportService) {
        this.userService = userService;
        this.patientSummaryService = patientSummaryService;
        this.reportService = reportService;
    }

    @PostMapping("/register")
    public  ResponseEntity<Message> saveUser(@Validated(UserDto.Register.class) @RequestBody UserDto  userDto) {
        return userService.save(userDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getUseByID(@PathVariable Long id) {
        return userService.findByID(id);
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateUser(@Validated(UserDto.Modify.class) @RequestBody UserDto  userDto) {
        return userService.update(userDto);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Message> updateStatus(@Validated(UserDto.ChangeStatus.class) @PathVariable Long id) {
        return userService.updateStatus(id);
    }

    @PatchMapping("/update-password")
    public ResponseEntity<Message> updatePassword(@RequestBody ChangePasswordDto dto) {
        return userService.updatePassword(dto);
    }
    @GetMapping("/")
    public ResponseEntity<Message> getListPatient() {
        return userService.findpatients();
    }

    @GetMapping("/summary/pdf/{userId}")
    public ResponseEntity<InputStreamResource> getPatientSummaryPdf(@PathVariable Long userId) {
        try {
            ByteArrayInputStream bis = reportService.generatePatientReport(userId);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=patient_summary_" + userId + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/summary/{userId}")
    public PatientSummaryDto getSummary(@PathVariable Long userId) {
        return patientSummaryService.getSummaryForUser(userId);
    }
}
