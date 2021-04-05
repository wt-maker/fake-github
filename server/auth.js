const axios = require('axios')
const config = require('../config')
const { client_id, client_secret, github_request_token_url, github_get_user_url} = config.github

module.exports = (server) => {
    server.use( async(ctx, next) => {
        if (ctx.path === '/auth') {
            const code = ctx.query.code
            if (!code) {
                ctx.body = 'code not exist'
                return
            }

            const result = await axios({
                methods: 'POST',
                data: {
                    client_id,
                    client_secret,
                    code
                },
                url: github_request_token_url,
                headers: {
                    Accept:'application/json'
                }
            })

            if(result.status == 200 && (result.data && !result.data.error)) {
                const {access_token, token_type} = result.data
                const userInfoResponse = await axios({
                    methods: 'GET',
                    url: github_get_user_url,
                    headers: {
                        'Authorization': `${token_type} ${access_token}`
                    }
                })
                ctx.session.githubAuth = result.data
                ctx.session.userInfo = userInfoResponse.data
                // 跳转到登录按钮点击前页面
                ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) ? ctx.session.urlBeforeOAuth : '/')
                if (ctx.session) {
                    ctx.session.urlBeforeOAuth = ''
                }
            } else {
                // 获取token失败
                const errMsg = result.data && result.data.error
                ctx.body = `request token failed ${errMsg}`
            }

        } else {
            await next()
        }
    })

    server.use(async (ctx, next) => {
        const {path, method} = ctx
        if (path == '/logout' && method == 'POST') {
            console.log('logout')
            ctx.session = null
            ctx.body = 'logout success'
        } else {
            await next()
        }
    })

    server.use( async (ctx, next) => {
        const { path, method } = ctx
        if (path === '/prepare-auth' && method === 'GET') {
            const { url } = ctx.query
            // 记录登录按钮点击钱页面
            ctx.session.urlBeforeOAuth = url
            ctx.redirect(`${config.github.oauth_url}`)
        } else {
            await next()
        }
    })
}