import App from 'next/app'
import React from 'react'
import Layout from '../component/layout'
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
    const {Component, pageProps} = this.props
    return (
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    )
  }
}

export default MyApp