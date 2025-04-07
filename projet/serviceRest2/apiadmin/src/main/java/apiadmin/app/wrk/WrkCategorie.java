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
}
