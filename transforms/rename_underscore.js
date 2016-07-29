var hasUnderscoreRequire = require('./utils/has_underscore_require.js')

module.exports = function renameUnderscore (file, api) {
    const j = api.jscodeshift
    const root = j(file.source)

    if (!hasUnderscoreRequire(root, api)) {
        return null
    }

    return root.find(j.Identifier, {
        name: '_',
    }).replaceWith(function () {
        return j.identifier('_underscore')
    }).toSource()
}
