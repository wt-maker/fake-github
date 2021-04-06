import { request } from '../../lib/api'
import MarkdownRenderer from '../../component/MarkdownRenderer'
import WithRepoBasic from '../../component/WithRepoBasic'
const { readmeData } = require('./testdata')
const Detail = ({ readme }) => {
    return (
        <MarkdownRenderer content={readme.content} isBase64={readme.encoding==='base64'}/>
    )
}

const fakeReadme = {
    data: readmeData
}

Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res } }) => {

    const readmeRes = await request(
        { url: `/repos/${owner}/${name}/readme` },
        req,
        res
    )
    // const readmeRes = fakeReadme

    return {
        readme: readmeRes.data
    }
}

export default WithRepoBasic(Detail)