const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const Redis = require('ioredis')
const session = require('koa-session')
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

const RedisSessionStore = require('./server/session-store')
const redis = new Redis()

const PORT = 3031
app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    const SESSION_CONFIG = {
        key: 'jid',
        maxAge: 20 * 60 * 60 * 1000,
        store: new RedisSessionStore(redis)
    }

    server.use(session(SESSION_CONFIG))

    server.use(async (ctx, next) => {
        // nextjs不仅兼容koa，所以使用原生的response和request对象，
        await handle(ctx.req, ctx.res)
        // respond是koa内置的response处理，如不使用可以设置ctx.responde = false
        ctx.respond = false
    })

    server.listen(PORT, () => {
        console.log(`koa server is listening on PORT ${PORT}`)
    })
})