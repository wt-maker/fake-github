import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import Layout from '../component/layout'
import WithRedux from '../lib/with-redux'
import 'antd/dist/antd.css'

class MyApp extends App {
  static async getInitialProps (ctx) {
    let { Component } = ctx
    let pageProps = {}
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    } 
    return { pageProps }
  }

  render() {
    const {Component, pageProps, reduxStore} = this.props
    //console.log(reduxStore.getState())
    return (
      <Provider store={reduxStore}>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </Provider>
    )
  }
}

export default WithRedux(MyApp)