// sereur.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Pour la manipulation asynchrone des fichiers
const path = require('path');
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la gestion des sessions (tokens JWT)
const { v4: uuidv4 } = require('uuid'); // Pour générer des IDs uniques

// --- Configuration ---
const app = express();
const PORT = 3000; // Le port sur lequel le serveur Express écoutera (peut être un port interne pour Electron)
const DB_PATH = path.join(__dirname,'build', 'database.json'); // Chemin vers votre fichier de base de données JSON
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_jwt_tres_longue_et_complexe'; // Clé secrète pour les tokens JWT
const SALT_ROUNDS = 10; // Nombre de tours de salage pour bcrypt

// --- Middleware ---
app.use(bodyParser.json()); // Pour parser les requêtes JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques depuis le dossier 'public'

// --- Helpers pour la Base de Données JSON ---

/**
 * Lit la base de données JSON.
 * @returns {Promise<object>} Le contenu de la base de données.
 */
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') { // Fichier non trouvé, on retourne une structure vide
            console.warn('Database file not found, initializing empty DB.');
            return { users: [], referendums: [], votes: [], results: [] };
        }
        console.error('Error reading database:', error);
        throw error;
    }
}

/**
 * Écrit des données dans la base de données JSON.
 * @param {object} data Les données à écrire.
 * @returns {Promise<void>}
 */
async function writeDB(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing database:', error);
        throw error;
    }
}

/**
 * Middleware pour vérifier le token JWT
 * @param {object} req - Requête Express
 * @param {object} res - Réponse Express
 * @param {function} next - Fonction next
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Pas de token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token invalide ou expiré
        req.user = user; // Stocke les informations de l'utilisateur décodées
        next();
    });
};

// --- Routes API ---

// --- 1. Routes Utilisateurs ---
/**
 * @api {post} /api/users/register Inscription d'un nouvel utilisateur
 * @apiName RegisterUser
 * @apiGroup Users
 * @apiBody {String} email L'adresse email de l'utilisateur.
 * @apiBody {String} password Le mot de passe de l'utilisateur.
 * @apiBody {String} first_name Le prénom de l'utilisateur.
 * @apiBody {String} last_name Le nom de l'utilisateur.
 * @apiBody {Object} address L'adresse de l'utilisateur (ville, code postal, etc.).
 * @apiSuccess {String} message Confirmation d'inscription.
 * @apiError (400) {String} error Email déjà enregistré ou données manquantes.
 */
app.post('/api/users/register', async (req, res) => {
    const { email, password, first_name, last_name, address } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await readDB();
    if (db.users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUserId = uuidv4();
    const anonymizedId = bcrypt.hashSync(newUserId + JWT_SECRET, SALT_ROUNDS); // Simple anonymisation pour l'exemple

    const newUser = {
        id: newUserId,
        email,
        hashed_password: hashedPassword,
        first_name,
        last_name,
        address: address || {}, // Assurez-vous que l'adresse est un objet, même vide
        verification_status: 'pending', // Statut initial
        creation_date: new Date().toISOString(),
        last_login: null,
        role: 'citizen',
        anonymized_id: anonymizedId // ID unique pour le vote
    };

    db.users.push(newUser);
    await writeDB(db);
    res.status(201).json({ message: 'User registered successfully!' });
});

/**
 * @api {post} /api/users/login Connexion de l'utilisateur
 * @apiName LoginUser
 * @apiGroup Users
 * @apiBody {String} email L'adresse email de l'utilisateur.
 * @apiBody {String} password Le mot de passe de l'utilisateur.
 * @apiSuccess {String} token Token JWT pour l'authentification.
 * @apiSuccess {Object} user Informations de l'utilisateur (sans le mot de passe).
 * @apiError (401) {String} error Informations d'identification invalides.
 */
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await readDB();
    const user = db.users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Mise à jour du last_login
    user.last_login = new Date().toISOString();
    await writeDB(db);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, anonymized_id: user.anonymized_id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, first_name: user.first_name, role: user.role, verification_status: user.verification_status } });
});

/**
 * @api {get} /api/users/me Récupérer le profil de l'utilisateur connecté
 * @apiName GetMyProfile
 * @apiGroup Users
 * @apiHeader {String} Authorization Bearer Token JWT.
 * @apiSuccess {Object} user Informations complètes du profil utilisateur.
 * @apiError (401) {String} Unauthorized Token manquant ou invalide.
 */
app.get('/api/users/me', authenticateToken, async (req, res) => {
    const db = await readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' }); // Devrait pas arriver avec authenticateToken
    }
    // Ne pas renvoyer le mot de passe haché
    const { hashed_password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});


