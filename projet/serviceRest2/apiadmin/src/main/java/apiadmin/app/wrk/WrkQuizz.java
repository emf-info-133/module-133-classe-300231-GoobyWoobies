package apiadmin.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import apiadmin.app.models.Question;
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
                q.setTexte(rs.getString("texte"));
                q.setId(rs.getInt("id"));
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

    public boolean addQuestion(String texte, int categorie_id, String choix1, String choix2, String choix3, String choix4, int bonne_reponse) {
        String sql = "INSERT INTO t_question (texte, categorie_id, choix1, choix2, choix3, choix4, bonne_reponse) VALUES (?, ?, ?, ?, ?, ?, ?)";
   
        try {

            // Insertion dans la base de données
            int result = jdbcTemplate.update(sql, texte, categorie_id, choix1, choix2, choix3, choix4, bonne_reponse);
            return result > 0;  // Retourne true si une ligne a été insérée avec succès
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout de la question : " + e.getMessage());
            return false;  // Retourne faux en cas d'erreur
        }
    }
    
    
    

}