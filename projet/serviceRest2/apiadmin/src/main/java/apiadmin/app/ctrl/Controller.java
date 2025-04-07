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

}
