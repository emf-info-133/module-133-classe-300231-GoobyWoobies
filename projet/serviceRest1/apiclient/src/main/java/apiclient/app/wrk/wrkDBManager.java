package apiclient.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.sql.ResultSet;

@Service
public class wrkDBManager {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String getFirstUsername() {
        String sql = "SELECT nom FROM Utilisateur ORDER BY id ASC LIMIT 1";

        try {
            return jdbcTemplate.queryForObject(sql, (ResultSet rs, int rowNum) -> rs.getString("nom"));
        } catch (Exception e) {
            String err = e.getMessage();
            return "Error :" + err + "| Aucun utilisateur trouvé";
        }
    }
}
