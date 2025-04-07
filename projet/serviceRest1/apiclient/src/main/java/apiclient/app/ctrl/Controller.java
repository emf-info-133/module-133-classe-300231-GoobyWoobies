package apiclient.app.ctrl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import apiclient.app.wrk.wrkDBManager;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/client")
public class Controller {

    @Autowired
    private wrkDBManager dbManager;

    @GetMapping("/session/user")
    public ResponseEntity<String> getCurrentUser(HttpSession session) {
        String username = (String) session.getAttribute("username");

        if (username != null) {
            return ResponseEntity.ok(username);
        } else {
            return ResponseEntity.status(401).body("Not logged in");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        boolean isValid = dbManager.verifyLogin(username, password);

        if (isValid) {
            session.setAttribute("username", username);
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

}
