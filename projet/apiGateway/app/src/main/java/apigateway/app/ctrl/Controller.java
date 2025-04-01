package apigateway.app.ctrl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
public class Controller {

    private final RestTemplate restTemplate;

    // Constructeur pour injecter RestTemplate
    public Controller(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Méthode pour rediriger vers l'API appropriée
    @GetMapping("/admin/hello")
    public ResponseEntity<String> sendAdminRequest() {
        String apiUrl = "http://service-rest2:8082/admin/hello";
        try {
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.getForObject(apiUrl, String.class);
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok("Réponse de l'API Admin: " + response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/client/GetUsername")
    public ResponseEntity<String> getUsernameFromClient() {
        String apiUrl = "http://service-rest1:8081/client/GetUsername";
        try {
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.getForObject(apiUrl, String.class);
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok("Nom d'utilisateur: " + response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Client: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

}
