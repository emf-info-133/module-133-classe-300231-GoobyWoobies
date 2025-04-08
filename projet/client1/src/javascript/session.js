window.addEventListener("DOMContentLoaded", function() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/client/session", true);
  xhr.withCredentials = true;

  xhr.onload = function() {
    if (xhr.status === 200) {
      const username = xhr.responseText;
      console.log("Utilisateur connecté:", username);
      document.getElementById("username").textContent = username;
    } else if (xhr.status === 401) {
      console.error("Non authentifié");
      // window.location.href = "../index.html";
    } else {
      console.error("Erreur serveur:", xhr.status);
    }
  };

  xhr.onerror = function() {
    console.error("Erreur réseau lors de la vérification de session");
  };

  xhr.send();
});