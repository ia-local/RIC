// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoutButton = document.getElementById('logout-button');
    const authLink = document.getElementById('auth-link');

    // Fonction pour charger le contenu d'une page statique
    async function loadPageContent(pageName, targetElementId) {
        try {
            const response = await fetch(`${pageName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            document.getElementById(targetElementId).innerHTML = htmlContent;
            console.log(`Content for ${pageName} loaded successfully.`);
        } catch (error) {
            console.error(`Could not load ${pageName}.html:`, error);
            document.getElementById(targetElementId).innerHTML = `<p class="error-message">Impossible de charger le contenu de la page ${pageName}.</p>`;
        }
    }

    // Fonction pour afficher une section spécifique et cacher les autres
    function showSection(sectionId) {
        document.querySelectorAll('.page-section').forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
                section.classList.add('active'); // Marque la section comme active
            } else {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });

        // Met à jour la classe 'active' dans la navigation
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId.replace('-page', '')}` ||
                (sectionId === 'auth-page' && link.id === 'auth-link')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Met à jour l'URL sans recharger la page
        history.pushState(null, '', `#${sectionId.replace('-page', '')}`);

        // Si c'est la page d'accueil, rafraîchir les stats si nécessaire
        if (sectionId === 'home-page') {
            updateHomeStats();
        }
    }

    // Fonction pour mettre à jour les statistiques de la page d'accueil
    async function updateHomeStats() {
        try {
            // Exemple : Récupérer le nombre de référendums actifs
            const referendumsResponse = await fetch('/api/referendums?status=active');
            const referendums = await referendumsResponse.json();
            document.getElementById('active-referendums-count').textContent = referendums.length;

            // Exemple : Récupérer le nombre total d'utilisateurs
            // NOTE: Cette route '/api/users/count' n'existe pas encore dans sereur.js, il faudrait l'ajouter !
            // Pour l'instant, on peut simuler ou compter tous les users si vous êtes admin
            // Ou plus simple pour dev, on peut avoir une route '/api/stats'
            const usersResponse = await fetch('/api/users'); // Pour un admin, ou créez une route /api/stats/usersCount
            const users = await usersResponse.json();
            document.getElementById('total-users-count').textContent = users.length;

            // Exemple : Récupérer le nombre total de votes
            // Idem, il faudrait une route '/api/stats/votesCount' ou un endpoint dédié
            const votesResponse = await fetch('/api/votes'); // Ceci listerait tous les votes, à adapter
            const votes = await votesResponse.json();
            document.getElementById('total-votes-count').textContent = votes.length;


        } catch (error) {
            console.error('Error updating home stats:', error);
            // Gérer l'affichage d'erreurs sur la page d'accueil si les stats ne se chargent pas
        }
    }


    // Gestion des liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche le comportement par défaut des liens
            const targetId = link.getAttribute('href').substring(1); // Retire le '#'
            showSection(`${targetId}-page`); // Ajoute '-page' pour correspondre aux IDs des sections
        });
    });

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('jwtToken'); // Supprime le token
        localStorage.removeItem('userRole'); // Supprime le rôle si stocké
        // Mettre à jour l'affichage
        authLink.textContent = 'Connexion / Inscription';
        authLink.style.display = 'inline';
        logoutButton.style.display = 'none';
        showSection('home-page'); // Retour à la page d'accueil
        displayNotification('Vous avez été déconnecté.', 'success');
    });

    // Fonction utilitaire pour afficher des notifications
    window.displayNotification = (message, type = 'info') => {
        const container = document.getElementById('notifications-container');
        const notification = document.createElement('div');
        notification.className = `notification-message ${type}`;
        notification.textContent = message;
        container.appendChild(notification);

        // Supprimer la notification après 5 secondes
        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    // Vérifier l'état de connexion au chargement
    function checkAuthStatus() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            authLink.style.display = 'none';
            logoutButton.style.display = 'inline';
            // Optionnel : récupérer le profil utilisateur pour afficher son nom
            fetch('/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.email) { // Si l'API retourne un user valide
                    authLink.textContent = `Bonjour, ${data.first_name}`; // Change le texte du lien si connecté
                    authLink.style.display = 'inline'; // Pour qu'il soit visible même si connecté
                    authLink.href = '#profile'; // Redirige vers le profil
                }
            }).catch(err => {
                console.error('Failed to fetch user profile after login:', err);
                // Si le token est invalide ou expiré, forcer la déconnexion
                localStorage.removeItem('jwtToken');
                authLink.textContent = 'Connexion / Inscription';
                authLink.style.display = 'inline';
                logoutButton.style.display = 'none';
            });
        } else {
            authLink.style.display = 'inline';
            logoutButton.style.display = 'none';
            authLink.textContent = 'Connexion / Inscription'; // Assurez-vous que le texte est correct
            authLink.href = '#login';
        }
    }

    // Initialisation
    checkAuthStatus();
    // Charger le contenu de la page d'accueil au démarrage
    loadPageContent('pages/home', 'home-page').then(() => {
        // Mettre à jour les statistiques une fois que le contenu est chargé
        updateHomeStats();
    });

    // Gérer le cas où l'utilisateur arrive avec une ancre dans l'URL
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showSection(`${initialHash}-page`);
    } else {
        showSection('home-page');
    }
});