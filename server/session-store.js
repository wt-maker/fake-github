const getRedisSessionId = sid => `ssid:${sid}`

/**
 * redis管理
 */
class RedisSessionStore {
    constructor(redisClient) {
        this.redisClient = redisClient
    }

    /**
     * 
     * @param {参数id} sid 
     * @param {session值} sess 
     * @param {过期时间} ttl `.
     * 
     */
    async set(sid, sess, ttl) {
        const id = getRedisSessionId(sid)
        if (typeof ttl == 'number') {
            ttl = Math.cell(ttl / 1000)
        }
        try {
            const sessStr = JSON.stringify(sess)

            if (ttl) {
                await this.redisClient.setex(id, ttl, sessStr)
            } else {
                await this.redisClient.set(id, sessStr)
            }
        } catch(error) {
            console.log(error)
        }
    }

    /**
     * 
     * @param {参数id} sid 
     */
    async get(sid) {
        const id = getRedisSessionId(sid)
        const sessData = await this.redisClient.get(id)
        if (!sessData) {
            return null
        }
        try {
            const result = JSON.parse(sessData)
            return result
        } catch(error) {
            console.log(error)
        }
    }

    /**
     * 
     * @param {参数id} sid 
     */
    async destory(sid) {
        const id = getRedisSessionId(sid)
        try {
            await this.redisClient.del(id)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = RedisSessionStore