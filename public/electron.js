const path = require("path");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");

var win;
var update;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, 'baklogo.ico')
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000/"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) win.webContents.openDevTools({ mode: "detach" });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("save", (event) => {
  dialog
    .showSaveDialog({ filters: [{ name: "Excel", extensions: ["xlsx"] }] })
    .then((result) => {
      event.returnValue = result;
    });
});

ipcMain.on("update", (event, sources) => {
  update = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    parent: win,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "/preload.js"),
    },
  });
  update.loadURL(
    isDev
      ? `http://localhost:3000/#/update/${sources}`
      : `file://${path.join(
        __dirname,
        "../build/index.html#update"
      )}/${sources}`
  );
  if (isDev) update.webContents.openDevTools({ mode: "detach" });
});

ipcMain.on("setCenters", () => {
  dialog.showMessageBox({ message: "saved", type: "none", title: "saved" });
});
ipcMain.on("isDev", (event) => {
  event.returnValue = isDev;
});
