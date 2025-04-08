// Fonction pour gérer la soumission du formulaire de connexion
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const resultEl = document.getElementById("loginResult");

  const userCredentials = {
    username: username,
    password: password
  };

  // Création de la requête AJAX pour la connexion
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/client/login", true);
  xhr.setRequestHeader("Content-Type", "application/json"); // Spécification du type de contenu

  // Définition du comportement en cas de réponse
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const data = xhr.responseText;
      resultEl.textContent = data;
      console.log("ID de session reçu:", data); // Ajoutez cette ligne
      if (xhr.status === 200) {
        localStorage.setItem('sessionId', data);
        console.log("ID de session stocké:", localStorage.getItem('sessionId')); // Vérifiez le stockage
        window.location.href = "./html/main.html";
      }
    }
  };

  // Envoi de la requête avec les données JSON
  xhr.send(JSON.stringify(userCredentials));
});

// Fonction pour gérer la déconnexion
function logout() {
  const sessionId = localStorage.getItem('sessionId');
  
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:8080/logout?sessionId=${encodeURIComponent(sessionId)}`, true);
  xhr.withCredentials = true;

  xhr.onload = function() {
    if (xhr.status === 200) {
      localStorage.removeItem('sessionId'); // Supprimez la session
      window.location.href = "/login.html";
    }
  };

  xhr.onerror = function() {
    console.error("Erreur de déconnexion");
  };

  xhr.send();
}
