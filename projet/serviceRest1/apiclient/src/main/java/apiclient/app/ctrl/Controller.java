package apiclient.app.ctrl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import apiclient.app.wrk.wrkDBManager;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/client")
public class Controller {

    @Autowired
    private wrkDBManager dbManager;
    private HttpSession Currentsession;
    private final JdbcTemplate jdbcTemplate = new JdbcTemplate();

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
    public ResponseEntity<String> getCurrentUser() {
        if (Currentsession == null || Currentsession.getAttribute("username") == null) {
            System.out.println("❌ Aucun utilisateur connecté");
            return ResponseEntity.status(401).body("No user logged in");
        }

        String username = (String) Currentsession.getAttribute("username");
        System.out.println("✅ Utilisateur trouvé: " + username);
        return ResponseEntity.ok(username);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        System.out.println("ok");
        if (Currentsession != null) {
            Currentsession.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<String> getLeaderboard() {
        try {
            System.out.println("🔄 Début de la méthode getLeaderboard");
            
            // Récupérer l'utilisateur connecté
            String currentUsername = (String) Currentsession.getAttribute("username");
            System.out.println("👤 Username en session: " + currentUsername);
            
            if (currentUsername == null) {
                System.out.println("❌ Utilisateur non connecté");
                return ResponseEntity.badRequest().body("{\"error\": \"Utilisateur non connecté\"}");
            }
    
            // Appeler le service pour récupérer le leaderboard
            System.out.println("🔄 Récupération du leaderboard depuis la base de données...");
            Map<String, Object> leaderboardData = dbManager.getLeaderboard(currentUsername);
    
            if (leaderboardData == null) {
                System.out.println("❌ Échec de récupération des données du leaderboard");
                return ResponseEntity.badRequest().body("{\"error\": \"Erreur lors de la récupération des données\"}");
            }
    
            System.out.println("✅ Leaderboard récupéré avec succès");
            // Retourner la réponse JSON
            return ResponseEntity.ok(new ObjectMapper().writeValueAsString(leaderboardData));
    
        } catch (Exception e) {
            // En cas d'erreur, afficher l'erreur complète
            System.out.println("❌ Exception dans /leaderboard: " + e.getMessage());
            e.printStackTrace();
            // Retourner une erreur avec un message
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/saveScore")
    public ResponseEntity<String> saveScore(@RequestBody Map<String, Object> scoreData, HttpSession session) {
        // Vérifier si l'utilisateur est connecté
        if (Currentsession == null || Currentsession.getAttribute("username") == null) {
            System.out.println("❌ Tentative d'enregistrement de score sans être connecté");
            return ResponseEntity.status(401).body("Utilisateur non connecté");
        }

        String username = (String) Currentsession.getAttribute("username");

        // Récupérer les données du score
        Integer score = (Integer) scoreData.get("score");

        // Vérifier que les données nécessaires sont présentes
        if (score == null) {
            System.out.println("❌ Données incomplètes pour l'enregistrement du score");
            return ResponseEntity.badRequest().body("Données incomplètes");
        }

        System.out.println("🔍 Enregistrement du score pour: " + username + ", Score: " + score);

        boolean success = dbManager.saveUserScore(username, score);

        if (success) {
            return ResponseEntity.ok("Score enregistré avec succès");
        } else {
            return ResponseEntity.status(500).body("Erreur lors de l'enregistrement du score");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
 
        System.out.println("🔍 Tentative d'inscription pour: " + username);
 
        // Vérifier si l'utilisateur existe déjà
        if (dbManager.userExists(username)) {
            System.out.println("❌ Utilisateur existe déjà: " + username);
            return ResponseEntity.status(409).body(Map.of("message", "Ce nom d'utilisateur est déjà pris"));
        }
 
        // Créer le nouvel utilisateur
        boolean success = dbManager.createUser(username, password);
 
        if (success) {
            System.out.println("✅ Utilisateur créé avec succès: " + username);
            return ResponseEntity.ok(Map.of("message", "Inscription réussie"));
        } else {
            System.out.println("❌ Erreur lors de la création de l'utilisateur");
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de l'inscription"));
        }
    }

}