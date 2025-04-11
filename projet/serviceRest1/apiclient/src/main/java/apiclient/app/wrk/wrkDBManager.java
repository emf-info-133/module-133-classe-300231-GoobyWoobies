package apiclient.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class wrkDBManager {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean verifyLogin(String username, String password) {
        String sql = "SELECT COUNT(*) FROM Utilisateur WHERE nom = ? AND mot_de_passe = ?";
        try {
            System.out.println("🔍 Vérification SQL pour: " + username);
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username, password);
            System.out.println("🔍 Résultat SQL: " + count);
            return count != null && count > 0;
        } catch (Exception e) {
            System.out.println("❌ Erreur SQL: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Enregistre le score d'un quiz pour un utilisateur
     * @param username Nom d'utilisateur
     * @param score Score obtenu
     * @param totalQuestions Nombre total de questions
     * @param categorieId ID de la catégorie du quiz
     * @return true si l'enregistrement a réussi, false sinon
     */
    public boolean saveUserScore(String username, int score, int totalQuestions, int categorieId) {
        try {
            // Calculer le pourcentage
            int percentage = (int) Math.round(((double) score / totalQuestions) * 100);
            
            // Requête SQL pour enregistrer le score
            String sql = "INSERT INTO user_scores (username, score, total_questions, percentage, categorie_id, date_completed) " +
                         "VALUES (?, ?, ?, ?, ?, NOW())";
            
            jdbcTemplate.update(sql, username, score, totalQuestions, percentage, categorieId);
            
            // Mettre à jour le score total de l'utilisateur
            String updateUserSql = "UPDATE Utilisateur SET score = COALESCE(score, 0) + ?, quizzes_completed = COALESCE(quizzes_completed, 0) + 1 WHERE nom = ?";
            jdbcTemplate.update(updateUserSql, score, username);
            
            System.out.println("✅ Score enregistré avec succès pour: " + username);
            return true;
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de l'enregistrement du score: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}