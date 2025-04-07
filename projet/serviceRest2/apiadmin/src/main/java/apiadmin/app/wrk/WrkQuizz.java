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

    public boolean addQuestion(String texte, int categorieId, String choix1, String choix2, String choix3, String choix4, int bonneReponse) {
        String sql = "INSERT INTO t_question (texte, categorie_id, choix_1, choix_2, choix_3, choix_4, bonne_reponse) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
        try {
            int result = jdbcTemplate.update(sql, texte, categorieId, choix1, choix2, choix3, choix4, bonneReponse);
            return result > 0;
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout de la question : " + e.getMessage());
            return false;
        }
    }
    

}