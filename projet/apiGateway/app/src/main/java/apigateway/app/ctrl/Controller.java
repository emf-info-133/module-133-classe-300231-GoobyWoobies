package apigateway.app.ctrl;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import apigateway.app.models.Categorie;
import apigateway.app.models.Question;
import jakarta.servlet.http.HttpServletRequest;
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
            return ResponseEntity.ok(response);
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
        String apiUrl = URL_CLIENT + "/client/session";
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
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            // Créer un client HTTP pour appeler l'API REST
            RestTemplate restTemplate = new RestTemplate();

            // URL de l'API REST de déconnexion
            String apiRestUrl = "http://localhost:8081/logout"; // Ajustez selon votre configuration

            // Relayer la requête et récupérer la réponse
            ResponseEntity<String> response = restTemplate.postForEntity(apiRestUrl, null, String.class);

            // Retourner la réponse à l'utilisateur
            return response;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur de déconnexion");
        }
    }

    @GetMapping("/client/GetLeaderboard")
    public ResponseEntity<String> getLeaderboard(HttpServletRequest request) {
        try {
            // Relayer la requête à l'API REST
            ResponseEntity<String> response = restTemplate.getForEntity(URL_CLIENT + "/client/leaderboard",
                    String.class);

            // Retourner la réponse à l'utilisateur
            return ResponseEntity.status(response.getStatusCode())
                    .headers(response.getHeaders())
                    .body(response.getBody());
        } catch (Exception e) {
            // En cas d'erreur, retourner une erreur 500 avec un message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors de la récupération du leaderboard\"}");
        }
    }

    @PostMapping("/client/saveScore")
    public ResponseEntity<String> saveScore(@RequestBody Map<String, Object> scoreData, HttpSession session) {
        String apiUrl = URL_CLIENT + "/client/saveScore";
        try {
            System.out.println("⚡ Tentative d'enregistrement de score: " + scoreData);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, scoreData, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'enregistrement du score: " + e.getMessage());
        }
    }

}