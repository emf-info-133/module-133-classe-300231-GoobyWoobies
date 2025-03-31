Projet Module 133 - Sessions-Handling

📚 Description du Projet

Ce projet a pour but de réaliser une application web interactive sous forme de quiz informatique. L'utilisateur pourra choisir un thème parmi plusieurs catégories (développement, réseaux, systèmes, sécurité, etc.) et répondre à une série de questions. En fonction de ses réponses, un score lui sera attribué. Un classement sera disponible pour voir les meilleurs participants.

Une interface d'administration permettra aux administrateurs de gérer les quiz en ajoutant de nouvelles questions et catégories.

🛠️ Technologies utilisées

Frontend : HTML, CSS, JavaScript

Backend : Node.js avec Express

Base de données : MySQL

API : REST avec une API Gateway

🌐 Fonctionnalités principales

Côté utilisateur :

Inscription et connexion

Choix du thème du quiz

Réponse aux questions

Affichage du score final

Consultation du classement

Côté administrateur :

Ajout de nouvelles catégories

Création de nouvelles questions avec choix de réponse

Gestion des quiz

🌐 Architecture du projet

Le projet est structuré en plusieurs applications :

Client (Frontend) : Interface utilisateur

API Gateway : Gère les requêtes et la redirection vers les bonnes API

API Quiz : Gère les quiz et les questions

API Utilisateurs : Gère les comptes et l'authentification

Base de données : Stocke les utilisateurs, quiz, scores, etc.

💪 Objectifs pédagogiques

Mettre en place une gestion de session sécurisée

Structurer une application en plusieurs services

Appliquer les principes des API REST

Assurer une séparation entre le frontend et le backend

🛠️ Installation

Cloner le projet

git clone https://github.com/ton-repo/module133.git

Installer les dépendances

cd module133
npm install

Lancer le serveur

npm start

📖 Auteurs

Illan Angel

Noam Bourqui
