const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_BASE_URL = 'https://api.github.com'
const GITHUB_REQUEST_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_GET_USER_URL = 'https://api.github.com/user'
const scope = 'user'
const client_id = 'b3f24c301f5430cc1bf2'
const client_secret = '00aa02c7efadb1211df9156cb59b69dfbe4eb622'

// https://github.com/login/oauth/authorize?client_id=b3f24c301f5430cc1bf2&scope=user,public_repo
// code e2540157beef52dc8149

/** 
 * github oauth登录页面
 * https://github.com/login/oauth/authorize?client_id=b3f24c301f5430cc1bf2&scope=user,public_repo
 * 
 * 重定向到Authorization callback URL
 * http://10.167.21.118/personal/cn/user/login?code=dbc392017a85742386a8
 * 
 * 需要得到code，code只可使用一次，过后失效
{
    "error": "bad_verification_code",
    "error_description": "The code passed is incorrect or expired.",
    "error_uri": "https://docs.github.com/apps/managing-oauth-apps/troubleshooting-oauth-app-access-token-request-errors/#bad-verification-code"
}
 * 获得token
 * https://github.com/login/oauth/access_token?client_id=b3f24c301f5430cc1bf2&client_secret=00aa02c7efadb1211df9156cb59b69dfbe4eb622&code=dbc392017a85742386a8
 * 
{
"access_token": "f241212558d03e6c6da7a0b13940dce9fe2122a4",
"token_type": "bearer",
"scope": "public_repo,user"
}
 * 获得用户信息
 * https://api.github.com/user
 * headers
 * Authorization bearer f241212558d03e6c6da7a0b13940dce9fe2122a4
*/

module.exports = {
    github: {
        github_base_url: GITHUB_BASE_URL,
        github_request_token_url: GITHUB_REQUEST_TOKEN_URL,
        github_oauth_url: GITHUB_OAUTH_URL,
        github_get_user_url: GITHUB_GET_USER_URL,
        client_id,
        client_secret,
        oauth_url: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${scope}`
    },
    redis: {
        port: 0,
        password: 0
    }
}