package apigateway.app.ctrl;

import java.util.Map;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import apigateway.app.models.Categorie;
import apigateway.app.models.Question;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = { "https://angeli.emf-informatique.ch" }, allowCredentials = "true")
@RestController
public class Controller {
    private final static String URL_CLIENT = "http://service-rest1:8080";
    private final static String URL_ADMIN = "http://service-rest2:8080";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Suppression de la variable currentSession qui crée le problème
    // private HttpSession currentSession;

    // Constructeur pour injecter RestTemplate et ObjectMapper
    public Controller(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    // Méthode privée pour vérifier si l'utilisateur est admin
    private boolean isAdmin(HttpSession session) {
        String role = (String) session.getAttribute("role");
        return role != null && role.equals("admin");
    }

    // Méthode pour vérifier l'accès admin
    private ResponseEntity<String> checkAdminAccess(HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vous devez être connecté");
        }

        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé: droits d'administrateur requis");
        }

        return null; // Accès autorisé
    }

    @GetMapping("/admin/getCategories")
    public ResponseEntity<String> sendAdminRequest(HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            System.out.println(username);

            if (username == null) {
                return ResponseEntity.status(401).body("{\"error\": \"Utilisateur non connecté\"}");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
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
    public ResponseEntity<String> addCategory(@RequestBody Categorie categorie, HttpSession session) {
        // Vérifier les droits d'accès administrateur
        ResponseEntity<String> accessCheck = checkAdminAccess(session);
        if (accessCheck != null) {
            return accessCheck;
        }

        String apiUrl = URL_ADMIN + "/admin/addCategory";
        try {
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.postForObject(apiUrl, categorie, String.class);
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/admin/startQuizz/{categorieId}")
    public ResponseEntity<String> startQuizz(@PathVariable int categorieId, HttpSession session) {
        // Vérifier les droits d'accès administrateur
        String username = (String) session.getAttribute("username");

        if (username == null) {
            System.out.println("🔴 Tentative d'accès au leaderboard sans être connecté");
            return ResponseEntity.status(401).body("{\"error\": \"Utilisateur non connecté\"}");
        }

        String apiUrl = URL_ADMIN + "/admin/startQuizz/{categorieId}";
        try {
            System.out.println("🔵 Envoi de requête à " + apiUrl);
            String response = restTemplate.getForObject(apiUrl, String.class, categorieId);
            System.out.println("🟢 Réponse reçue: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de l'appel à l'API Admin: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/admin/addQuestion")
    public ResponseEntity<String> addQuestion(@RequestBody Question question, HttpSession session) {
        // Vérifier les droits d'accès administrateur
        ResponseEntity<String> accessCheck = checkAdminAccess(session);
        if (accessCheck != null) {
            return accessCheck;
        }

        String apiUrl = URL_ADMIN + "/admin/addQuestion";
        try {
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
    public ResponseEntity<String> getUsernameFromClient(HttpSession session) {
        // Vérifier si l'utilisateur est connecté
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        return ResponseEntity.ok((String) session.getAttribute("username"));
    }

    @PostMapping("/client/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String apiUrl = URL_CLIENT + "/client/login";
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            System.out.println("⚡ Tentative de connexion avec: " + credentials);

            // Création d'une Map pour la requête
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("username", username);
            requestBody.put("password", password);

            // Vérification des identifiants en appelant le service client
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestBody, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // Désérialiser la réponse JSON pour obtenir les infos utilisateur
                Map<String, String> userInfo = objectMapper.readValue(response.getBody(), Map.class);

                // Stockage des informations utilisateur dans la session
                session.setAttribute("username", userInfo.get("username"));
                session.setAttribute("role", userInfo.get("role"));

                System.out.println("🟢 Session créée dans l'API Gateway pour: " + username + " (Rôle: "
                        + userInfo.get("role") + ")");
                return ResponseEntity.ok(response.getBody()); // Renvoie les infos utilisateur (username + rôle)
            } else {
                System.out.println("🔴 Échec d'authentification");
                return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
            }
        } catch (Exception e) {
            System.out.println("🔴 Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'appel à l'API Client: " + e.getMessage());
        }
    }

    @GetMapping("/client/session")
    public ResponseEntity<String> getCurrentUser(HttpSession session) {
        try {
            // Vérification directe de la session dans l'API Gateway
            String username = (String) session.getAttribute("username");
            String role = (String) session.getAttribute("role");

            if (username != null) {
                System.out.println("🟢 Utilisateur trouvé en session: " + username + " (Rôle: " + role + ")");

                // Créer une réponse avec les informations complètes
                Map<String, String> userInfo = new HashMap<>();
                userInfo.put("username", username);
                userInfo.put("role", role);

                return ResponseEntity.ok(objectMapper.writeValueAsString(userInfo));
            } else {
                System.out.println("🔴 Aucun utilisateur en session");
                return ResponseEntity.status(401).body("No user logged in");
            }
        } catch (Exception e) {
            System.out.println("🔴 Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de la vérification de session: " + e.getMessage());
        }
    }

    @PostMapping("/client/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        try {
            if (session != null) {
                String username = (String) session.getAttribute("username");
                String role = (String) session.getAttribute("role");
                System.out.println("🔵 Déconnexion de l'utilisateur: " + username + " (Rôle: " + role + ")");
                session.invalidate();
                System.out.println("🟢 Session invalidée avec succès");
            }
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            System.err.println("🔴 Erreur lors de la déconnexion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur de déconnexion: " + e.getMessage());
        }
    }

    @GetMapping("/client/getLeaderboard")
    public ResponseEntity<String> getLeaderboard(HttpSession session) {
        try {
            // Vérifier si l'utilisateur est connecté dans l'API Gateway
            String username = (String) session.getAttribute("username");
            System.out.println(username);

            if (username == null) {
                System.out.println("🔴 Tentative d'accès au leaderboard sans être connecté");
                return ResponseEntity.status(401).body("{\"error\": \"Utilisateur non connecté\"}");
            }

            // Construction de l'URL avec le paramètre username
            String apiUrl = URL_CLIENT + "/client/leaderboard?username=" + username;

            // Relayer la requête à l'API REST avec le username comme paramètre
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

            // Retourner la réponse à l'utilisateur
            return ResponseEntity.status(response.getStatusCode())
                    .headers(response.getHeaders())
                    .body(response.getBody());
        } catch (Exception e) {
            System.out.println("🔴 Exception dans /leaderboard: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors de la récupération du leaderboard\"}");
        }
    }

    @PostMapping("/client/saveScore")
    public ResponseEntity<String> saveScore(@RequestBody Map<String, Object> scoreData, HttpSession session) {
        String apiUrl = URL_CLIENT + "/client/saveScore";
        try {
            // Vérifier si l'utilisateur est connecté dans l'API Gateway
            String username = (String) session.getAttribute("username");

            if (username == null) {
                System.out.println("🔴 Tentative d'enregistrement de score sans être connecté");
                return ResponseEntity.status(401).body("Utilisateur non connecté");
            }

            // Ajouter le username au scoreData
            scoreData.put("username", username);
            System.out.println("⚡ Tentative d'enregistrement de score pour " + username + ": " + scoreData);

            // Appel au service client pour enregistrer le score
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, scoreData, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("🔴 Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'enregistrement du score: " + e.getMessage());
        }
    }

    @PostMapping("/client/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> credentials) {
        String apiUrl = URL_CLIENT + "/client/register";
        try {
            System.out.println("🔵 Envoi de requête d'inscription à " + apiUrl);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, credentials, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("🔴 Erreur lors de l'appel à l'API Client: " + e.getMessage());
            return ResponseEntity.status(500).body("Erreur lors de l'inscription: " + e.getMessage());
        }
    }
}
