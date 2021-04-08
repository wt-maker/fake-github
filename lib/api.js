const axios = require('axios')
const config = require('../config')
//判断服务端还是客户端
const isServer = typeof window === 'undefined'

async function requestGithub(method, url, data, headers) {
    return await axios({
        url: `${config.github.github_base_url}${url}`,
        method,
        data,
        headers
    })
}

// req 和 res只有在服务端渲染时才能拿到
async function request({method='GET', url, data={}}, req, res) {
    if (!url) {
        throw Error('url is must provide')
    }
    if (isServer) {
        const session = req.session
        const githubAuth = session.githubAuth || {}
        const headers = {}
        if (githubAuth.access_token) {
            headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        return await requestGithub(method, url, data, headers)
    } else {
        return await axios({
            url: `/github${url}`,
            method,
            data
        })
    }

}

module.exports = {
    request,
    requestGithub
}
