package apiclient.app.wrk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import apiclient.app.beans.Utilisateur;
import apiclient.app.repo.UtilisateurRepository;

@Service
public class wrkDBManager {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public String getFirstUsername() {
        Utilisateur user = utilisateurRepository.findFirstByOrderByIdAsc();
        return (user != null) ? user.getNom() : "Aucun utilisateur trouvé";
    }
}
