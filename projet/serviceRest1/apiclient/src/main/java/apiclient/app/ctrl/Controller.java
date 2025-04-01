package apiclient.app.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import apiclient.app.wrk.wrkDBManager;

@RestController
@RequestMapping("/client")
public class Controller {

    @Autowired
    private wrkDBManager dbManager;

    @GetMapping("/GetUsername")
    public ResponseEntity<String> getUsername() {
        String username = dbManager.getFirstUsername();
        System.out.println(username);
        return ResponseEntity.ok(username);
    }
}
