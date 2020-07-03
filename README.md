# koa-verification

## 安装

`koa-verification` **requires node 8** or above.

```
npm install -S koa-verification
```

## 快速开始

```
const app = new Koa();
const {
    Rule,
    Position,
    Verification
} = require('koa-verification')


const v = new Verification();

let pathRule = new Rule({
    position: Position.query,
    name: 'id',
    rule: [
        {
            fn: 'isInt',
            msg: '必须是整形数'
        },
        {
            fn: 'isLength',
            options:{
                min: 2,
                max: 10
            },
            msg: '长度必须在2到10之间'
        }
    ]

})

pathRule.add({
    position: Position.body,
    name: 'name',
    rule: {
        fn: 'isEmpty',
        antonym: true, //让规则验证结果取反
        msg: 'name不能为空'
    }
})

pathRule.add({
    position: 'body',
    name: 'sex',
})

v.use('/path', pathRule)
 
app.use(v.verifications());
app.listen(3000);
```

koa-verification 是基于koa2的一个中间件，它是为了那些需要严格规范接口参数的api所设计的。



当你需要为一个接口验证参数时，如 '/path'接口，你可以声明一个验证器：

`v.use('/path', pathRule)`

其中 pathRule是你这个接口的参数校验规则，你可以这样声明

`let pathRule = new Rule(opt)`

最后  

`app.use(v.verifications())`



## 要点

- `Rule`

  Rule中的opt有3个参数，分别是  position, name 和 rule

  1. `positon`

     `posion` 代表了参数所在的位置  $详情请参考Position$

  2. `name`   

     `name` 表示该参数的名字

  3. `rule`

     `rule` 表示该参数的校验规则，每一个`rule`对象有4个属性：`fn`，`options`，`antonym`， `msg`

     其中 `fn`表示的是验证的函数， 验证函数分为2中，一种是自己创建的验证函数，一种是基于[validator](https://www.npmjs.com/package/validator) 包的验证函数，当你想要用validator包的验证函数时，只需要传入对应函数的字符串名字。如你想使用validator包下的 `isInt` 函数，只需要  `fn : 'isInt'` 就能使用。

     `options` 属性 表示传入验证函数中的参数

     `antonym` 属性 表示时候对验证函数的结果取反。之所以设计这个属性，是因为有些验证函数如[validator](https://www.npmjs.com/package/validator) 包下的`isEmpty`，当参数为空时它的结果为true，当你希望你的参数不为空时，你只需要把`antonym` 属性设为 true即可。默认情况为false

     `msg `  属性表示参数验证失败时的错误提示信息

     

     当不设置 rule属性时，代表该参数不需要验证。当你需要添加其他参数的验证信息时，只需要调用

     `Rule.add(opt)` 函数。

     

     

- Position

  body:   代表requestBody的参数

  query

  header

  params

- ctx.v

  当参数验证都通过时，会在ctx.v上挂载验证过的参数

  