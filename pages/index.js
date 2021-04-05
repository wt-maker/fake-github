import React, {useEffect} from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { Button, Tabs } from 'antd'
import { request } from '../lib/api'
import Repo from '../component/Repo'
import LRU from 'lru-cache'

import { cacheArray } from '../lib/repo-basic-cache'
const cache = new LRU({
  maxAge: 1000*60*60
})

const isServer = typeof window === 'undefined'

const Index = ({user, userRepos, userStarRepos}) => {

  useEffect(() => {
    if(!isServer) {
      userRepos && cache.set('userRepos', userRepos)
      userStarRepos && cache.set('userStarRepos', userStarRepos)
    }
  }, [userRepos, userStarRepos])

  useEffect(() => {
    if(!isServer) {
      userRepos && cacheArray(userRepos)
      userStarRepos && cacheArray(userStarRepos)
    }
  }, [])

  if (!user || !user.id) {
    return (
      <div className="root">
        <Button type="primary" href={`/prepare-auth`}>点击登录</Button>
        <style jsx>{`
          .root {
            height: 600px;
            display: flex;
            flow-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} className="avatar"></img>
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <span className="location">{user.location}</span>
      </div>
      <div className="user-repos">
        <Tabs>
          <Tabs.TabPane tab="你的仓库" key="1">
            {userRepos.map(repo => {
              return (
                <Repo repo={repo} key={repo.full_name}></Repo>
              )
            })}
            </Tabs.TabPane>
            <Tabs.TabPane tab="关注仓库" key="2">
            {userStarRepos.map(repo => {
              return (
                <Repo repo={repo} key={repo.full_name}></Repo>
              )
            })}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          padding: 20px;
        }
        .user-info {
          width: 300px;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-size: 20px;
          margin-top: 20px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          font-size: 22px;
        }
        .avatar {
          width: 80%;
          border-radius: 50%;
        }
        .location {
          margin-top: 20px;
        }
        .user-repos {
          flex-grow: 1;
        }

      `}</style>
    </div>
  )
}

Index.getInitialProps = async({ctx, reduxStore}) => {
  let user = reduxStore.getState().user
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }
  if(!isServer) {
    console.log('服务端使用缓存')
    if (cache.get('userRepos') && cache.get('userStarRepos')) {
      return {
        userRepos: cache.get('userRepos'),
        userStarRepos: cache.get('userStarRepos')
      }
    }
  }

  console.log('客户端请求数据')

  const userRepos = await request({url: '/user/repos'}, ctx.req, ctx.res)
  const userStarRepos = await request({url: '/user/starred'}, ctx.req, ctx.res)
  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStarRepos: userStarRepos.data
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(Index)