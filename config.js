const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_BASE_URL = 'https://api.github.com'
const GITHUB_REQUEST_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const scope = 'user'
const client_id = ''
const client_secret_key = ''

module.exports = {
    github: {
        github_base_url: GITHUB_BASE_URL,
        github_request_token_url: GITHUB_REQUEST_TOKEN_URL,
        github_oauth_url: GITHUB_OAUTH_URL,
        client_id,
        client_secret_key,
        oauth_url: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${scope}`
    },
    redis: {
        port: 0,
        password: 0
    }
}