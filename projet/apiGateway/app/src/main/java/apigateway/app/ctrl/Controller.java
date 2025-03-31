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
        String apiUrl = "http://localhost:8082/admin/hello"; // URL de l'API REST 2 (Admin)
        String response = restTemplate.postForObject(apiUrl, "admin", String.class);
        return ResponseEntity.ok("Réponse de l'API Admin: " + response);
    }

    @GetMapping("/user")
    public ResponseEntity<String> sendUserRequest() {
        String apiUrl = "http://localhost:8081/user"; // URL de l'API REST 1 (User)
        String response = restTemplate.postForObject(apiUrl, "user", String.class);
        return ResponseEntity.ok("Réponse de l'API User: " + response);
    }
}
