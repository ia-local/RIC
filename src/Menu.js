const path = require('path');
const { app, Menu, MenuItem, BrowserWindow } = require('electron');
// Function to create a new BrowserWindow with default options
function createWindow(filePath, options = {}) {
  const window = new BrowserWindow({
    width: 987,
    height: 610,
    ...options,
  });

  // Load the file *after* the window is created
  window.loadFile(path.join(__dirname, filePath)); // Load the file

  window.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load ${filePath}: ${errorDescription} (Error Code: ${errorCode})`);
    // ... (Your error handling code)
  });

  return window;
}
function createTerminalWindow() {
  const terminalWindow = new BrowserWindow({ /* ... options ... */ });
  terminalWindow.loadFile(path.join(__dirname, './terminal.html')); // Charge terminal.html
}
function createMenu() {
  const template = [
    {
        label: 'El',
        submenu: [
          { label: 'Nouveau' },
          { label: 'Ouvrir' },
          { type: 'separator' },
          { label: 'Quitter', role: 'quit' }
        ]
      },
      {
        label: 'Édition',
        submenu: [
          { label: 'Annuler', role: 'undo' },
          { label: 'Rétablir', role: 'redo' },
          { type: 'separator' },
          { label: 'Couper', role: 'cut' },
          { label: 'Copier', role: 'copy' },
          { label: 'Coller', role: 'paste' },
          { label: 'Supprimer', role: 'delete' },
          { label: 'Sélectionner tout', role: 'selectall' },
          { type: 'separator' },
        ]
      },
      {
        label: 'Affichage',
        submenu: [
          { label: 'Recharger', role: 'reload' },
          { label: 'Forcer le rechargement', role: 'forcereload' },
          { label: 'Outils de développement', role: 'toggledevtools' },
          { type: 'separator' },
          { label: 'Zoom +', role: 'zoomin' },
          { label: 'Zoom -', role: 'zoomout' },
          { label: 'Réinitialiser le zoom', role: 'resetzoom' }
        ]
      },
      {
        label: 'Models',
        submenu: [
          {
            label: '💾  Groq',
            role:'system',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const groqWindow = new BrowserWindow({width: 987,height: 610});
              groqWindow.loadFile('models/groq/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '⏐M⏐ Mixtral',
            role:'system',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const mixtralWindow = new BrowserWindow({width: 987,height: 610});
              mixtralWindow.loadFile('models/mixtral/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '🐳 DeepSeek',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const deepSeekWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               deepSeekWindow.loadFile('models/deepSeek/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '⏐↪︎ Ollama',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const ollamaWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               ollamaWindow.loadFile('models/ollama/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '[Ø] Jarvis',
            models:'deepseek-r1-distill-qwen-32b',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const jarvisWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               jarvisWindow.loadFile('models/jarvis/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '🧑‍🎤 Avatars',
            models:'anonymous-7b-ar',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const avatarsWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               avatarsWindow.loadFile('models/avatars/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '📸 Dall-e',
            models:'dall-e-3',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const dall_e_Window = new BrowserWindow({
                width: 987,
                height: 610
              });
               dall_e_Window.loadFile('models/dall-e-3/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '🤗 GPT',
            models:'gpt-4o',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const gptWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               gptWindow.loadFile('models/openai/index.html');
            }
          }
        ]
      },      ,
      {
        label: 'Data',
        submenu: [
          {
            label: '🧾 Text',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const textDataWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               textDataWindow.loadFile('poublic/blog/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '🎚️ Audio',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const audioDataWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               audioDataWindow.loadFile('data/audio/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '🛣️ Image',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const imageDataWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               imageDataWindow.loadFile('data/image/index.html');
            }
          },
          { type: 'separator' },
          {
            label: '🎬 Video',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const videoDataWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               videoDataWindow.loadFile('data/video/index.html');
            }
          },
        ]
      },
      {
        label: 'Go',
        submenu: [
          {
            label: 'Back',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('./index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Page',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('public/about.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Web',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('public/about.html');
            }
          },
          { type: 'separator' },
          {
            label: ' > Google',
            click: () => {
              const googleWindow = new BrowserWindow({ width: 800, height: 600 });
              googleWindow.loadURL('https://www.google.com'); // Charger l'URL de l'iframe
            },
          },
          {
            label: ' > Telegram',
            click: () => {
              const telegramWindow = new BrowserWindow({ width: 800, height: 600 });
              telegramWindow.loadURL('https://t.me'); // Charger l'URL de l'iframe
            },
          },
          {
            label: ' > Youtube',
            click: () => {
              const youtubeWindow = new BrowserWindow({ width: 800, height: 600 });
              youtubeWindow.loadURL('https://www.youtube.com'); // Charger l'URL de l'iframe
            },
          },
          {
            label: ' > Instagram',
            click: () => {
              const instagramWindow = new BrowserWindow({ width: 800, height: 600 });
              instagramWindow.loadURL('https://www.intagram.com'); // Charger l'URL de l'iframe
            },
          },
          {
            label: ' > Facebook',
            click: () => {
              const facebookWindow = new BrowserWindow({ width: 800, height: 600 });
              facebookWindow.loadURL('https://www.facebook.com'); // Charger l'URL de l'iframe
            },
          },
          {
            label: ' > TikTok',
            click: () => {
              const googleWindow = new BrowserWindow({ width: 800, height: 600 });
              googleWindow.loadURL('https://www.Tiktik.com'); // Charger l'URL de l'iframe
            },
          },
        ]
      },
      {
        label: 'Blog',
        submenu: [
          {
            label: 'Blog_DevOps',
            click: () => {
                // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
                const blog = new BrowserWindow({width: 987,height: 610});
                blog.loadFile('public/blog/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Kjournal',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const kjournal = new BrowserWindow({width: 987,height: 610});
              kjournal.loadFile('public/kjournal/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'FactoryAi',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const factoryAI = new BrowserWindow({width: 987,height: 610});
              factoryAI.loadFile('public/FactoryAi/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Qi-Store',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const qi_store = new BrowserWindow({width: 987,height: 610});
              qi_store.loadFile('public/Qi.store/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Home',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const home = new BrowserWindow({width: 987,height: 610});
              home.loadFile('public/FactoryAi/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Desktop',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const desktop = new BrowserWindow({width: 987,height: 610});
              desktop.loadFile('srv/Destop/index.html');
            }
          }
        ]
      },

      {
        label: 'Wallet',
        submenu: [
          {
            label: 'Profile',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const walletWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               walletWindow.loadFile('items/wallet/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'CV',
            role:'system',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('models/about.html');
            }
          },          
          { type: 'separator' },
          {
            label: 'Smart Contract',
            role:'system',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const smartContractWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               smartContractWindow.loadFile('items/wallet/smartContract/index.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Rib',
            role:'system',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const ribWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               ribWindow.loadFile('wallet/rib.html');
            }
          },
          { type: 'separator' },
          {
            label: 'Card',
            role:'system',
            models:'',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const cardWindow = new BrowserWindow({
                width: 987,
                height: 610
              });
               cardWindow.loadFile('wallet/card/index.html');
            }
          },
        ]
      },
      {
        label: 'Terminal',
        submenu: [
          {
            label: 'Ouvrir le terminal',
            click: createTerminalWindow, // Appeler la fonction
            
          },
          {
            label: 'Configuration',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('terminal.html');
            }
          },
          {
            label: 'Réglages',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('about.html');
            }
          },
          {
            label: 'Profile',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('about.html');
            }
          },
          { type: 'separator' },
          {
            label: 'New',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('about.html');
            }
          },
          {
            label: 'Shell',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              createIframeWindow('./about.html');
            }
          },
          {
            label: 'Run',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('about.html');
            }
          }
        ]
      },
      {
        label: 'Aide',
        submenu: [
          {
            label: 'À propos',
            click: () => {
              // Affichez une boîte de dialogue ou une fenêtre avec les informations "À propos"
              const aboutWindow = new BrowserWindow({ /* ... */ });
              aboutWindow.loadFile('about.html');
            }
          }
        ]
      }
    ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
module.exports = { createMenu };