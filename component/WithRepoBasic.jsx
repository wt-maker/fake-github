import { useEffect } from 'react'
import { withRouter } from 'next/router'
import Repo from '../component/Repo'
import { request } from '../lib/api'
import Link from 'next/link'

import {cache, get} from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'

function makeQuery(queryObject) {
    const query = Object.entries(queryObject)
        .reduce((result, entry) => {
            result.push(entry.join('='))
            return result
        }, [])
        .join('&')

    return `?${query}`
}

const WithRepoBasic = (Comp, type = 'index') => {
    const withDetail = ({ basicRepoInfo, router, ...rest }) => {
        
        const query = makeQuery(router.query)

        useEffect(() => {
            !isServer && cache(basicRepoInfo)
        }, [])
        return (
            <div className="root">
                <div className="repo-basic">
                    <Repo repo={basicRepoInfo} ></Repo>
                    <div className="tabs">
                        {type === 'index' ? (
                            <span className="tab index">Readme</span>
                        ) : (
                                <Link href={`/detail${query}`}>
                                    <a className="tab index">Readme</a>
                                </Link>
                            )}
                        {type === 'issues' ? (
                            <span className="tab issues">Issues</span>
                        ) : (
                                <Link href={`/detail/issues${query}`}>
                                    <a className="tab issues">Issues</a>
                                </Link>
                            )}
                    </div>
                </div>
                <div className="custom-info">
                    <div className="custom-area">
                        <Comp {...rest}></Comp>
                    </div>
                </div>
                <style jsx>{`
                    .root {
                        padding-top: 20px;
                    }
                    .repo-basic {
                        padding: 30px;
                        border-radius: 5px;
                        border: 1px solid #e1e4e8;
                        margin-bottom: 20px;
                    }
                    .custom-info {
                        display:flex;
                        justify-content: center;
                    }
                    .custom-area {
                        width: 1200px;
                        border: 1px solid #e1e4e8;
                        border-radius: 6px;
                        padding: 30px;
                    }
                    .tab + .tab {
                        margin-left: 20px;
                    }
                `}</style>
            </div>
        )
    }

    withDetail.getInitialProps = async (ctx) => {
        const query = ctx.ctx.query
        let pageData = {}
        if (Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(ctx)
        }
        const full_name = `${query.owner}/${query.name}`

        if (get(full_name)) {
            return {
                basicRepoInfo: get(full_name),
                ...pageData
            }
        }
        const basicRepoInfo = await request(
            {url: `/repos/${query.owner}/${query.name}`},
            ctx.ctx.req,
            ctx.ctx.res
        )

        return {
            basicRepoInfo: basicRepoInfo.data,
            ...pageData
        }
    }
    return withRouter(withDetail)
}

export default WithRepoBasic