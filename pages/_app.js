import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import Layout from '../component/Layout'
import WithRedux from '../lib/with-redux'
import 'antd/dist/antd.css'
import Router from 'next/router'
import PageLoading from '../component/PageLoading'

class MyApp extends App {
  static async getInitialProps (ctx) {
    let { Component } = ctx
    let pageProps = {}
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    } 
    return { pageProps }
  }

  state = {
    loading: false
  }

  startLoading = () => {
    this.setState({
      loading: true
    })
  }

  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeError', this.stopLoading)
  }
  
  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading)
    Router.events.off('routeChangeComplete', this.stopLoading)
    Router.events.off('routeChangeError', this.stopLoading)
  }

  render() {
    const {Component, pageProps, reduxStore} = this.props

    return (
      <Provider store={reduxStore}>
        {this.state.loading ? <PageLoading /> : null}
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </Provider>
    )
  }
}

export default WithRedux(MyApp)