import { request } from '../../lib/api'
import WithRepoBasic from '../../component/WithRepoBasic'
import dynamic from 'next/dynamic'

const MarkdownRenderer = dynamic(() => import('../../component/MarkdownRenderer'),{
    loading: ()=> (<p>Loading</p>)
}) 
const Detail = ({ readme }) => {
    return (
        <MarkdownRenderer content={readme.content} isBase64={readme.encoding==='base64'}/>
    )
}


Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res } }) => {

    const readmeRes = await request(
        { url: `/repos/${owner}/${name}/readme` },
        req,
        res
    )

    return {
        readme: readmeRes.data
    }
}

export default WithRepoBasic(Detail)