const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

// APP_DEV=true electron-forge start
const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

function createWindow() {
	const mainWindow = new BrowserWindow({
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
					label: "Open",
					click: async function() {
						let file = dialog.showOpenDialogSync(mainWindow, {
							title: 'Select a file to open',
							message: 'Some Message',
							filters: [
								{ name: 'All Files', extensions: ['*'] }
							]
						})
						if (file != undefined) {
							mainWindow.webContents.send("OpenNewFileEvt", file);
						}
					}
				},
				{
					label: "Save",
					click: async function() {
						mainWindow.webContents.send("SaveFileReq", []);
					}
				}
				// {
				// 	label: "",
				// 	click: async function() {}
				// },
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
