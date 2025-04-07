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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        boolean isValid = dbManager.verifyLogin(username, password);

        if (isValid) {
            session.setAttribute("username", username);
            System.out.println(session);
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/session")
    public ResponseEntity<String> getCurrentUser(HttpSession session) {
        // Récupère le nom d'utilisateur à partir de la session
        String username = (String) session.getAttribute("username");

        if (username != null) {
            // Si l'utilisateur est connecté, renvoie son nom
            return ResponseEntity.ok(username);
        } else {
            // Si l'utilisateur n'est pas connecté, renvoie un message d'erreur
            return ResponseEntity.status(401).body("Not logged in");
        }
    }

}
