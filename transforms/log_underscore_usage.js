var _ = require('lodash')
var hasUnderscoreRequire = require('./utils/has_underscore_require.js')

module.exports.parser = 'recast'

module.exports = function findUsedUnderscoreMethods (file, api) {
    const j = api.jscodeshift
    const root = j(file.source)

    if (!hasUnderscoreRequire(root, api)) {
        return null
    }

    // collect underscore methods
    let underscoreMethods = []

    root
        .find(j.CallExpression, {
            callee: {
                object: {
                    name: '_',
                },
            },
        })
        .forEach(path => {
            var property = path.value.callee.property
            if (property.type === 'Identifier') {
                underscoreMethods.push(property.name)
            } else if (property.type === 'ConditionalExpression') {
                underscoreMethods.push(property.alternate.value)
                underscoreMethods.push(property.consequent.value)
            } else {
                console.log(property.type)
                throw Error('Unknown usage')
            }
        })

    underscoreMethods = _.uniq(underscoreMethods)

    console.log({
        path: file.path,
        underscoreMethods: underscoreMethods,
        methodsWithoutMapping: _.difference(underscoreMethods, Object.keys(_)),
    })

    return null
}
