document.addEventListener("DOMContentLoaded", async function () {
    // Récupère les catégories depuis l'API
    try {
        const response = await fetch('https://docker-133.angeli.emf-informatique.ch/admin/getCategories', {
            method: 'GET',
            credentials: 'include',  // Important pour inclure les cookies de session
            headers: {
                'Content-Type': 'application/json',  // Facultatif si tu as des headers supplémentaires
            }
        });

        if (response.ok) {
            const categories = await response.json();  // Lis le flux une seule fois
            console.log('🟢 Catégories récupérées:', categories);

            // Affiche les catégories dans la sidebar
            displayCategories(categories);
        } else {
            console.error('🔴 Erreur lors de la récupération des catégories:', response.status);
            alert("Erreur lors de la récupération des catégories.");
        }
    } catch (error) {
        console.error("Une erreur est survenue: ", error);
        alert("Une erreur est survenue lors de la requête.");
    }
});

// Fonction pour afficher les catégories dans la sidebar
function displayCategories(categories) {
    const categoryList = document.querySelector("ul");  // Sélectionne la liste UL dans la sidebar
    categoryList.innerHTML = '';  // Vide la liste avant d'ajouter les éléments

    categories.forEach(category => {
        const li = document.createElement("li");

        const button = document.createElement("button");
        button.classList.add("w-full", "text-left", "p-3", "rounded-lg", "flex", "items-center", "gap-3", "bg-dark-600/20", "border", "border-white/5", "text-gray-300", "hover:bg-accent-primary/20", "transition", "duration-300");

        button.appendChild(document.createTextNode(category.nom)); // Ajoute le nom de la catégorie

        // Ajoute un gestionnaire d'événements pour le clic sur le bouton

        li.appendChild(button);
        categoryList.appendChild(li);  // Ajoute le li à la liste
    });
}
