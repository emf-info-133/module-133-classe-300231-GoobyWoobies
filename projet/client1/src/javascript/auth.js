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
    if (xhr.readyState === 4) {  // Si la requête est terminée
      const data = xhr.responseText;
      resultEl.textContent = data;
      resultEl.classList.remove("text-red-500", "text-green-500");

      if (xhr.status === 200) {
        resultEl.classList.add("text-green-500");
        // Redirection vers main.html après une connexion réussie
        window.location.href = "./html/main.html";
      } else {
        resultEl.classList.add("text-red-500");
      }
    }
  };

  // Envoi de la requête avec les données JSON
  xhr.send(JSON.stringify(userCredentials));
});

// Fonction pour gérer la déconnexion
function logout() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/logout", true);
  xhr.withCredentials = true; // Envoi des cookies avec la requête

  xhr.onload = function() {
    if (xhr.status === 200) {
      window.location.href = "/login.html"; // Rediriger après une déconnexion réussie
    }
  };

  xhr.onerror = function() {
    console.error("Erreur de déconnexion");
  };

  xhr.send();
}
