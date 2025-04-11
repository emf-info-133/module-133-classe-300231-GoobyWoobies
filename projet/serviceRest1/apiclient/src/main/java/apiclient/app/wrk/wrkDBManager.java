package apiclient.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class wrkDBManager {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, String> verifyLogin(String username, String password) {
        String sql = "SELECT role FROM Utilisateur WHERE nom = ? AND mot_de_passe = ?";
        try {
            System.out.println("🔍 Vérification SQL pour: " + username);
            String role = jdbcTemplate.queryForObject(sql, String.class, username, password);
            System.out.println("🔍 Résultat SQL - Rôle: " + role);
            
            if (role != null) {
                Map<String, String> userInfo = new HashMap<>();
                userInfo.put("username", username);
                userInfo.put("role", role);
                return userInfo;
            }
            return null;
        } catch (Exception e) {
            System.out.println("❌ Erreur SQL: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Enregistre ou met à jour le score d'un utilisateur dans la table Utilisateur
     * 
     * @param username Nom d'utilisateur
     * @param score    Score obtenu
     * @return true si l'enregistrement a réussi, false sinon
     */
    public boolean saveUserScore(String username, int score) {
        try {
            // Mettre à jour le score de l'utilisateur dans la table Utilisateur
            String updateUserSql = "UPDATE Utilisateur SET score = COALESCE(score, 0) + ? WHERE nom = ?";
            jdbcTemplate.update(updateUserSql, score, username);

            System.out.println("✅ Score enregistré avec succès pour: " + username);
            return true;
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de l'enregistrement du score: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Récupère le leaderboard (top 10) et les informations de l'utilisateur
     * connecté
     * 
     * @param currentUsername Nom de l'utilisateur connecté
     * @return Une Map contenant le leaderboard et les informations de l'utilisateur
     */
    public Map<String, Object> getLeaderboard(String currentUsername) {
        try {
            System.out.println("📊 Début de récupération du leaderboard pour " + currentUsername);

            // Récupérer le top 10 des utilisateurs avec le plus de score
            String sql = "SELECT nom AS username, score FROM Utilisateur ORDER BY score DESC LIMIT 10";
            List<Map<String, Object>> topUsers = jdbcTemplate.queryForList(sql);
            System.out.println("✅ Top users récupérés: " + topUsers.size() + " utilisateurs");

            // Récupérer les informations de l'utilisateur actuel
            String userSql = "SELECT nom AS username, score, " +
                    "(SELECT COUNT(*) + 1 FROM Utilisateur u2 WHERE u2.score > u1.score) AS `rank` " +
                    "FROM Utilisateur u1 WHERE nom = ?";
            Map<String, Object> currentUser = jdbcTemplate.queryForMap(userSql, currentUsername);
            System.out.println("✅ Informations utilisateur récupérées pour: " + currentUsername);

            // Construire la réponse dans une Map
            Map<String, Object> response = new HashMap<>();
            response.put("leaderboard", topUsers);
            response.put("currentUser", currentUser);

            System.out.println("📊 Leaderboard généré avec succès");
            return response;

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération du leaderboard: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public boolean userExists(String username) {
        String sql = "SELECT COUNT(*) FROM Utilisateur WHERE nom = ?";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
            return count != null && count > 0;
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la vérification de l'utilisateur: " + e.getMessage());
            return false;
        }
    }
 
    public boolean createUser(String username, String password) {
        // Par défaut, les nouveaux utilisateurs ont le rôle "user"
        String sql = "INSERT INTO Utilisateur (nom, mot_de_passe, score, role) VALUES (?, ?, 0, 'user')";
        try {
            jdbcTemplate.update(sql, username, password);
            return true;
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la création de l'utilisateur: " + e.getMessage());
            return false;
        }
    }
}