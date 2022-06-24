import CodeMirror from "codemirror"; // CodeMirror Core Library

import "codemirror/mode/javascript/javascript.js"; // JavaScript, TypeScript, JSON
import "codemirror/mode/clike/clike"; // C Like - C, C++, Java, C#, Objective-C, Scala, GLSL, Squirrel, Ceylon
import "codemirror/mode/brainfuck/brainfuck"; // BrainFuck
import "codemirror/mode/mllike/mllike"; // ML Like - OCaml, F#
import "codemirror/mode/pascal/pascal"; // Pascal
import "codemirror/mode/perl/perl"; // Perl
import "codemirror/mode/php/php"; // PHP, HTML With PHP
import "codemirror/mode/xml/xml"; // XML, HTML
import "codemirror/mode/css/css"; // CSS, SCSS, LESS
import "codemirror/mode/htmlmixed/htmlmixed"; // HTML With CSS, JS
import "codemirror/mode/go/go"; // GoLang
import "codemirror/mode/shell/shell"; // Shell Scripts
import "codemirror/mode/python/python"; // Python, Cython
import "codemirror/mode/rust/rust"; // Rust
import "codemirror/mode/jsx/jsx"; // JSX, TSX
import "./mode/makefile.js"; // Makefile
import "codemirror/mode/yaml/yaml"; // Yaml
import "codemirror/mode/yaml-frontmatter/yaml-frontmatter"; // Yaml Frontmatter
import "codemirror/mode/lua/lua"; // Lua
import "codemirror/mode/markdown/markdown"; // Markdown
import "codemirror/mode/gfm/gfm"; // GitHub Flavor For Markdown
import "codemirror/mode/dart/dart"; // Dart

import "../../node_modules/codemirror/lib/codemirror.css"; // Default Theme
import "../../node_modules/codemirror/theme/base16-dark.css"; // Base16 Dark
import "../../node_modules/codemirror/theme/base16-light.css"; // Base16 Light

/**
 * Creates A New CodeMirror Editor
 * @param {String} id Element ID To Put The Editor inside of.
 * @param {String} theme String Specifying CodeMirror Theme
 * @param {Number} tabSize Tab Size
 * @param {String} mode Editor Mode
 * @returns
 */
export function CreateEditor(
	id, theme = "base16-dark",
	tabSize = 4, mode = "javascript",
	SaveReqCb = function() { console.log("Save Requested..."); },
	FileCloseReqCb = function() { console.log("File Close Requested..."); }
) {
	const element = document.getElementById(id);
	var CodeEditor = CodeMirror(element, {
		lineNumbers: true,
		theme: theme,
		indentUnit: tabSize,
		tabSize: tabSize,
		indentWithTabs: true,
		value: "// Start Coding...",
		mode: mode,
		autofocus: true,
		extraKeys: {
			"Ctrl-S": SaveReqCb,
			"Ctrl-W": FileCloseReqCb
		}
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

/**
 * Change CodeMirror's Mode
 * @param {Object} editor CodeMirror Instance
 * @param {String} mode CodeMirror Mode String
 * @returns {null}
 */
export function SetEditorMode(editor, mode) {
	if (!editor || !mode) return;
	editor.setOption("mode", mode);
}

/**
 * Set Indentation Of CodeMirror Instance
 * @param {Object} editor CodeMirror Instance
 * @param {Number} indentSize Size Of Indent (Default 4)
 * @param {Boolean} useTabs To Use Tabs Or Not (Default true)
 */
export function SetIndentationMode(editor, indentSize = 4, useTabs = true) {
	editor.setOption("indentUnit", indentSize);
	if (useTabs) {
		editor.setOption("tabSize", indentSize);
		editor.setOption("indentWithTabs", true);
	} else {
		editor.setOption("indentWithTabs", false);
	}
}