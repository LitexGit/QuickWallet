module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "react-native/react-native": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
      "indent": [
        "error",
        4
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "always"
    ],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "import/no-extraneous-dependencies":0,
    "import/no-unresolved" : 0,
    "no-console": 0,
    "no-invalid-this": 0,
    "react/jsx-no-bind": 0,
    "react/jsx-handler-names":0,
    "class-methods-use-literals": 0,
    "class-methods-use-this":0,
    "react-native/no-color-literals": 0,
    "react/react-in-jsx-scope":0,
    "react/display-name":0,
    "react/prop-types":0,
    "import/default":0,
    'react/no-deprecated':0,
    "no-extra-boolean-cast":0,
    "no-debugger":0,
    "react/no-multi-comp": 0
    }
};
