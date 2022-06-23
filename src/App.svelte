<script>
	import Tabs from "./components/Tabs.svelte";
	import { onMount } from "svelte";
	import { CreateEditor, SetEditorFont } from "./lib/CodeEditor.js";

	var CodeEditor;

	let CurrentTab = 0;
	let PreviousTab = 0;
	let OpenedFiles = [];

	function onTabChange(currIndex) {
		if (CurrentTab == currIndex) return; // this event is fired even when user clicks on the already selected tab, to prevent code running twice for no reason we use this if condition.

		PreviousTab = CurrentTab;
		CurrentTab = currIndex;
		// console.log("Prev: " + PreviousTab, "\nCurr: " + CurrentTab);

		OpenedFiles[PreviousTab].contents = CodeEditor.getValue();
		CodeEditor.setValue(OpenedFiles[CurrentTab].contents);
	}

	onMount(async () => {
		console.log("Mounted...");
		CodeEditor = CreateEditor("CodeEditorArea", eApi.system.isDark ? "base16-dark" : "base16-light", 4, "javascript");
		SetEditorFont(CodeEditor, eApi.config.Editor.FontFamily, 18);

		document.addEventListener("OpenNewFileEvt", (e) => {
			for (let i = 0; i < OpenedFiles.length; i++) {
				if (OpenedFiles[i].fullPath === e.detail.fullPath) {
					return;
				}
			}
			var FileContents = eApi.fs.readFile(e.detail.fullPath);
			if (!FileContents) return;

			OpenedFiles.push({});
			Object.assign(OpenedFiles[OpenedFiles.length - 1], e.detail);
			OpenedFiles[OpenedFiles.length - 1].contents = FileContents;
			if (OpenedFiles.length === 1) {
				CodeEditor.setValue(FileContents);
			}
		})
	});
</script>

<div id="CodeSpace">
	<div style="z-index: {OpenedFiles.length > 0 ? -999 : 999};" id="CodeEditorWelcome">
		<div class="text">
			<h1>Autumn</h1>
			<p>A Code Editor Inspired By Atom</p>
		</div>
	</div>
	<Tabs items={OpenedFiles} activeTabIndex={CurrentTab} onChange={onTabChange} />
	<div id="CodeEditorArea"></div>
</div>

<style>
	#CodeSpace {
		position: relative;
		color: #fff;
		background-color: #222;
		--CodeEditorTabHeight: 30px;
		display: block;
		height: 100%;
		width: 100%;
	}

	#CodeEditorWelcome {
		background-color: #222;
		position: absolute;
		top: 0; left: 0;
		width: 100%; height: 100%;
	}

	#CodeEditorWelcome div.text {
		z-index: 10;
		position: absolute;
		bottom: 80px;
		right: 60px;
	}

	#CodeEditorArea {
		width: 100%;
		height: calc(100% - var(--CodeEditorTabHeight));
	}
</style>
