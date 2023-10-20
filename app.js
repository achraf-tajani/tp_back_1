const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors'); // Importez le module cors

// Utilisez le middleware cors pour autoriser les requêtes depuis toutes les origines
app.use(cors());

// Créez un endpoint "/flux" pour le flux de données
app.get('/flux', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Simulez l'envoi de données en continu (toutes les 2 secondes)
    const startTime = Date.now();
    const duration = 15 * 1000; // 30 secondes

    const interval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - startTime < duration) {
            const message = `Message envoyé à ${currentTime}`;
            res.write(`data: ${message}\n\n`);
        } else {
            clearInterval(interval); // Arrêtez l'envoi de messages après 30 secondes
            res.end();
        }
    }, 1000); // Envoyer un message toutes les 0,5 seconde

    // Fermez la connexion en cas de déconnexion du client
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${PORT}`);
});
