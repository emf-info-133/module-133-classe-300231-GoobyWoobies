package apiadmin.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import apiadmin.app.models.Categorie;
import apiadmin.app.models.Question;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class WrkQuizz {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<Question> getQuestionsByCategorie(int categorieId) {
        String sql = "SELECT * FROM t_question WHERE categorie_id = ? ORDER BY RAND() LIMIT 20";
    
        try {
            return jdbcTemplate.query(sql, new Object[]{categorieId}, (rs, rowNum) -> {
                Question q = new Question();
                q.setId(rs.getInt("id"));
                q.setTexte(rs.getString("texte"));
                q.setCategorieId(rs.getInt("categorie_id"));
                q.setChoix1(rs.getString("choix1"));
                q.setChoix2(rs.getString("choix2"));
                q.setChoix3(rs.getString("choix3"));
                q.setChoix4(rs.getString("choix4"));
                q.setBonneReponse(rs.getInt("bonne_reponse"));
                return q;
            });
        } catch (Exception e) {
            System.err.println("Erreur récupération questions : " + e.getMessage());
            return new ArrayList<>();
        }
    }
    

}