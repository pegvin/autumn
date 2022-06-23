const { contextBridge, ipcRenderer } = require('electron')
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const AutumnConfig = require('../autmun.config.js');

var File = {
	fileName: "",
	fullPath: "",
	contents: ""
};

var OpenNewFileEvt = new CustomEvent('OpenNewFileEvt', {
	detail: File
})

ipcRenderer.on('OpenNewFileEvt', (e, args) => {
	File.fileName = path.basename(args[0]);
	File.fullPath = args[0];
	document.dispatchEvent(OpenNewFileEvt);
})

const eApi = {
	system: {
		arch: os.arch(),
		platform: os.platform(),
		isDark: window.matchMedia("(prefers-color-scheme: dark)").matches
	},
	config: AutumnConfig,
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