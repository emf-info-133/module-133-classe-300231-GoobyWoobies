document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const resultEl = document.getElementById("loginResult");

  const userCredentials = {
    username: username,
    password: password
  };

  fetch("http://localhost:8080/client/login", {
    method: "POST",
    credentials: "include", // Important pour les cookies de session
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userCredentials)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Login failed");
    }
    return response.text();
  })
  .then(username => {
    resultEl.textContent = `Bienvenue ${username}`;
    window.location.href = "./html/main.html";
  })
  .catch(error => {
    resultEl.textContent = "Erreur de connexion";
    console.error("Error:", error);
  });
});

function logout() {
  fetch("http://localhost:8080/client/logout", {
    method: "POST",
    credentials: "include"
  })
  .then(response => {
    window.location.href = "/index.html";
  })
  .catch(error => {
    console.error("Logout error:", error);
  });
}