const validator = require('validator')

const position = {
    body: 'body',
    query: 'query',
    params: 'params',
    header: 'header'
}

/**
 * @param path  接口的路径
 * @param rule  参数验证规则
 */
class layer {
    constructor(path, rule) {
        this.path = path;
        this.rule = rule;
    }

    match(path) {
        return path === this.path;
    }

    verify(ctx, rules) {

        let res = {} //验证过的参数
        /** item的属性
         * position  参数存放的位置
         * name 参数的名字
         * rule 参数的验证规则
         */
        rules.rules.forEach(item => {
            let position = ctx
            switch (item.position) {
                case "body":
                    position = ctx.request.body;
                    break;
                case "query":
                    position = ctx.request.query;
                    break;
                case "params":
                    position = ctx.request.path;
                    break;
                case "header":
                    position = ctx.request.header
            }
            let data = position[item.name];
            if (typeof data === 'undefined') {
                throw new Error('传参错误')
            }
            if (item.rule) {//rule 为null时不需要验证
                /** r的属性
                 * fn  验证函数
                 * options fn的参数
                 * msg 错误提示信息
                 */
                item.rule.forEach(r => {
                    if (typeof r.fn === 'string') {
                        r.fn = validator[r.fn]
                    }
                    let antonym = r.antonym || false //规则验证是否取反
                    let flag = !r.fn(data, r.options)
                    if(antonym){
                        flag = r.fn(data, r.options)
                    }
                    if (typeof r.fn !== 'function' || flag ) { //如果fn不是一个函数或者验证函数失败
                        let msg = r.msg || '参数验证错误'
                        throw new Error(item.name + ":" + msg)
                    }
                })

            }
            res[item.name] = data
        })
        ctx['v'] = res //把验证过的参数绑定到v
    }
}

module.exports = {
    position: position,
    layer: layer
}