// --- 2. Routes Référendums ---
/**
 * @api {post} /api/referendums Soumettre un nouveau référendum
 * @apiName SubmitReferendum
 * @apiGroup Referendums
 * @apiHeader {String} Authorization Bearer Token JWT.
 * @apiBody {String} title Titre du référendum.
 * @apiBody {String} question Question binaire du référendum.
 * @apiBody {String} description Description détaillée.
 * @apiBody {String} end_vote_date Date de fin du vote (ISO String).
 * @apiBody {String} level Niveau de scrutin (local, regional, national, global).
 * @apiBody {Object} [target_location] Détails de la localisation si niveau local/régional.
 * @apiSuccess {String} message Confirmation de soumission.
 * @apiError (400) {String} error Données manquantes ou format invalide.
 * @apiError (403) {String} error Non autorisé (si l'utilisateur n'est pas vérifié, par exemple).
 */
app.post('/api/referendums', authenticateToken, async (req, res) => {
    const { title, question, description, end_vote_date, level, target_location } = req.body;

    if (!title || !question || !description || !end_vote_date || !level) {
        return res.status(400).json({ error: 'Missing required referendum fields' });
    }

    const db = await readDB();
    const user = db.users.find(u => u.id === req.user.id);

    // Exemple de règle : seul un utilisateur vérifié peut soumettre un référendum
    if (user.verification_status !== 'verified') {
        return res.status(403).json({ error: 'User not verified to submit referendums' });
    }

    const newReferendum = {
        id: uuidv4(),
        title,
        question,
        description,
        initiator_user_id: req.user.id,
        submission_date: new Date().toISOString(),
        start_vote_date: new Date().toISOString(), // Le vote commence dès la soumission pour l'exemple
        end_vote_date,
        status: 'active', // Directement actif pour l'exemple, pourrait être 'pending_validation'
        moderation_notes: null,
        level,
        target_location: target_location || null,
        attachments: []
    };

    db.referendums.push(newReferendum);
    await writeDB(db);
    res.status(201).json({ message: 'Referendum submitted successfully!', referendumId: newReferendum.id });
});

/**
 * @api {get} /api/referendums Lister les référendums
 * @apiName ListReferendums
 * @apiGroup Referendums
 * @apiQuery {String} [status] Filtrer par statut (active, closed, pending_validation).
 * @apiQuery {String} [level] Filtrer par niveau (local, regional, national, global).
 * @apiQuery {String} [search] Rechercher par mots-clés dans le titre ou la description.
 * @apiSuccess {Object[]} referendums Liste des référendums.
 */
app.get('/api/referendums', async (req, res) => {
    const { status, level, search } = req.query;
    const db = await readDB();
    let filteredReferendums = db.referendums;

    if (status) {
        filteredReferendums = filteredReferendums.filter(r => r.status === status);
    }
    if (level) {
        filteredReferendums = filteredReferendums.filter(r => r.level === level);
    }
    if (search) {
        const lowerCaseSearch = search.toLowerCase();
        filteredReferendums = filteredReferendums.filter(r =>
            r.title.toLowerCase().includes(lowerCaseSearch) ||
            r.description.toLowerCase().includes(lowerCaseSearch)
        );
    }
    res.json(filteredReferendums);
});

/**
 * @api {get} /api/referendums/:id Récupérer les détails d'un référendum
 * @apiName GetReferendumDetails
 * @apiGroup Referendums
 * @apiParam {String} id ID du référendum.
 * @apiSuccess {Object} referendum Détails complets du référendum.
 * @apiError (404) {String} error Référendum non trouvé.
 */
app.get('/api/referendums/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    const referendum = db.referendums.find(r => r.id === id);

    if (!referendum) {
        return res.status(404).json({ error: 'Referendum not found' });
    }
    res.json(referendum);
});


// --- 3. Routes Votes ---
/**
 * @api {post} /api/votes Voter pour un référendum
 * @apiName VoteReferendum
 * @apiGroup Votes
 * @apiHeader {String} Authorization Bearer Token JWT.
 * @apiBody {String} referendum_id ID du référendum.
 * @apiBody {String} vote_choice Choix du vote ('oui' ou 'non').
 * @apiSuccess {String} message Confirmation de vote.
 * @apiError (400) {String} error Vote invalide (déjà voté, référendum inactif, etc.).
 * @apiError (403) {String} error Non autorisé (utilisateur non vérifié).
 */
