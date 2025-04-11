package apiclient.app.ctrl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/leaderboard")
    public ResponseEntity<String> getLeaderboard(HttpSession session) {
        try {
            // Récupérer l'utilisateur connecté
            String currentUsername = (String) session.getAttribute("username");
            if (currentUsername == null) {
                return ResponseEntity.badRequest().body("{\"error\": \"Utilisateur non connecté\"}");
            }

            // Récupérer le top 10 des utilisateurs avec le plus de score
            String sql = "SELECT username, score, quizzes_completed FROM users ORDER BY score DESC LIMIT 10";
            List<Map<String, Object>> topUsers = jdbcTemplate.queryForList(sql);

            // Récupérer les informations de l'utilisateur actuel
            String userSql = "SELECT username, score, quizzes_completed, " +
                    "(SELECT COUNT(*) + 1 FROM users u2 WHERE u2.score > u1.score) AS rank " +
                    "FROM users u1 WHERE username = ?";
            Map<String, Object> currentUser = jdbcTemplate.queryForMap(userSql, currentUsername);

            // Construire la réponse JSON
            StringBuilder jsonResponse = new StringBuilder();
            jsonResponse.append("{\"leaderboard\":[");

            boolean first = true;
            for (Map<String, Object> user : topUsers) {
                if (!first) {
                    jsonResponse.append(",");
                }
                first = false;

                jsonResponse.append("{");
                jsonResponse.append("\"username\":\"").append(user.get("username")).append("\",");
                jsonResponse.append("\"score\":").append(user.get("score")).append(",");
                jsonResponse.append("\"quizzesCompleted\":").append(user.get("quizzes_completed"));
                jsonResponse.append("}");
            }

            jsonResponse.append("],\"currentUser\":{");
            jsonResponse.append("\"username\":\"").append(currentUser.get("username")).append("\",");
            jsonResponse.append("\"score\":").append(currentUser.get("score")).append(",");
            jsonResponse.append("\"quizzesCompleted\":").append(currentUser.get("quizzes_completed")).append(",");
            jsonResponse.append("\"rank\":").append(currentUser.get("rank"));
            jsonResponse.append("}}");

            return ResponseEntity.ok(jsonResponse.toString());

        } catch (Exception e) {
            // En cas d'erreur, retourner une erreur avec un message
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
        Integer totalQuestions = (Integer) scoreData.get("totalQuestions");
        Integer categorieId = (Integer) scoreData.get("categorieId");
        
        // Vérifier que les données nécessaires sont présentes
        if (score == null || totalQuestions == null || categorieId == null) {
            System.out.println("❌ Données incomplètes pour l'enregistrement du score");
            return ResponseEntity.badRequest().body("Données incomplètes");
        }
        
        System.out.println("🔍 Enregistrement du score pour: " + username + ", Score: " + score + "/" + totalQuestions);
        
        boolean success = dbManager.saveUserScore(username, score, totalQuestions, categorieId);
        
        if (success) {
            return ResponseEntity.ok("Score enregistré avec succès");
        } else {
            return ResponseEntity.status(500).body("Erreur lors de l'enregistrement du score");
        }
    }
}