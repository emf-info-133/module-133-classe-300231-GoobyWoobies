window.addEventListener("DOMContentLoaded", () => {
  const sessionId = localStorage.getItem('sessionId');
  console.log("ID de session récupéré:", sessionId);
  
  if (!sessionId) {
    console.error("Pas d'ID de session trouvé");
    // window.location.href = "../index.html";
    return;
  }
  
  const xhr = new XMLHttpRequest();
  // Ajoutez explicitement le sessionId comme paramètre d'URL
  xhr.open("GET", `http://localhost:8080/client/session?sessionId=${encodeURIComponent(sessionId)}`, true);
  
  // Supprimez withCredentials si vous utilisez localStorage au lieu des cookies
  // xhr.withCredentials = true;

  xhr.onload = function() {
    console.log("Status:", xhr.status);
    console.log("Réponse:", xhr.responseText);
    
    if (xhr.status < 400){
      const username = xhr.responseText;
      document.getElementById("username").textContent = username;
    } else {
      console.error("Erreur de session:", xhr.responseText);
      // localStorage.removeItem('sessionId');
      // window.location.href = "../index.html";
    }
  };
  
  xhr.onerror = function() {
    console.error("Erreur de requête Ajax");
  };

  xhr.send();
});