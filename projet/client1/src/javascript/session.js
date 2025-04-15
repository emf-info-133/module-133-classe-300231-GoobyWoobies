window.addEventListener("DOMContentLoaded", function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://docker-133.angeli.emf-informatique.ch/client/session", true);
  xhr.withCredentials = true;  // Important pour inclure les cookies de session

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const userData = JSON.parse(xhr.responseText);
        //console.log("Utilisateur connecté:", userData.username, "Rôle:", userData.role);
        // Afficher le nom d'utilisateur
        const usernameElement = document.getElementById("username");
        if (usernameElement) {
          usernameElement.textContent = userData.username;
        }
        // Vérifier l'accès à la page admin
        const isAdminPage = window.location.pathname.includes('/admin/') ||
          window.location.href.includes('../../../client2/index.html');
        // Masquer/afficher les éléments selon le rôle
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
          if (userData.role === "admin") {
            element.style.display = "block";
          } else {
            element.style.display = "none";
          }
        });

        // Vérification spécifique pour les pages d'administration
        if (isAdminPage && userData.role !== "admin") {
          //console.error("Accès non autorisé à la page admin");
          alert("Vous n'avez pas accès à cette page");
          window.location.href = ".erreur.html"; // Redirection vers la page principale
        }
        // Si on est sur les pages d'ajout de catégorie ou question, vérifier les droits admin
        if ((window.location.pathname.includes('addcategorie') ||
          window.location.pathname.includes('addquestion')) &&
          userData.role !== "admin") {
          //console.error("Accès non autorisé");
          alert("Cette fonctionnalité est réservée aux administrateurs");
          window.location.href = ".erreur.html"; // Redirection vers la page principale
        }
      } catch (e) {
        //console.error("Erreur lors du traitement des données:", e);
      }
    } else if (xhr.status === 401) {
      //console.error("Non authentifié");
      // Ne pas rediriger si on est déjà sur la page d'accueil ou de connexion
      if (!window.location.pathname.includes('index.html') &&
        !window.location.pathname.includes('login.html')) {
        window.location.href = "./erreur.html";  // Redirection vers la page de connexion
      }
    } else {
      //console.error("Erreur serveur:", xhr.status);
    }
  };

  xhr.onerror = function () {
    //console.error("Erreur réseau lors de la vérification de session");
  };

  xhr.send();
  // Gestionnaire pour le bouton de déconnexion
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      const logoutXhr = new XMLHttpRequest();
      logoutXhr.open("POST", "https://docker-133.angeli.emf-informatique.ch/client/logout", true);
      logoutXhr.withCredentials = true;
      logoutXhr.onload = function () {
        if (logoutXhr.status === 200) {
          window.location.href = "../index.html"; // Redirection après déconnexion
        } else {
          //console.error("Erreur lors de la déconnexion", logoutXhr.status);
        }
      };
      logoutXhr.send();
    });
  }
});