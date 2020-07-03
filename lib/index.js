const Rule = require('./rule')
const {
    position,
    layer
} = require('./layer')


class verification {
    constructor() {
        this.layer = []; //存放验证器
    }

    use(path, rule) {
        if (typeof path !== 'string') {
            throw new TypeError('path must be a string but a' + typeof path);
        }
        if (!rule instanceof Rule) {
            throw new TypeError('rule must be a Rule');
        }

        this.layer.push(new layer(path, rule))

    }


    verifications() {
        let v = this
        return async function verify(ctx, next) {
            let handles = v.layer.filter(layer => layer.match(ctx.path))
            handles.forEach(layer => {
                layer.verify(ctx, layer.rule)
            })
            await next()
        }
    }


}

module.exports = {
    Position: position,
    Layer: layer,
    Rule: Rule,
    Verification: verification
}
