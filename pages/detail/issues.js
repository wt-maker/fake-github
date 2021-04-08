import { useState, useCallback, useEffect } from 'react'
import WithRepoBasic from '../../component/WithRepoBasic'
import { Button, Avatar, Select, Spin } from 'antd'
import { request } from '../../lib/api'
import { getLastUpdated } from '../../lib/utils'
import SearchUser from '../../component/SearchUser'
import dynamic from 'next/dynamic'

const MarkdownRenderer = dynamic(()=>import('../../component/MarkdownRenderer'), {
    loading: ()=><p>Loading</p>
})

const CACHE = {}
const isServer = typeof window === 'undefined'

const IssueDetail = ({ issue }) => {
    return (
        <diV className="root">
            <MarkdownRenderer content={issue.body} />
            <div className="actions">
                <Button href={issue.html_url} target="_blank">
                    打开issue讨论页面
                </Button>
            </div>
            <style jsx>{`
                .root {
                    background: #fafafa;
                }
                .actions {
                    text-align: right;
                }
            `}</style>
        </diV>
    )
}

const Lable = ({ label }) => {
    return (
        <>
            <div className="label" style={{ backgroundColor: `#${label.color}` }}>
                {label.name}
            </div>
            <style jsx>{`
                label {
                    display: inline-block;
                    line-height: 20px;
                    margin-left: 15px;
                    padding: 3px;
                    border-radius: 3px;
                    font-size: 14px;
                }
            `}</style>
        </>
    )
}

const IssueItem = ({ issue }) => {

    const [showDetail, setShowDetail] = useState(false)

    const toogleShowDetail = useCallback(() => {
        setShowDetail(detail => !detail)
    }, [])

    return (
        <div>
            <div className="issue">
                <Button
                    type="primary"
                    size="small"
                    onClick={toogleShowDetail}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                    }}
                >
                    {showDetail ? '隐藏' : '显示'}
                </Button>

                <div className="avatar">
                    <Avatar src={issue.user.avatar_url} shape="square" size={50}></Avatar>
                </div>

                <div className="main-info">
                    <h6>
                        <span>{issue.title}</span>
                        {issue.labels.map(label => <Lable label={label} key={label.id}></Lable>)}
                    </h6>
                    <p className="sub-info">
                        <span>Updated at {getLastUpdated(issue.updated_at)}</span>
                    </p>
                </div>
            </div>
            <style jsx>{`
                .issue {
                    display: flex;
                    position: relative;
                    padding: 10px;
                }
                .issue:hover {
                    background: #fafafa;
                }
                .issue + .issue {
                    border-top: 1px solid #eee;
                }
                .main-info > h6 {
                    max-width: 600px;
                    font-size: 16px;
                    padding-right: 40px;
                }
                .avatar {
                    margin-right: 20px;
                }
                .sub-info {
                    margin-bottom: 0;
                }
                .sub-info > span + spa n {
                    display: inline-block;
                    margin-left: 20px;
                    font-size: 12px;
                }
            `}</style>
            {showDetail ? <IssueDetail issue={issue} /> : null}
        </div>
    )
}

// 获取请求参数
function makeQuery(creator, state, labels) {
    let creatorStr = creator ? `creator=${creator}` : ''
    let stateStr = state ? `state=${state}` : ''
    let labelStr = ''
    if (labels && labels.length) {
        labelStr = `labels=${labels.join(',')}`
    }

    const arr = []

    creatorStr && arr.push(creatorStr)
    stateStr && arr.push(stateStr)
    labelStr && arr.push(labelStr)

    return `?${arr.join('&')}`
}

const Issues = ({ owner, name, issuesData, labelsData }) => {

    const [state, setState] = useState()
    const [label, setLabel] = useState([])
    const [fetching, setFetching] = useState(false)
    const [creator, setCreator] = useState()
    const [issues, setIssues] = useState(issuesData)

    useEffect(() => {
        !isServer && (CACHE[`${owner}/${name}`] = labelsData)
    }, [owner, name, labelsData])

    const handleLabelChange = useCallback((value) => {
        setLabel(value)
    }, [])

    const handleStateChange = useCallback((value) => {
        setState(value)
    }, [])

    const handleCreatorChange = useCallback( value => {
        setCreator(value)
    })

    const handleSearch = useCallback(() => {

        setFetching(true)
        request({url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`}).then(res =>{
            setIssues(res.data)
        }).catch(err => {
            console.log(err)
        }).finally(()=>{
            setFetching(false)
        })
    }, [owner, name, creator, state, label])

    return (
        <div className="root">
            <div className="search">
                <SearchUser onChange={handleCreatorChange} value={creator} />
                <Select
                    placeholder="状态"
                    value={state}
                    onChange={handleStateChange}
                    style={{ width: 200, marginLeft: 20 }}
                >
                    <Select.Option value="all" key="all">all</Select.Option>
                    <Select.Option value="open" key="open">open</Select.Option>
                    <Select.Option value="closed" key="closed">closed</Select.Option>
                </Select>

                <Select
                    mode="multiple"
                    placeholder="Label"
                    value={label}
                    onChange={handleLabelChange}
                    style={{ width: 500, flexGrow: 1, marginLeft: 20, marginRight: 20 }}
                >
                    {
                        labelsData.map(la => (
                            <Select.Option value={la.name} key={la.id}>{la.name}</Select.Option>
                        ))
                    }
                </Select>
                <Button type="primary" onClick={handleSearch} disabled={fetching}>
                    检索
                </Button>
            </div>
            {fetching ? (
                <div className="loading">
                    <Spin />
                </div>
            ) : (
                    <div className="issues">
                        {issues.map(issue => (
                            <IssueItem issue={issue} key={issue.id}></IssueItem>
                        ))}
                    </div>
                )}
            <style jsx>{`
                .issues {
                    border: 1px solid #eee;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    margin-tio: 20px;
                }
                .search {
                    display: flex;
                    margin-bottom: 20px;
                }
                .loading {
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}

Issues.getInitialProps = async (ctx) => {
    let { res, req, query } = ctx.ctx
    let { owner, name } = query

    //issues
    /* const issuesData = await request(
        { url: `/repos/${owner}/${name}/issues` },
        req,
        res
    )
    let labelsData = {data: {}}
    if (CACHE[`${owner}/${name}`]) {
        console.log(CACHE[`${owner}/${name}`])
        console.log('使用缓存')
        labelsData.data = CACHE[`${owner}/${name}`]
    } else {
        console.log('请求数据')
        labelsData = await request(
            { url: `/repos/${owner}/${name}/labels` },
            req,
            res
        )
    } */

    const fetchs = await Promise.all([
        await request(
            { url: `/repos/${owner}/${name}/issues` },
            req,
            res
        ),
        CACHE[`${owner}/${name}`] ? Promise.resolve({data: CACHE[`${owner}/${name}`]}):  await request(
            { url: `/repos/${owner}/${name}/labels` },
            req,
            res
        )
    ])

    const [issuesData, labelsData] = fetchs

    return {
        owner,
        name,
        issuesData: issuesData.data,
        labelsData: labelsData.data
    }
}

export default WithRepoBasic(Issues, 'issues')