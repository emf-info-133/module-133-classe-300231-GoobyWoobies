window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/client/current-user", {
    credentials: "include" // Important pour les cookies de session
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Not authenticated");
    }
    return response.text();
  })
  .then(username => {
    console.log(username);
    document.getElementById("username").textContent = username;
  })
  .catch(error => {
    console.error("Session error:", error);
    //window.location.href = "../index.html";
  });
});