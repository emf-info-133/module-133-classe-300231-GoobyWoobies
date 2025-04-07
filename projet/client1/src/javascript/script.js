document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const resultEl = document.getElementById("loginResult");

  const userCredentials = {
    username: username,
    password: password
  };

  // Création de la requête AJAX
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
