$(document).ready(function () {
    $("#registerForm").submit(function (e) {
      e.preventDefault();
   
      const username = $("#regUsername").val();
      const password = $("#regPassword").val();
      const confirmPassword = $("#regConfirmPassword").val();
   
      // Validation côté client
      if (password !== confirmPassword) {
        $("#registerResult")
          .text("Les mots de passe ne correspondent pas")
          .css("color", "red");
        return;
      }
   
      if (username.length < 3) {
        $("#registerResult")
          .text("Le nom d'utilisateur doit faire au moins 3 caractères")
          .css("color", "red");
        return;
      }
   
      if (password.length < 6) {
        $("#registerResult")
          .text("Le mot de passe doit faire au moins 6 caractères")
          .css("color", "red");
        return;
      }
   
      // Envoi des données au serveur
      $.ajax({
        url: "http://localhost:8080/client/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          username: username,
          password: password,
        }),
        success: function (response) {
          $("#registerResult")
            .text("Inscription réussie ! Redirection...")
            .css("color", "green");
          setTimeout(() => {
            window.location.href = "../html/index.html";
          }, 1500);
        },
        error: function (xhr) {
          const errorMsg =
            xhr.responseJSON?.message || "Erreur lors de l'inscription";
          $("#registerResult").text(errorMsg).css("color", "red");
        },
      });
    });
  });