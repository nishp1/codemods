module.exports = function hasUnderscoreRequire (root, api) {
    const j = api.jscodeshift
    let doesRequireUnderscore = false

    root
        .find(j.CallExpression, {
            callee: {
                type: 'Identifier',
                name: 'require',
            },
        })
        .forEach(path => {
            var firstArg = path.value.arguments[0]

            // check for require('underscore')
            doesRequireUnderscore = doesRequireUnderscore || (firstArg.type === 'Literal' && firstArg.value === 'underscore')
        })

    return doesRequireUnderscore
}
