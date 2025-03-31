package apiclient.app.ctrl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
public class Controller {

    @GetMapping("/Hello")
    public ResponseEntity<String> visites() {
        return ResponseEntity.ok("Hello World");
    }

}
