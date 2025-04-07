package apiadmin.app.wrk;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import apiadmin.app.models.Categorie;

@Service
public class WrkCategorie {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Categorie> getAllCategories() {
        String sql = "SELECT id, nom FROM t_categorie ORDER BY id ASC";

        try {
            return jdbcTemplate.query(sql,
                    (ResultSet rs, int rowNum) -> new Categorie(rs.getInt("id"), rs.getString("nom")));
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des catégories : " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public boolean addCategory(String nom) {
        String sql = "INSERT INTO t_categorie (nom) VALUES (?)";
    
        try {
            int result = jdbcTemplate.update(sql, nom);
            return result > 0;
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout de la catégorie : " + e.getMessage());
            return false;
        }
    }
    
    
}
