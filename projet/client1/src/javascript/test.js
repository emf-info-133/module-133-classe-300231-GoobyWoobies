// Fichier categories.js - Gestion des requêtes API pour les catégories
const API_BASE_URL = 'http://localhost:8080'; // À ajuster selon votre configuration

/**
 * Récupère toutes les catégories depuis l'API
 * @param {Function} successCallback - Fonction à exécuter en cas de succès
 * @param {Function} errorCallback - Fonction à exécuter en cas d'erreur
 */
function fetchCategories(successCallback, errorCallback) {
  $.ajax({
    url: `${API_BASE_URL}/admin/getCategories`,
    method: 'GET',
    dataType: 'json',
    beforeSend: function() {
      console.log('🔵 Envoi de la requête pour récupérer les catégories...');
    },
    success: function(response) {
      console.log('🟢 Catégories récupérées avec succès:', response);
      if (successCallback && typeof successCallback === 'function') {
        successCallback(response);
      }
    },
    error: function(xhr, status, error) {
      console.error('🔴 Erreur lors de la récupération des catégories:', error);
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback(error);
      }
    }
  });
}

/**
 * Affiche les catégories sur la page principale
 */
function displayCategories() {
  // Afficher un indicateur de chargement
  const categoriesContainer = $('.grid');
  categoriesContainer.html('<div class="col-span-full text-center"><span class="animate-pulse">Chargement des catégories...</span></div>');
  
  fetchCategories(
    // Success callback
    function(categories) {
      // Vider le conteneur
      categoriesContainer.empty();
      
      // Parcourir les catégories et créer les cartes
      categories.forEach(function(category) {
        const categoryCard = createCategoryCard(category);
        categoriesContainer.append(categoryCard);
      });
    },
    // Error callback
    function(error) {
      categoriesContainer.html(`
        <div class="col-span-full text-center p-8 backdrop-blur-lg bg-dark-700/50 border border-red-500/30 rounded-xl">
          <p class="text-red-400">Impossible de charger les catégories</p>
          <p class="text-sm text-gray-400 mt-2">Veuillez réessayer ultérieurement</p>
        </div>
      `);
    }
  );
}

/**
 * Crée une carte de catégorie HTML
 * @param {Object} category - Objet contenant les informations de la catégorie
 * @returns {String} - HTML de la carte de catégorie
 */
function createCategoryCard(category) {
  // Déterminer l'icône appropriée en fonction du nom de la catégorie
  let iconPath = '';
  
  switch(category.nom.toLowerCase()) {
    case 'développement':
    case 'developpement':
    case 'development':
      iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />';
      break;
    case 'sécurité':
    case 'securite':
    case 'security':
      iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />';
      break;
    case 'réseaux':
    case 'reseaux':
    case 'networks':
      iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />';
      break;
    case 'système':
    case 'systeme':
    case 'system':
      iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />';
      break;
    default:
      iconPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />';
  }

  return `
    <div class="group relative" data-category-id="${category.id}">
      <div class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
      <div class="relative p-6 backdrop-blur-lg bg-dark-700/50 border border-white/10 rounded-xl shadow-xl hover:shadow-accent-primary/20 text-center cursor-pointer transition-all duration-500 hover:scale-105 group overflow-hidden" onclick="selectCategory(${category.id})">
        <div class="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="flex justify-center mb-4 text-accent-primary group-hover:text-accent-secondary transition-colors duration-300 relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            ${iconPath}
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-100 group-hover:text-white transition-colors duration-300 relative z-10">${category.nom}</h3>
      </div>
    </div>
  `;
}

/**
 * Sélection d'une catégorie pour démarrer un quizz
 * @param {Number} categoryId - Identifiant de la catégorie
 */
function selectCategory(categoryId) {
  console.log(`Catégorie sélectionnée: ${categoryId}`);
  // Redirection vers la page du quiz avec l'ID de la catégorie
  window.location.href = `./quiz.html?category=${categoryId}`;
}

// Charger les catégories au chargement de la page
$(document).ready(function() {
  displayCategories();
});