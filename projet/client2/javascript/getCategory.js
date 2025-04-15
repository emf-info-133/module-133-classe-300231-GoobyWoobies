document.addEventListener("DOMContentLoaded", async function() {
    // RÃ©cupÃ¨re les catÃ©gories depuis l'API
    try {
        const response = await fetch('https://docker-133.angeli.emf-informatique.ch/admin/getCategories', {
            method: 'GET',
            credentials: 'include',  // Important pour inclure les cookies de session
            headers: {
                'Content-Type': 'application/json',  // Facultatif si tu as des headers supplÃ©mentaires
            }
        });

        if (response.ok) {
            const categories = await response.json();  // Lis le flux une seule fois
            //console.log('ðŸŸ¢ CatÃ©gories rÃ©cupÃ©rÃ©es:', categories);

            // Affiche les catÃ©gories dans la sidebar
            displayCategories(categories);
        } else {
            //console.error('ðŸ”´ Erreur lors de la rÃ©cupÃ©ration des catÃ©gories:', response.status);
            // Affiche l'erreur en rouge sur la page au lieu d'une alerte
            const errorDiv = document.createElement('div');
            errorDiv.textContent = `Erreur lors de la rÃ©cupÃ©ration des catÃ©gories: ${response.status}`;
            errorDiv.style.color = 'red';
            errorDiv.style.padding = '10px';
            errorDiv.style.margin = '10px 0';
            document.querySelector('main').prepend(errorDiv);
        }
    } catch (error) {
        //console.error("Une erreur est survenue: ", error);
        alert("Une erreur est survenue lors de la requÃªte.");
    }
});

// Fonction pour afficher les catÃ©gories dans la sidebar
function displayCategories(categories) {
    const categoryList = document.querySelector("ul");  // SÃ©lectionne la liste UL dans la sidebar
    categoryList.innerHTML = '';  // Vide la liste avant d'ajouter les Ã©lÃ©ments

    categories.forEach(category => {
        const li = document.createElement("li");

        const button = document.createElement("button");
        button.classList.add("w-full", "text-left", "p-3", "rounded-lg", "flex", "items-center", "gap-3", "bg-dark-600/20", "border", "border-white/5", "text-gray-300", "hover:bg-accent-primary/20", "transition", "duration-300");

        button.appendChild(document.createTextNode(category.nom)); // Ajoute le nom de la catÃ©gorie

        // Ajoute un gestionnaire d'Ã©vÃ©nements pour le clic sur le bouton

        li.appendChild(button);
        categoryList.appendChild(li);  // Ajoute le li Ã  la liste
    });
}



if (!selectedCategoryId) {
    alert("Veuillez sÃ©lectionner une catÃ©gorie avant d'ajouter une question.");
}

const data = {
    texte: question,
    categorieId: selectedCategoryId,
    choix1: choix1,
    choix2: choix2,
    choix3: choix3,
    choix4: choix4,
    bonneReponse: bonneReponse
};