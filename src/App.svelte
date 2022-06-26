<script>
	import Mousetrap from "mousetrap";
	import Tabs from "./components/Tabs.svelte";
	import Welcome from "./components/Welcome.svelte";
	import Statusbar from "./components/Statusbar.svelte";
	import { onMount } from "svelte";
	import { CreateEditor, SetEditorFont, SetEditorMode, SetEditorTheme, SetIndentationMode } from "./lib/CodeEditor.js";
	import DetectIndent from 'detect-indent';
	import FileTypeMap from "./lib/FileTypeMap.js";

	var CodeEditor;

	let CurrentTab = 0;
	let PreviousTab = 0;
	let OpenedFiles = [];

	function NewFile() {
		console.log("Creating A New File...")
		OpenedFiles.push({
			fileName: "untitled",
			fullPath: null,
			contents: "",
			isSaved: false,
			indent: {
				size: 4,
				tabs: true
			}
		});

		onTabChange(OpenedFiles.length - 1);
	}

	async function CloseFile() {
		if (OpenedFiles.length <= 0) return;
		if (OpenedFiles.length === 1) {
			OpenedFiles = [];
			CurrentTab = 0;
			PreviousTab = 0;
			CodeEditor.setValue("");
		} else {
			OpenedFiles.splice(CurrentTab, 1);
			CurrentTab = OpenedFiles.length - 1; // Change The Current Tab To The Last Tab.
			CodeEditor.setValue(OpenedFiles[CurrentTab].contents);
		}
	}

	async function SaveFile() {
		let fileObj = OpenedFiles[CurrentTab];
		if (!fileObj) return;
		if (!fileObj.fullPath) {
			try {
				let file = await eApi.dialog.ShowSaveFileDialog();
				fileObj.fileName = eApi.path.basename(file);
				fileObj.fullPath = file;
			} catch(err) {
				console.log(err);
				return;
			}
		}

		fileObj.contents = CodeEditor.getValue();
		eApi.fs.writeFile(fileObj.fullPath, fileObj.contents);
		fileObj.isSaved = true;
	}

	function onTabChange(currIndex) {
		PreviousTab = CurrentTab;
		CurrentTab = currIndex;
		console.log("Previous Tab: " + PreviousTab, "\nCurrent Tab: " + CurrentTab);

		OpenedFiles[PreviousTab].contents = CodeEditor.getValue();
		CodeEditor.setValue(OpenedFiles[CurrentTab].contents);
	}

	onMount(async () => {
		console.log("App Mounted...");

		document.addEventListener("SaveFileEvt", SaveFile);
		Mousetrap.bind(['ctrl+s', 'command+s'], SaveFile);
		Mousetrap.bind(['ctrl+w', 'command+w'], CloseFile);
		Mousetrap.bind(['ctrl+n', 'command+n'], NewFile);

		CodeEditor = CreateEditor(
			"CodeEditorArea", eApi.system.isDark ? "base16-dark" : "base16-light",
			4, "javascript",
			{
				"Ctrl-S": SaveFile,
				"Ctrl-W": CloseFile,
				"Ctrl-N": NewFile,
				"Ctrl-Space": "autocomplete"
			}
		);

		CodeEditor.on("change", () => {
			if (OpenedFiles.length > 0) {
				OpenedFiles[CurrentTab].isSaved = false;
			}
		})
		if (eApi.config.Editor.Theme) {
			SetEditorTheme(CodeEditor, eApi.config.Editor.Theme);
		}
		if (eApi.config.Editor.FontFamily) {
			SetEditorFont(
				CodeEditor,
				eApi.config.Editor.FontFamily,
				eApi.config.Editor.FontSize != undefined ? eApi.config.Editor.FontSize : 18
			);
		}

		document.addEventListener("NewFileEvt", NewFile);

		document.addEventListener("SaveFileAsEvt", (e) => {
			OpenedFiles[CurrentTab].fullPath = e.detail.fullPath;
			OpenedFiles[CurrentTab].fileName = e.detail.fileName;
			SaveFile();
		});

		document.addEventListener("OpenNewFileEvt", (e) => {
			for (let i = 0; i < OpenedFiles.length; i++) {
				if (OpenedFiles[i].fullPath === e.detail.fullPath) {
					return;
				}
			}

			var fileExt = e.detail.fileName.substr(e.detail.fileName.lastIndexOf('.') + 1);

			if (!fileExt || fileExt === "") {
				fileExt = e.detail.fileName;
			}

			fileExt = fileExt.toLowerCase();

			var FileContents = eApi.fs.readFile(e.detail.fullPath);
			if (!FileContents) return;

			OpenedFiles.push({});
			Object.assign(OpenedFiles[OpenedFiles.length - 1], e.detail);

			OpenedFiles[OpenedFiles.length - 1].contents = FileContents;

			let indent = DetectIndent(FileContents);
			if (indent.type == undefined || indent.type == "tab") {
				OpenedFiles[OpenedFiles.length - 1].indent.size = 4;
				OpenedFiles[OpenedFiles.length - 1].indent.tabs = true;
			} else {
				if (indent.type == "space") {
					OpenedFiles[OpenedFiles.length - 1].indent.size = indent.amount;
					OpenedFiles[OpenedFiles.length - 1].indent.tabs = false;
				}
			}

			if (OpenedFiles.length === 1) {
				CodeEditor.setValue(FileContents);
			}

			FileTypeMap.forEach(FileType => {
				if (FileType.extension.includes(fileExt) == true) {
					console.log("Setting CodeMirror Mode To '" + FileType.cmMode + "'")
					SetEditorMode(CodeEditor, FileType.cmMode);
				}
			})

			SetIndentationMode(
				CodeEditor,
				OpenedFiles[OpenedFiles.length - 1].indent.size,
				OpenedFiles[OpenedFiles.length - 1].indent.tabs
			);
		})
	});
</script>

<div id="CodeSpace">
	{#if OpenedFiles?.length == 0}
		<Welcome />
	{/if}

	{#if OpenedFiles?.length > 0}
		<Tabs items={OpenedFiles} activeTabIndex={CurrentTab} onChange={onTabChange} />
	{/if}

	<div id="CodeEditorArea"></div>

	{#if OpenedFiles?.length > 0}
		<Statusbar />
	{/if}
</div>

<style>
	#CodeSpace {
		--CodeEditorTabHeight: 30px;
		--CodeEditorSBHeight: 30px;
		position: relative;
		color: var(--fg);
		background-color: var(--bg);
		display: block;
		height: 100%;
		width: 100%;
	}

	#CodeEditorArea {
		width: 100%;
		height: calc(100% - var(--CodeEditorTabHeight) - var(--CodeEditorSBHeight));
	}
</style>
