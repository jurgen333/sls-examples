module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        'jest/globals': true
    },
    extends: [
        'airbnb-base',
        'plugin:jest/recommended'
    ],
    plugins: [
        'eslint-plugin-jest'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 11,
    },
    rules: {
        "no-console" : "off",
        semi: [2, 'never'],
        'no-shadow': 'off',
        // Indent with 4 spaces
        'indent': ['error', 4],
        'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false
        }]
    },
}
