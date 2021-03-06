const Router = require('koa-router')
const mongoose = require('mongoose')
let router =new Router()
router.get('/',async(cxt)=>{
    cxt.body="用户操作首页"
})
router.post('/register',async(ctx)=>{
    const User = mongoose.model('userInfo')
    let newUser = new User(ctx.request.body)

    await newUser.save().then(()=>{
        ctx.body={
            status:1,
            message:'注册成功'
        }
    }).catch(error=>{
        ctx.body={
            status:0,
            message:error
        }
    })
})
router.post('/login',async(ctx)=>{
    let loginUser = ctx.request.body
    console.log(loginUser)
    let userName = loginUser.username
    let password = loginUser.password

    //引入User的model
    const User = mongoose.model('userInfo')

    await User.findOne({username:userName}).exec().then(async(result)=>{
        console.log(result)
        if(result){
            let newUser = new User()
            await newUser.comparePassword(password,result.password)
            .then(isMatch=>{
                if(isMatch){
                    ctx.body={status:1,message:isMatch}
                }else{
                    ctx.body={status:0,message:'用户名或密码不正确'}
                }
                
            })
            .catch(error=>{
                console.log(error)
                ctx.body={status:500,message:error}
            })
        }else{
            ctx.body={status:0,message:'用户名不存在'}
        }
    }).catch(error=>{
        console.log(error)
        ctx.body={code:500,message:error}
    })

})
module.exports = router