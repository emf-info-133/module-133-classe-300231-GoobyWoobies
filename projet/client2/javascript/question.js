let selectedCategoryId = null; // sera mis à jour quand une catégorie est cliquée

// Affiche les catégories dans la sidebar
function displayCategories(categories) {
    const categoryList = document.querySelector("ul");
    categoryList.innerHTML = '';

    categories.forEach(category => {
        const li = document.createElement("li");
        const button = document.createElement("button");

        button.classList.add("w-full", "text-left", "p-3", "rounded-lg", "flex", "items-center", "gap-3", "bg-dark-600/20", "border", "border-white/5", "text-gray-300", "hover:bg-accent-primary/20", "transition", "duration-300");

        button.appendChild(document.createTextNode(category.nom));

        button.addEventListener("click", function () {
            // Sélection visuelle
            const buttons = categoryList.querySelectorAll("button");
            buttons.forEach(btn => {
                btn.classList.remove("bg-accent-primary/30", "text-white");
                btn.classList.add("bg-dark-600/20", "text-gray-300");
            });
        
            button.classList.remove("bg-dark-600/20", "text-gray-300");
            button.classList.add("bg-accent-primary/30", "text-white");
        
            // Enregistrer l'ID de la catégorie sélectionnée
            selectedCategoryId = category.id;
        
            // Log pour vérifier l'ID sélectionné
            console.log("Catégorie sélectionnée :", category.nom, "ID:", selectedCategoryId);
        });
        

        li.appendChild(button);
        categoryList.appendChild(li);
    });
}

// Ajout de la question
document.addEventListener("DOMContentLoaded", () => {
    const questionForm = document.getElementById("questionForm");

    questionForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!selectedCategoryId) {
            alert("Veuillez sélectionner une catégorie avant d'ajouter une question.");
            return;
        }

        const question = document.getElementById("question").value.trim();
        const choix1 = document.getElementById("choix1").value.trim();
        const choix2 = document.getElementById("choix2").value.trim();
        const choix3 = document.getElementById("choix3").value.trim();
        const choix4 = document.getElementById("choix4").value.trim();
        const selectedBonneReponse = document.querySelector('input[name="bonne-reponse"]:checked');
        
        if (!selectedBonneReponse) {
            alert("Tu dois cocher la bonne réponse !");
            return;
        }
        
        const bonneReponse = parseInt(selectedBonneReponse.value); // <-- c'est ici que tu récupères "1", "2", etc.
        
        

        if (!question || !choix1 || !choix2 || !choix3 || !choix4 || !bonneReponse) {
            alert("Merci de remplir tous les champs et de choisir la bonne réponse.");
            return;
        }

        const data = {
            texte: question,
            categorieId: selectedCategoryId,  // <-- Renommé en camelCase
            choix1: choix1,
            choix2: choix2,
            choix3: choix3,
            choix4: choix4,
            bonneReponse: bonneReponse  // <-- Renommé en camelCase
        };
        
        console.log("Données envoyées :", data);

        try {
            const response = await fetch("https://docker-133.angeli.emf-informatique.ch/admin/addQuestion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',  // Important pour envoyer les cookies de session
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("Question ajoutée avec succès !");
                questionForm.reset();
            } else {
                alert("Erreur lors de l'ajout de la question.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
        }
    });
});
