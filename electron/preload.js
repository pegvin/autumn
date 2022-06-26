const { contextBridge, ipcRenderer } = require('electron')
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const nodeOsUtils = require('node-os-utils');
const AutumnConfig = require('../autmun.config.js');

var File = {
	fileName: "",
	fullPath: "",
	isSaved: false,
	editor: null,
	indent: {
		size: 4,
		tabs: true
	}
};

var NewFileEvt = new CustomEvent('NewFileEvt', {});
var SaveFileEvt = new CustomEvent('SaveFileEvt', {});
var SaveFileAsEvt = new CustomEvent('SaveFileAsEvt', { detail: File });
var OpenNewFileEvt = new CustomEvent('OpenNewFileEvt', { detail: File })

ipcRenderer.on('NewFileReq', (e, args) => {
	document.dispatchEvent(NewFileEvt);
})

ipcRenderer.on('OpenNewFileEvt', (e, args) => {
	File.fileName = path.basename(args[0]);
	File.fullPath = args[0];
	document.dispatchEvent(OpenNewFileEvt);
})

ipcRenderer.on('SaveFileReq', () => {
	document.dispatchEvent(SaveFileEvt);
})

ipcRenderer.on('SaveFileAsReq', (e, filePath) => {
	File.fileName = path.basename(filePath);
	File.fullPath = filePath;
	document.dispatchEvent(SaveFileAsEvt);
})

const eApi = {
	hardware: {
		ramUsage: function() {
			return nodeOsUtils.mem.info()
		},
		cpuUsage: function() {
			return nodeOsUtils.cpu.usage()
		}
	},
	system: {
		arch: os.arch(),
		platform: os.platform(),
		isDark: window.matchMedia("(prefers-color-scheme: dark)").matches
	},
	config: AutumnConfig,
	dialog: {
		ShowSaveFileDialog: function() {
			return new Promise((resolve, reject) => {
				ipcRenderer.send("ShowSaveFileDialog");
				ipcRenderer.on("ShowSaveFileDialog", (e, file) => {
					if (file === -1) {
						reject("Main Thread Returned -1");
					} else {
						resolve(file);
					}
				})
			})
		},
		ShowOpenFileDialog: function() {
			return new Promise((resolve, reject) => {
				ipcRenderer.send("ShowOpenFileDialog");
				ipcRenderer.on("ShowOpenFileDialog", (e, file) => {
					if (file === -1) {
						reject("Main Thread Returned -1");
					} else {
						resolve(file[0]);
					}
				})
			})
		}
	},
	path: {
		basename: function(filePath) {
			return path.basename(filePath);
		}
	},
	fs: {
		writeFile: function(filePath, contents) {
			try {
				fs.writeFileSync(filePath, contents, { encoding: 'utf-8' });
				return true;
			} catch (err) {
				console.log(err);
				return null;
			}
		},
		readFile: function(filePath) {
			try {
				return fs.readFileSync(filePath, { encoding: 'utf-8' }).toString();
			} catch (err) {
				console.log(err);
				return null;
			}
		}
	}
}

contextBridge.exposeInMainWorld('eApi', eApi);