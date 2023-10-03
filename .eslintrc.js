module.exports = {
	"env": {
		"es6": true,
		"node": true,
		"jest": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"react-hooks",
		"prettier"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double",
			{ "avoidEscape": true }
		],
		"semi": [
			"error",
			"always"
		],
		"prettier/prettier": "error"
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
};
