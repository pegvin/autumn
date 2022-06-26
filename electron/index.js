const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');

// APP_DEV=true electron-forge start
const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;
var mainWindow = undefined;

async function ShowOpenSaveDialog() {
	let file = dialog.showSaveDialogSync(mainWindow, {
		title: 'Save file as',
		filters: [
			{ name: 'All Files', extensions: ['*'] }
		],
		properties: ["showOverwriteConfirmation", "dontAddToRecent"]
	})
	if (file != undefined) {
		return file;
	} else {
		return -1;
	}
}

async function ShowOpenFileDialog() {
	let file = dialog.showOpenDialogSync(mainWindow, {
		title: 'Select a file to open',
		message: 'Some Message',
		filters: [
			{ name: 'All Files', extensions: ['*'] }
		],
		properties: ["openFile", "createDirectory", "promptToCreate", "dontAddToRecent"]
	});
	if (file != undefined || file?.length > 0) {
		return file;
	} else {
		return -1;
	}
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		icon: path.join(__dirname, "../public/icon.png"),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	const MenuTemplate = [
		{
			label: 'File',
			submenu: [
				{
					label: "New File",
					click: async function() {
						mainWindow.webContents.send("NewFileReq", []);
					}
				},
				{
					label: "Open File",
					click: async function() {
						let file = await ShowOpenFileDialog();
						if (file !== 1) {
							mainWindow.webContents.send("OpenNewFileEvt", file);
						}
					}
				},
				{
					label: "Save",
					click: async function() {
						mainWindow.webContents.send("SaveFileReq", []);
					}
				},
				{
					label: "Save As",
					click: async function() {
						let file = await ShowOpenSaveDialog();
						if (file !== -1) {
							mainWindow.webContents.send("SaveFileAsReq", file);
						}
					}
				}
			]
		}
	];

	const menu = Menu.buildFromTemplate(MenuTemplate);
	Menu.setApplicationMenu(menu);

	mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
	if (isDev == true) {
		mainWindow.webContents.openDevTools();
	}
};

// -1 Returns Are Handled in Preload.js

ipcMain.on("ShowSaveFileDialog", async () => {
	let file = await ShowOpenSaveDialog();
	mainWindow.webContents.send("ShowSaveFileDialog", file);
})

ipcMain.on("ShowOpenFileDialog", async () => {
	let file = await ShowOpenFileDialog();
	mainWindow.webContents.send("ShowOpenFileDialog", file);
})

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
