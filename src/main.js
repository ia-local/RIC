require('dotenv').config(); // Charger les variables d'environnement depuis .env
const { app, Menu, MenuItem,ipcMain, BrowserWindow, shell } = require('electron'); 
const path = require('path');
const { createMenu } = require('./Menu.js'); // Importez la fonction de création du menu
const express = require('express');
const { generateResponse, makeResponse } = require('./groq-utils.js');
const electronReload = require('electron-reload');
const Cluster = require('./heavy.js');
const { spawn } = require('child_process'); // Pour exécuter des commandes

if (process.env.NODE_ENV === 'development') {
    electronReload(__dirname);
}

const server = express();
server.use(express.json());

function createWindow() {
    const win = new BrowserWindow({
        width: 987,
        height: 610,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    win.loadURL('http://localhost:3000/index.html');
    createMenu(); // Appelez la fonction pour créer le menu
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});