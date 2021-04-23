import { cloneElement } from 'react'
import { render } from 'react-dom'

const style = {
    maxWidh: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
}

const Container = ({ children, renderer=<div/>}) => {
    const newElement = cloneElement(renderer, {
        style: Object.assign({}, renderer.props.style, style),
        children
    })
    return newElement
}

export default Container