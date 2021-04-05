import React from 'react'
import initializeStore from '../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

const getOrCreateStore = (initialState) => {
    if(isServer) {
        return initializeStore(initialState)
    }
    if(!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}

const CreateReduxApp = (Comp) => {
    class WithRedux extends React.Component {
        constructor(props) {
            super(props)
            this.reduxStore = getOrCreateStore(props.initialState)
        }

        render() {
            const { Component, pageProps, ...rest } = this.props

            if (pageProps) {
                pageProps.hoc = 'hoc'
            }
            return (
                <Comp reduxStore={this.reduxStore} {...rest} Component={Component} pageProps={pageProps}></Comp>
            )
        }

    }

    WithRedux.getInitialProps = async(ctx) => {
        let reduxStore

        if (isServer) {
            const { req } = ctx.ctx
            const session = req.session
            if (session && session.userInfo) {
                reduxStore = getOrCreateStore({
                    user: session.userInfo
                })
            } else {
                reduxStore = getOrCreateStore()
            }
        } else {
            reduxStore = getOrCreateStore()
        }

        ctx.reduxStore = reduxStore

        let pageProps = {}
        if (typeof Comp.getInitialProps == 'function') {
            pageProps = await Comp.getInitialProps(ctx)
        }
        return {
            ...pageProps,
            initialState: reduxStore.getState()
        }
    }

    return WithRedux
}

export default CreateReduxApp