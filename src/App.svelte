<script>
	import Mousetrap from "mousetrap";
	import Tabs from "./components/Tabs.svelte";
	import Welcome from "./components/Welcome.svelte";
	import Statusbar from "./components/Statusbar.svelte";
	import { onMount } from "svelte";
	import { CreateEditor, SetEditorFont, SetEditorActive, SetEditorMode, SetEditorTheme, SetIndentationMode } from "./lib/CodeEditor.js";
	import DetectIndent from 'detect-indent';
	import FileTypeMap from "./lib/FileTypeMap.js";

	var EditorOptions = {
		theme: "base16-dark",
		indent: {
			size: 4,
			tabs: true
		},
		mode: "javascript",
		extraKeys: {
			"Ctrl-S": SaveFile,
			"Ctrl-W": CloseFile,
			"Ctrl-N": NewFile,
			"Ctrl-Space": "autocomplete"
		}
	};

	let CurrTab = 0;
	let PrevTab = 0;
	let Files = [];
	$: ReRenderTabs = 0; // Change To Anything To Re-Render

	function NewFile() {
		console.log("Creating A New File...")
		let editor = CreateEditor("CodeEditorArea", EditorOptions);

		Files.push({
			fileName: "untitled",
			fullPath: null,
			isSaved: false,
			editor: editor,
			indent: {
				size: 4,
				tabs: true
			}
		});

		SetEditorActive(editor);
		onTabChange(Files.length - 1);
		ReRenderTabs++;
	}

	async function CloseFile() {
		if (Files.length <= 0) return;
		if (Files.length === 1) {
			Files[0].editor.getWrapperElement().remove();
			delete Files[0].editor;
			Files = [];
			CurrTab = 0;
			PrevTab = 0;
		} else {
			Files[CurrTab].editor.getWrapperElement().remove();
			delete Files[CurrTab].editor;
			Files.splice(CurrTab, 1);
			CurrTab = Files.length - 1;
			SetEditorActive(Files[Files.length - 1].editor);
		}
		ReRenderTabs--;
	}

	async function SaveFile() {
		let file = Files[CurrTab];
		if (!file) return;
		if (!file.fullPath) {
			try {
				let filePath = await eApi.dialog.ShowSaveFileDialog();
				file.fileName = eApi.path.basename(filePath);
				file.fullPath = filePath;
			} catch(err) {
				console.log(err);
				return;
			}
		}

		eApi.fs.writeFile(file.fullPath, file.editor.getValue());
		file.isSaved = true;
	}

	function onTabChange(currIndex) {
		PrevTab = CurrTab;
		CurrTab = currIndex;
		SetEditorActive(Files[CurrTab].editor);
		console.log("Previous Tab: " + PrevTab, "\nCurrent Tab: " + CurrTab);
	}

	onMount(async () => {
		console.log("App Mounted...");

		// Add Event Listeners
		document.addEventListener("SaveFileEvt", SaveFile);
		Mousetrap.bind(['ctrl+s', 'command+s'], SaveFile);
		Mousetrap.bind(['ctrl+w', 'command+w'], CloseFile);
		Mousetrap.bind(['ctrl+n', 'command+n'], NewFile);

		Files.forEach(file => {
			file.editor.on("change", () => {
				file.isSaved = false;
			})
		})

		if (eApi.config.Editor.Theme) {
			Files.forEach(file => {
				SetEditorTheme(file.editor, eApi.config.Editor.Theme);
			})
			// Above Code Might Not Be Executed Because Of There "Might" Be No Files
			SetEditorTheme(undefined, eApi.config.Editor.Theme);
		}

		if (eApi.config.Editor.FontFamily) {
			Files.forEach(file => {
				SetEditorFont(
					file.editor,
					eApi.config.Editor.FontFamily,
					eApi.config.Editor.FontSize != undefined ? eApi.config.Editor.FontSize : 18
				);
			})
			// Above Code Might Not Be Executed Because Of There "Might" Be No Files
			SetEditorFont(
				undefined,
				eApi.config.Editor.FontFamily,
				eApi.config.Editor.FontSize != undefined ? eApi.config.Editor.FontSize : 18
			);
		}

		document.addEventListener("NewFileEvt", NewFile);
		document.addEventListener("SaveFileAsEvt", (e) => {
			Files[CurrTab].fullPath = e.detail.fullPath;
			Files[CurrTab].fileName = e.detail.fileName;
			SaveFile();
		});

		document.addEventListener("OpenNewFileEvt", (e) => {
			for (let i = 0; i < Files.length; i++) {
				if (Files[i].fullPath === e.detail.fullPath) {
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

			let detectedIndent = DetectIndent(FileContents);
			if (detectedIndent.type == undefined || detectedIndent.type == "tab") {
				EditorOptions.indent.size = 4;
				EditorOptions.indent.tabs = true;
			} else {
				if (detectedIndent.type == "space") {
					EditorOptions.indent.size = detectedIndent.amount;
					EditorOptions.indent.tabs = false;
				}
			}

			NewFile();

			let file = Files[Files.length - 1];
			file.fileName = e.detail.fileName;
			file.fullPath = e.detail.fullPath;
			file.editor.setValue(FileContents);
			file.editor.clearHistory();

			SetIndentationMode(file.editor, file.indent.size, file.indent.tabs);
			FileTypeMap.forEach(FileType => {
				if (FileType.extension.includes(fileExt) == true) {
					console.log("Setting CodeMirror Mode To '" + FileType.cmMode + "'")
					SetEditorMode(file.editor, FileType.cmMode);
				}
			})
		})
	});
</script>

<div id="CodeSpace">
	{#if Files.length == 0}
		<Welcome />
	{/if}

	{#if Files.length > 0 && ReRenderTabs}
		<Tabs items={Files} activeTabIndex={CurrTab} onChange={onTabChange} />
	{/if}

	<div id="CodeEditorArea"></div>

	{#if Files.length > 0}
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
		position: relative;
		width: 100%;
		height: calc(100% - var(--CodeEditorTabHeight) - var(--CodeEditorSBHeight));
	}
</style>
