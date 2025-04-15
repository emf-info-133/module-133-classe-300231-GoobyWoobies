package apiclient.app.ctrl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import apiclient.app.wrk.wrkDBManager;

@RestController
@RequestMapping("/client")
public class Controller {

    @Autowired
    private wrkDBManager dbManager;
    private final JdbcTemplate jdbcTemplate = new JdbcTemplate();

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        System.out.println("🔍 Vérification des identifiants pour: " + username);

        Map<String, String> userInfo = dbManager.verifyLogin(username, password);

        if (userInfo != null) {
            System.out.println("✅ Identifiants valides pour: " + username + " (Rôle: " + userInfo.get("role") + ")");
            try {
                // Convertir les informations utilisateur en JSON
                return ResponseEntity.ok(new ObjectMapper().writeValueAsString(userInfo));
            } catch (Exception e) {
                System.out.println("❌ Erreur JSON: " + e.getMessage());
                return ResponseEntity.status(500).body("Error processing user data");
            }
        } else {
            System.out.println("❌ Identifiants invalides");
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<String> getLeaderboard(@RequestParam String username) {
        try {
            System.out.println("🔄 Récupération du leaderboard pour: " + username);

            if (username == null || username.isEmpty()) {
                System.out.println("❌ Paramètre username manquant");
                return ResponseEntity.badRequest().body("{\"error\": \"Paramètre username requis\"}");
            }

            // Appeler le service pour récupérer le leaderboard
            Map<String, Object> leaderboardData = dbManager.getLeaderboard(username);

            if (leaderboardData == null) {
                System.out.println("❌ Échec de récupération des données du leaderboard");
                return ResponseEntity.badRequest().body("{\"error\": \"Erreur lors de la récupération des données\"}");
            }

            System.out.println("✅ Leaderboard récupéré avec succès");
            // Retourner la réponse JSON
            return ResponseEntity.ok(new ObjectMapper().writeValueAsString(leaderboardData));

        } catch (Exception e) {
            System.out.println("❌ Exception dans /leaderboard: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/saveScore")
    public ResponseEntity<String> saveScore(@RequestBody Map<String, Object> scoreData) {
        try {
            // Récupérer les données du score
            String username = (String) scoreData.get("username");
            Integer score = (Integer) scoreData.get("score");

            // Vérifier que les données nécessaires sont présentes
            if (username == null || score == null) {
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
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        System.out.println("🔍 Tentative d'inscription pour: " + username);

        // Vérifier si l'utilisateur existe déjà
        if (dbManager.userExists(username)) {
            System.out.println("❌ Utilisateur existe déjà: " + username);
            return ResponseEntity.status(409).body("Ce nom d'utilisateur est déjà pris");
        }

        // Créer le nouvel utilisateur (avec rôle "user" par défaut)
        boolean success = dbManager.createUser(username, password);

        if (success) {
            System.out.println("✅ Utilisateur créé avec succès: " + username);
            return ResponseEntity.ok("Inscription réussie");
        } else {
            System.out.println("❌ Erreur lors de la création de l'utilisateur");
            return ResponseEntity.status(500).body("Erreur lors de l'inscription");
        }
    }
}