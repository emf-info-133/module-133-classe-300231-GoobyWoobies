window.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("http://localhost:8080/session/user", {
        credentials: "include"
      });
  
      if (response.ok) {
        const username = await response.text();
        document.getElementById("username").textContent = username;
      } else {
        // Rediriger vers login si non connecté
        window.location.href = "/login.html";
      }
    } catch (err) {
      console.error("Erreur de session", err);
    }
  });
  
  function logout() {
    fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include"
    }).then(() => {
      window.location.href = "/login.html";
    });
  }
  