import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { Button } from 'antd'

const Index = ({isLogin}) => {

  if (isLogin == false) {
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
}

Index.getInitialProps = async({ctx, reduxStore}) => {
  let user = reduxStore.getState().user
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }
  return {
    isLogin: true
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(Index)