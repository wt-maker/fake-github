import { memo, useMemo } from 'react'
import Markdown from 'markdown-it'
import 'github-markdown-css'

const md = new Markdown({
    html: true,
    linkify: true
})
// atob->base64解码
// decodeURIComponent->解决中文乱码
const base64_to_utf8 = (str) => {
    return decodeURIComponent(escape(atob(str)))
}

const MarkdownRenderer = ({content, isBase64}) => {
    const markdownStr = isBase64? base64_to_utf8(content) : content
    const html = useMemo(() => md.render(markdownStr), [markdownStr])
    return (
        <div className="markdown-body">
            <div dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
}

export default memo(MarkdownRenderer)