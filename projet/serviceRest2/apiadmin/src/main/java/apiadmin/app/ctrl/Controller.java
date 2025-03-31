package apiadmin.app.ctrl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/admin")
public class Controller {
 
    @GetMapping("/hello")
    public ResponseEntity<String> visites() {
        return ResponseEntity.ok("Hello World");
    }
   
}
 
 