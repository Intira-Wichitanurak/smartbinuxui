const { app, BrowserWindow } = require('electron');
const path = require('path');

function resolveRendererTarget() {
  const devServerUrl = process.argv.find((arg) => typeof arg === 'string' && arg.startsWith('http://'));
  if (devServerUrl) {
    return { type: 'url', value: devServerUrl };
  }

  return {
    type: 'file',
    value: path.join(__dirname, '..', 'dist', 'index.html'),
  };
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    minWidth: 1024,
    minHeight: 600,
    autoHideMenuBar: true,
    backgroundColor: '#eaf2ee',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const target = resolveRendererTarget();
  if (target.type === 'url') {
    win.loadURL(target.value);
    return;
  }

  win.loadFile(target.value);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
