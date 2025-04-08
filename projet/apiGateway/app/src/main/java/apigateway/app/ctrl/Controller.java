package apigateway.app.ctrl;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import apigateway.app.models.Categorie;
import apigateway.app.models.Question;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = { "http://localhost:5500" }, allowCredentials = "true")
@RestController
public class Controller {
    private final static String URL_CLIENT = "http://service-rest1:8080";
    private final static String URL_ADMIN = "http://service-rest2:8080";
    private final RestTemplate restTemplate;

    // Constructeur pour injecter RestTemplate
    public Controller(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Méthode pour rediriger vers l'API appropriée
    @GetMapping("/admin/getCategories")
    public ResponseEntity<String> sendAdminRequest() {
        String apiUrl = URL_ADMIN + "/admin/getCategories";
        try {
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.getForObject(apiUrl, String.class);
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/admin/addCategory")
    public ResponseEntity<String> addCategory(@RequestBody Categorie categorie) {
        String apiUrl = URL_ADMIN + "/admin/addCategory";
        try {
            // Envoie la requête POST avec le corps contenant l'objet 'categorie'
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.postForObject(apiUrl, categorie, String.class);

            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok("Category : " + response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/admin/startQuizz/{categorieId}")
    public ResponseEntity<String> startQuizz(@PathVariable int categorieId) {
        // L'URL de l'API avec un paramètre de chemin dynamique pour categorieId
        String apiUrl = URL_ADMIN + "/admin/startQuizz/{categorieId}";

        try {
            // Envoi de la requête avec remplacement de {categorieId} par la valeur passée
            // en paramètre
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.getForObject(apiUrl, String.class, categorieId); // Passer la valeur de
                                                                                            // categorieId ici
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok("Quizz : " + response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/admin/addQuestion")
    public ResponseEntity<String> addQuestion(@RequestBody Question question) {
        String apiUrl = URL_ADMIN + "/admin/addQuestion";
        try {
            // Envoie la requête POST avec le corps contenant l'objet 'question'
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.postForObject(apiUrl, question, String.class);

            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok("Question : " + response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/client/GetUsername")
    public ResponseEntity<String> getUsernameFromClient() {
        String apiUrl = URL_CLIENT + "/client/GetUsername";
        try {
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.getForObject(apiUrl, String.class);
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Client: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/client/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String apiUrl = URL_CLIENT + "/client/login";
        try {
            System.out.println("⚡ Tentative de connexion avec: " + credentials);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, credentials, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String username = response.getBody();
                System.out.println(username);
                session.setAttribute("username", username);
                return ResponseEntity.ok(username);
            }

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'appel à l'API Client: " + e.getMessage());
        }
    }

    @GetMapping("/client/session")
    public ResponseEntity<String> getCurrentUser(HttpSession session) {
        String apiUrl = URL_CLIENT + "/client/login";
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'appel à l'API Client: " + e.getMessage());
        }
    }

    @PostMapping("/client/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        try {
            restTemplate.postForEntity(URL_CLIENT + "/client/logout", null, String.class);
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during logout: " + e.getMessage());
        }
    }

}
