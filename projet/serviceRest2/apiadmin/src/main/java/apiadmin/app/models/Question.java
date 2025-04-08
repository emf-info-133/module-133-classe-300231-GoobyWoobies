package apiadmin.app.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Question {
    private int id;
    private String texte;
    private int categorieId;
    private String choix1;
    private String choix2;
    private String choix3;
    private String choix4;
    private int bonneReponse;
}
