// Vérification de la session utilisateur au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/client/session", true);
  xhr.withCredentials = true; // Envoi des cookies avec la requête

  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText); // On suppose que le serveur renvoie un objet JSON
        const username = response.username; // Si le JSON a une clé 'username'
        document.getElementById("username").textContent = username;
        console.log(username);
      } catch (e) {
        console.error("Erreur lors du parsing JSON", e);
      }
    } else {
      // Redirection si la réponse n'est pas OK (par exemple, non connecté)
      window.location.href = "../index.html";
    }
  };

  xhr.onerror = function() {
    console.error("Erreur de requête Ajax");
  };

  xhr.send();
});
