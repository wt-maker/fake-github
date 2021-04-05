const { requestGithub } = require('../lib/api')

module.exports = server => {
    server.use( async(ctx, next) => {
        const { path, method } = ctx
        if (path.startsWith('/github/')) {
            const session = ctx.session
            const githubAuth = session && session.githubAuth
            const url = ctx.url.replace(
                '/github/',
                '/'
            )
            const token = githubAuth && githubAuth.access_token
            let headers = {}
            if (token) {
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }

            console.log('服务器转发请求')
            const result = await requestGithub(method, url, ctx.request.body || {}, headers)
            ctx.status = result.status
            ctx.body = result.data
        } else {
            await next()
        }
    })
}