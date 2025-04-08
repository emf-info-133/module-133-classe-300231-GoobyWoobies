package apiclient.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

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
    
}
