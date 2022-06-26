// Original Author - Juan Gomez
// Modified Mime & Imports.
// https://github.com/autumn-ted/mode-svelte

(function (mod) {
	"use strict";
	if (typeof exports === "object" && typeof module === "object") {// CommonJS
		mod(require("codemirror"),
				require("codemirror/addon/mode/overlay"),
				require("codemirror/mode/xml/xml"),
				require("codemirror/mode/javascript/javascript"),
				require("codemirror/mode/css/css"));
	} else if (typeof define === "function" && define.amd) { // AMD
		define(["codemirror",
						"codemirror/addon/mode/overlay",
						"codemirror/mode/xml/xml",
						"codemirror/mode/javascript/javascript",
						"codemirror/mode/css/css"], mod);
	} else { // Plain browser env
		mod(CodeMirror);
	}
})(function (CodeMirror) {
	CodeMirror.defineMode("svelte", function (config, parserConfig) {
		var mustacheOverlay = {
			token: function (stream) {
				if (stream.match(/^\{.*?\}/)) return "meta mustache";
				while (stream.next() && !stream.match("{", false)) {}
				return null;
			}
		};
		return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), mustacheOverlay);
	});

	CodeMirror.defineMode("svelte", function (config) {
		return CodeMirror.getMode(config, {name: "htmlmixed"});
	}, "htmlmixed", "xml", "javascript", "css");

	CodeMirror.defineMIME("text/x-svelte", "svelte");
});
