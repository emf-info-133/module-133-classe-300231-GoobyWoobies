package apiadmin.app.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apiadmin.app.wrk.WrkQuizz;
@RestController
@RequestMapping("/admin")
public class Controller {

    @Autowired
    private WrkQuizz wrkQuizz;

    @GetMapping("/GetCategorie")
    public ResponseEntity<String> getUsername() {
        String username = wrkQuizz.getFirstCategory();
        System.out.println(username);
        return ResponseEntity.ok(username);
    }
   
}
 
 