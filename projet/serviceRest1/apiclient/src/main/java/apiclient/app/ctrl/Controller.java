package apiclient.app.ctrl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import apiclient.app.wrk.wrkDBManager;
import jakarta.servlet.http.HttpServletRequest;
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

        System.out.println("🔍 Tentative de connexion pour: " + username);

        boolean isValid = dbManager.verifyLogin(username, password);
        System.out.println("🔍 Validation: " + isValid);

        if (isValid) {
            session.setAttribute("SessionUser", username);
            System.out.println("✅ Session créée: " + session.getId());
            return ResponseEntity.ok(session.getId());
        } else {
            System.out.println("❌ Identifiants invalides");
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/session")
    public ResponseEntity<String> getCurrentUser(
            @RequestParam(required = true) String sessionId,
            HttpServletRequest request) {

        System.out.println("🔍 API REST - Requête de session avec ID: " + sessionId);

        if (sessionId == null || sessionId.isEmpty()) {
            System.out.println("❌ SessionId manquant ou vide");
            return ResponseEntity.badRequest().body("Session ID is required");
        }

        // Pour tester, essayez d'abord de récupérer la session par son ID
        // sans utiliser request.getSession()
        try {
            // Imprimez toutes les sessions actives pour déboguer
            HttpSession session = request.getSession(false);

            if (session != null) {
                System.out.println("🔍 Session en cours: " + session.getId());
                System.out.println("🔍 Comparaison: " + sessionId + " vs " + session.getId());
                System.out.println("🔍 Égalité: " + session.getId().equals(sessionId));

                if (session.getId().equals(sessionId)) {
                    String username = (String) session.getAttribute("SessionUser");
                    System.out.println("✅ Utilisateur trouvé: " + username);
                    return username != null
                            ? ResponseEntity.ok(username)
                            : ResponseEntity.status(401).body("No user in session");
                }
            } else {
                System.out.println("❌ Aucune session active");
            }

            return ResponseEntity.status(401).body("Invalid session");
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }
}