import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript.js";
import "../../node_modules/codemirror/lib/codemirror.css";
import "../../node_modules/codemirror/theme/base16-dark.css";
import "../../node_modules/codemirror/theme/base16-light.css";

/**
 * Creates A New CodeMirror Editor
 * @param {String} id Element ID To Put The Editor inside of.
 * @param {String} theme String Specifying CodeMirror Theme
 * @param {Number} tabSize Tab Size
 * @param {String} mode Editor Mode
 * @returns 
 */
export function CreateEditor(id, theme = "base16-dark", tabSize = 4, mode = "javascript") {
	const element = document.getElementById(id);
	var CodeEditor = CodeMirror(element, {
		lineNumbers: true,
		theme: theme,
		indentUnit: tabSize,
		tabSize: tabSize,
		indentWithTabs: true,
		value: "// Start Coding...",
		mode: mode,
		autofocus: true
	})
	CodeEditor?.setSize("100%", "100%");
	document.body.className = theme;

	return CodeEditor;
}

/**
 * Set Editor Theme
 * @param {Object} editor CodeMirror Instance
 * @param {String} theme Theme To Set To
 */
export function SetEditorTheme(editor, theme) {
	editor.setOption("theme", theme);
	document.body.className = theme;
}

/**
 * Get Editor Theme
 * @param {Object} editor CodeMirror Instance
 * @returns {String}
 */
export function GetEditorTheme(editor) {
	return editor.getOption("theme");
}

/**
 * Change Editor's Font Family
 * @param {Object} editor Array Of CodeMirror Editors
 * @param {String} fontFamily CSS String Specifying Font Family
 * @param {Number} fontSize Font Size in Pixels
 * @returns {null}
 */
export async function SetEditorFont(editor, fontFamily = "monospace", fontSize = 18) {
	document.getElementById("CodeEditorArea").style.fontSize = fontSize + "px";
	document.querySelectorAll(".CodeMirror *")?.forEach((element) => {
		element.style.fontFamily = fontFamily;
	});

	editor?.refresh();
}
