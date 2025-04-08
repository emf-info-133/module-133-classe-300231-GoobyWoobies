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
    private HttpSession Currentsession;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        System.out.println("🔍 Tentative de connexion pour: " + username);

        boolean isValid = dbManager.verifyLogin(username, password);
        System.out.println("🔍 Validation: " + isValid);

        if (isValid) {
            Currentsession = session;
            Currentsession.setAttribute("username", username);
            System.out.println("✅ Session créée: " + session.getId());
            return ResponseEntity.ok(username); // Retourne le username plutôt que l'ID de session
        } else {
            System.out.println("❌ Identifiants invalides");
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/session")
    public ResponseEntity<String> getCurrentUser(HttpSession session) {
        if (Currentsession == null || Currentsession.getAttribute("username") == null) {
            System.out.println("❌ Aucun utilisateur connecté");
            return ResponseEntity.status(401).body("No user logged in");
        }
        
        String username = (String) Currentsession.getAttribute("username");
        System.out.println("✅ Utilisateur trouvé: " + username);
        return ResponseEntity.ok(username);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
    }
}