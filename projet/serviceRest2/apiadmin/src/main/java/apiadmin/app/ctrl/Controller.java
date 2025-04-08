package apiadmin.app.ctrl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apiadmin.app.models.Categorie;
import apiadmin.app.models.Question;
import apiadmin.app.wrk.WrkQuizz;
import apiadmin.app.wrk.WrkCategorie;

@RestController
@RequestMapping("/admin")
public class Controller {

    @Autowired
    private WrkCategorie wrkCategorie;

    @Autowired
    private WrkQuizz wrkQuizz;

    @GetMapping("/getCategories")
    public ResponseEntity<List<Categorie>> getCategories() {
        List<Categorie> categories = wrkCategorie.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/startQuizz/{categorieId}")
    public ResponseEntity<List<Question>> startQuizz(@PathVariable int categorieId) {
        List<Question> questions = wrkQuizz.getQuestionsByCategorie(categorieId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/addCategory")
    public ResponseEntity<String> addCategory(@RequestBody Categorie categorie) {
        boolean isAdded = wrkCategorie.addCategory(categorie.getNom());

        if (isAdded) {
            return ResponseEntity.ok("Catégorie ajoutée avec succès !");
        } else {
            return ResponseEntity.status(500).body("Erreur lors de l'ajout de la catégorie");
        }
    }

    @PostMapping("/addQuestion")
    public ResponseEntity<String> addQuestion(@RequestBody Question question) {
        System.out.println("🔵 Question reçue : " + question + question.getBonneReponse());

        boolean isAdded = wrkQuizz.addQuestion(question.getTexte(), question.getCategorieId(), question.getChoix1(), question.getChoix2(), question.getChoix3(), question.getChoix4(), question.getBonneReponse());
        
        if (isAdded) {
            return ResponseEntity.ok("Question ajoutée avec succès !");
        } else {
            return ResponseEntity.status(500).body("Erreur lors de l'ajout de la question");
        }
    }

}
