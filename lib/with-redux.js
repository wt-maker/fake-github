import React from 'react'
import initializeStore from '../store/store'

const getOrCreateStore = (initialState) => {
    return initializeStore(initialState)
}

const CreateReduxApp = (Comp) => {
    class WithRedux extends React.Component {
        constructor(props) {
            super(props)
            this.reduxStore = getOrCreateStore(this.props.initialState)
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

        //reduxStore = getOrCreateStore({user:{id:'001'}})
        reduxStore = getOrCreateStore()
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