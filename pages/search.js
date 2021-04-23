import { useEffect } from 'react'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'
import Repo from '../component/Repo'
import { request } from '../lib/api'
import { withRouter } from 'next/router'
import { isValidElement, memo } from 'react'
import { cacheArray } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'

const per_page = 10
const LANGUAGE = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Python']
const SORT_TYPE = [
    {
        name: 'Best Match'
    },
    {
        name: 'Most Stars',
        value: 'stars',
        order: 'desc' // 降序
    },
    {
        name: 'Fewest Stars',
        value: 'stars',
        order: 'asc'
    },
    {
        name: 'Most Forks',
        value: 'forks',
        order: 'desc'
    },
    {
        name: 'Fewest Forks',
        value: 'forks',
        order: 'asc'
    }
]

const selectedStyle = {
    boderLeft: '2px solid #e36209',
    fontWeight: 'bold'
}

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
    let queryString = `?query=${query}`
    if (lang) queryString += `&lang=${lang}`
    if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
    if (page) queryString += `&page=${page}`
    queryString += `&per_page=${per_page}`

    return (
        <Link href={`/search${queryString}`}>
            {isValidElement(name)?name: <a>{name}</a>}
        </Link>
    )
})

const Search = ({ repos, router }) => {
    const { lang, sort, order, page } = router.query

    useEffect(() => {
        !isServer && cacheArray(repos.item)
    }, [])

    return (
        <div className="root">
            <Row gutter={20}>
                <Col span="4">
                    <List
                        bordered
                        header={<span className="list-header">语言</span>}
                        style={{ marginBottom: 20 }}
                        dataSource={LANGUAGE}
                        renderItem={
                            item => {
                                const selected = lang === item
                                return (
                                    <List.Item style={selected? selectedStyle : null}>
                                        {selected? (
                                            <span>{item}</span>
                                        ): (
                                            <FilterLink {...router.query} name={item} lang={item}></FilterLink>
                                        )}
                                    </List.Item>
                                )
                            }
                        }
                    >
                    </List>
                    <List
                        bordered
                        header={<span className="list-header">排序</span>}
                        style={{ marginBottom: 20 }}
                        dataSource={SORT_TYPE}
                        renderItem={
                            item => {
                                let selected = false
                                if (item.name === 'Best Match' && !sort) {
                                    selected = true
                                } else if (item.value === sort && item.order === order ) {
                                    selected = true
                                }
                                return (
                                    <List.Item>
                                        {selected? (
                                            <span>{item.name}</span>
                                        ): (
                                            <FilterLink {...router.query} name={item.name} sort={item.value} order={item.order}></FilterLink>
                                        )}
                                    </List.Item>
                                )
                            }
                        }
                    >
                    </List>
                </Col>
                <Col span="20">
                    <h2 className="repos-title">{repos.total_count}个仓库</h2>
                    {repos.items.map(repo => <Repo repo={repo} key={repo.id}></Repo>)}
                </Col>
                <div className="pagination">
                    <Pagination
                        pageSize={per_page}
                        current={Number(page) || 1}
                        total={1000}
                        onChange={()=>{}}
                        itemRender={(page, type, originalElement) => {
                            const p = type === 'page' ? page : (type === 'prev' ? page - 1 : page + 1)
                            const name = type === 'page' ? page : originalElement
                            return <FilterLink {...router.query} page={p} name={name}></FilterLink>
                        }}
                    />
                </div>
            </Row>
            <style jsx>{`
                .root {
                    padding: 20px 20px;
                }
                .list-header {
                    font-weight: 800;
                    font-size: 16px;
                }
                .repos-title {
                    border-bottom: 1px solid #eee;
                    font-size: 24px;
                    line-height: 50px;
                }
                .pagination {
                    width: 100%;
                    display: flex;
                    flex-direction: row-reverse;
                    padding: 20px;
                    text-align: center;
                }
            `}</style>
        </div>
    )
}

Search.getInitialProps = async ({ ctx }) => {
    const { query, sort, lang, order, page} = ctx.query
    if (!query) {
        return {
            repos: {
                totalCount: 0
            }
        }
    }
    let queryString = `?q=${query}`
    if (lang) queryString += `+language:${lang}`
    if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
    if (page) queryString += `&page=${page}`
    queryString += `&per_page=${per_page}`
    const searchRepos = await request(
        { url: `/search/repositories${queryString}` },
        ctx.req,
        ctx.res
    )
    return {
        repos: searchRepos.data
    }
}

export default withRouter(Search)