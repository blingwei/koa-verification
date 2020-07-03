/**
 * position  参数所在的位置
 * name  参数的名字
 * rule  参数验证规则
 * 例子： [
 *           {
 *               fn: 'isLength',
 *               options: {
 *                   min: 2
 *               }
 *           },
 *           {
 *               fn: (data) => data === ' rule'
 *
 *           }
 *      ]
 */

class Rule {
    constructor(opt) {
        this.rules = [];
        if (opt) {
            this.add(opt);
        }
    }

    add(opt) {
        let item = {};
        item.position = opt.position || 'body';
        item.name = opt.name || ''
        if (typeof opt.rule === 'undefined') { //如果没有传入rule，则代表该参数不需要验证
            item.rule = null
        } else {
            //确保rule是个数组
            if (!Array.isArray(opt.rule)) {
                opt.rule = [opt.rule]
            }
            item.rule = opt.rule
        }

        this.rules.push(item)
    }
}

module.exports = Rule