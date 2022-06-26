import CodeMirror from "codemirror"; // CodeMirror Core Library

// Auto Close & Match
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";

// Suggestions & AutoComplete
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/hint/xml-hint";

// Misc Addons
import "codemirror/addon/display/placeholder";
import "codemirror/addon/selection/active-line";

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
import "./mode/svelte.js"; // Svelte

import "../../node_modules/codemirror/lib/codemirror.css"; // Default Theme

/**
 * Creates A New CodeMirror Editor
 * @param {String} id Element ID To Put The Editor inside of.
 * @param {Object} object containing editor options
 * @returns
 */
export function CreateEditor(id, editorOpts) {
	if (!editorOpts) {
		editorOpts = {
			theme: "base16-dark",
			indent: {
				size: 4,
				tabs: true
			},
			mode: "javascript",
			extraKeys: {}
		}
	}

	const element = document.getElementById(id);
	var CodeEditor = CodeMirror(element, {
		lineNumbers: true,
		theme: editorOpts.theme,
		indentUnit: editorOpts.indent.size,
		tabSize: editorOpts.indent.size,
		indentWithTabs: editorOpts.indent.tabs,
		placeholder: "your code goes here...",
		mode: editorOpts.mode,
		autofocus: true,
		matchTags: {
			bothTags: true
		},
		autoCloseTags: true,
		autoCloseBrackets: true,
		styleActiveLine: false,
		extraKeys: editorOpts.extraKeys
	})

	CodeEditor?.setSize("100%", "100%");
	SetEditorTheme(undefined, editorOpts.theme);

	return CodeEditor;
}

/**
 * Set Editor Theme
 * @param {Object} editor CodeMirror Instance
 * @param {String} theme Theme To Set To
 */
export function SetEditorTheme(editor, theme) {
	editor?.setOption("theme", theme);
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
	let cmStyleElem = document.getElementById("CodeMirrorFontNSize")

	cmStyleElem.innerText = `
#CodeEditorArea { font-size: ${fontSize}px; }
.CodeMirror { font-family: ${fontFamily}; }
`;

	editor?.refresh();
}

/**
 * Set CodeMirror Instance Active
 * @param {Object} editor CodeMirror Instance
 * @returns {null}
*/
export function SetEditorActive(editor) {
	document.querySelectorAll(".CM_ACTIVE_EDITOR").forEach(elem => {
		elem.classList.remove("CM_ACTIVE_EDITOR");
	})

	let wrapper = editor.getWrapperElement();
	wrapper.classList.add("CM_ACTIVE_EDITOR");
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
