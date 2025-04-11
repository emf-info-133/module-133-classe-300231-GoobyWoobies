// Fonction pour ouvrir la modale
document.getElementById('openModalBtn').addEventListener('click', function() {
    // Affiche la modale
    document.getElementById('modal').classList.remove('hidden');
});

// Fonction pour fermer la modale
document.getElementById('closeModalBtn').addEventListener('click', function() {
    // Cache la modale
    document.getElementById('modal').classList.add('hidden');
});

// Fonction pour ajouter la catégorie
async function addCategory() {
    // Récupère le nom de la catégorie depuis le champ de texte
    const categoryName = document.getElementById('categoryName').value.trim();
    console.log(categoryName);

    // Vérifie que le champ n'est pas vide
    if (!categoryName) {
        alert('Le nom de la catégorie est requis.');
        return;
    }

    // Crée un objet représentant la catégorie à envoyer
    const categoryData = {
        nom: categoryName
    };

    try {
        // Envoie la requête POST à l'API pour ajouter la catégorie
        const response = await fetch('http://localhost:8080/admin/addCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData), // Convertit l'objet JavaScript en JSON
        });
    
        // Vérifie si la réponse est OK
        if (response.ok) {
            const result = await response.json(); // Récupère la réponse JSON du serveur
            alert(result.message);  // Affiche le message de succès ou d'erreur depuis le serveur
            console.log(result);    // Affiche la réponse complète pour le débogage
    
            // Ferme la modale après l'ajout
            document.getElementById('modal').classList.add('hidden');
    
            // Vide le champ de texte après l'ajout
            document.getElementById('categoryName').value = '';
        } else {
            const error = await response.json();  // Récupère la réponse JSON d'erreur
            alert('Erreur lors de l\'ajout de la catégorie: ' + error.message);
        }
    } catch (error) {
        alert('Une erreur est survenue lors de la requête: ' + error.message);
        console.error(error);
    }
    
}

// Ajouter un événement au bouton de soumission de la catégorie dans la modale
document.getElementById('submitCategoryBtn').addEventListener('click', addCategory);
