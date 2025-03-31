package apiclient.app.ctrl;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping
    public String handleUserRequest(@RequestBody String type) {
        if ("user".equalsIgnoreCase(type)) {
            return "Vous êtes un utilisateur";
        }
        return "Type non valide";
    }
}
