(function(mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		mod(require("codemirror"));
	else if (typeof define == "function" && define.amd) // AMD
		define(["codemirror"], mod);
	else // Plain browser env
		mod(CodeMirror);
})(function(CodeMirror) {
	"use strict";

	var keywords = ["define", "endef", "undefine", "ifdef", "ifndef", "ifeq",
		"ifneq", "else", "endif", "include", "-include", "sinclude",
		"override", "export", "unexport", "private", "vpath"];
	var keywordsRegex = new RegExp("\\b((" + keywords.join(")|(") + "))");

	var operators = ["=", ":=", "::=", "\\+=", "\\?=", ":"];
	var operatorsRegex = new RegExp("((" + operators.join(")|(") + "))");

	var automaticVariables = ["\\$@", "\\$%", "\\$<", "\\$\\?", "\\$\\^",
		"\\$\\+", "\\$\\*"];
	var automaticVariablesRegex = new RegExp(
		"((" + automaticVariables.join(")|(") + "))");

	// Any sequence of characters not containing '#', ':', '='
	var variableNameRegex = /((?![#:=\s]).)*/;
	var usingVariableRegex = new RegExp(
		"\\$(\\((" + variableNameRegex.source + "(,\\s?)?)+" + "\\)|\\{(" +
		variableNameRegex.source + "(, \\s?)?)+" + "\\})");
	var definitionVariableRegex = new RegExp(
		variableNameRegex.source + "\\s*((" + operators.join(")|(") + "))");

	CodeMirror.registerHelper("hintWords", "makefile", keywords);

	CodeMirror.defineMode("makefile", function() {
		return {
			token: function(stream, state) {
				var ch = stream.peek();
				state.escaped = false;

				// Comments
				if (ch === '#') {
					stream.skipToEnd();
					return "comment";
				}
				// Operators
				if (stream.match(operatorsRegex))
					return "operator";
				// Keywords
				if (stream.match(keywordsRegex))
					return "keyword";
				// Using variables
				if (stream.match(usingVariableRegex) ||
						stream.match(automaticVariablesRegex)) {
					return 'variable-2';
				}
				// Variable definition
				if (stream.match(definitionVariableRegex)) {
					stream.backUp(1);
					return "def";
				}

				// nothing found, continue
				state.pairStart = false;
				state.escaped = (ch === '\\');
				stream.next();
				return null;
			},
			startState: function () {
				return {
					pair: false,
					pairStart: false,
					inDefinition: false,
					inInclude: false,
					continueString: false,
					pending: false,
				};
			},
			lineComment: '#',
		};
	});

	CodeMirror.defineMIME("text/x-makefile", "makefile");

});