app.post('/api/votes', authenticateToken, async (req, res) => {
    const { referendum_id, vote_choice } = req.body;
    const db = await readDB();
    const user = db.users.find(u => u.id === req.user.id);
    const referendum = db.referendums.find(r => r.id === referendum_id);

    // Vérifications préliminaires
    if (!referendum) {
        return res.status(404).json({ error: 'Referendum not found' });
    }
    if (referendum.status !== 'active' || new Date().toISOString() > referendum.end_vote_date) {
        return res.status(400).json({ error: 'Referendum is not active or has ended' });
    }
    if (!['oui', 'non'].includes(vote_choice)) {
        return res.status(400).json({ error: 'Invalid vote choice. Must be "oui" or "non".' });
    }
    if (user.verification_status !== 'verified') {
        return res.status(403).json({ error: 'User not verified to vote' });
    }

    // Vérifier si l'utilisateur a déjà voté pour ce référendum
    const hasVoted = db.votes.some(vote =>
        vote.referendum_id === referendum_id && vote.voter_anonymized_id === req.user.anonymized_id
    );

    if (hasVoted) {
        return res.status(400).json({ error: 'You have already voted for this referendum' });
    }

    // --- ICI: Placeholder pour le chiffrement du vote ---
    // Dans une vraie implémentation, le vote_choice serait chiffré avant d'être stocké.
    // Pour cet exemple simple, nous stockons le choix tel quel pour démonstration.
    const encryptedVoteChoice = vote_choice; // Simplement pour illustrer le concept

    const newVote = {
        id: uuidv4(),
        referendum_id,
        voter_anonymized_id: req.user.anonymized_id, // L'ID anonymisé du votant
        vote_encrypted_payload: encryptedVoteChoice, // Le choix chiffré
        vote_timestamp: new Date().toISOString()
    };

    db.votes.push(newVote);
    await writeDB(db);
    res.status(201).json({ message: 'Vote recorded successfully!' });
});

/**
 * @api {get} /api/votes/status/:referendum_id Vérifier si l'utilisateur a voté
 * @apiName CheckVoteStatus
 * @apiGroup Votes
 * @apiHeader {String} Authorization Bearer Token JWT.
 * @apiParam {String} referendum_id ID du référendum.
 * @apiSuccess {Boolean} hasVoted Vrai si l'utilisateur a déjà voté, faux sinon.
 * @apiError (401) {String} Unauthorized Token manquant ou invalide.
 */
app.get('/api/votes/status/:referendum_id', authenticateToken, async (req, res) => {
    const { referendum_id } = req.params;
    const db = await readDB();

    const hasVoted = db.votes.some(vote =>
        vote.referendum_id === referendum_id && vote.voter_anonymized_id === req.user.anonymized_id
    );

    res.json({ hasVoted });
});

// --- 4. Routes Résultats ---
/**
 * @api {get} /api/results/:referendum_id Récupérer les résultats d'un référendum
 * @apiName GetReferendumResults
 * @apiGroup Results
 * @apiParam {String} id ID du référendum.
 * @apiSuccess {Object} results Résultats agrégés du référendum.
 * @apiError (404) {String} error Référendum ou résultats non trouvés.
 * @apiError (400) {String} error Le référendum n'est pas encore clôturé.
 */
app.get('/api/results/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    const referendum = db.referendums.find(r => r.id === id);

    if (!referendum) {
        return res.status(404).json({ error: 'Referendum not found' });
    }
    if (new Date().toISOString() < referendum.end_vote_date) {
        return res.status(400).json({ error: 'Referendum has not ended yet. Results are not available.' });
    }

    // Vérifier si les résultats sont déjà calculés
    let results = db.results.find(r => r.referendum_id === id);

    if (!results) {
        // Calculer les résultats si non présents
        const votesForReferendum = db.votes.filter(vote => vote.referendum_id === id);
        let votesYes = 0;
        let votesNo = 0;

        votesForReferendum.forEach(vote => {
            // --- ICI: Placeholder pour le déchiffrement du vote ---
            // En production, il faudrait déchiffrer vote.vote_encrypted_payload
            // Pour cet exemple, on suppose que encryptedVoteChoice est le vote réel
            if (vote.vote_encrypted_payload === 'oui') {
                votesYes++;
            } else if (vote.vote_encrypted_payload === 'non') {
                votesNo++;
            }
        });

        const totalVotes = votesYes + votesNo;
        const percentageYes = totalVotes > 0 ? (votesYes / totalVotes) * 100 : 0;
        const percentageNo = totalVotes > 0 ? (votesNo / totalVotes) * 100 : 0;

        results = {
            id: uuidv4(),
            referendum_id: id,
            total_votes: totalVotes,
            votes_for_yes: votesYes,
            votes_for_no: votesNo,
            percentage_yes: parseFloat(percentageYes.toFixed(2)),
            percentage_no: parseFloat(percentageNo.toFixed(2)),
            participation_rate: 0, // À calculer plus précisément avec le nombre d'éligibles
            calculation_date: new Date().toISOString(),
            is_final: true
        };

        db.results.push(results);
        // Mettre à jour le statut du référendum à 'closed'
        referendum.status = 'closed';
        await writeDB(db);
    }

    res.json(results);
});


// --- Lancement du serveur ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // console.log(`Serving static files from: ${path.join(__dirname, '..', 'public')}`);
    // console.log(`Database path: ${DB_PATH}`);
});

// Exporter l'application pour une utilisation potentielle par Electron's main process
module.exports = app;