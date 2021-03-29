import { useState } from 'react'
import Link from 'next/link'
import { Layout, Input, Dropdown, Avatar, Menu, Tooltip } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
const { Header, Content, Footer } = Layout
const { Search } = Input

const iconStyle = {
    color: '#FFFFFF',
    fontSize: '30px',
    display: 'block',
    marginLeft: '20px',
    paddingTop: '15px'
}

const MyLayout = () => {

    const isLogin = false

    const [search, setSearch] = useState()

    const handleOnSearch = () => {
        console.log("search")
    }

    const handleOnChange = (e) => {
        console.log(e.target.value)
        setSearch(e.target.value)
    }

    const userDropDown = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a onClick={handleloginout}>登 出</a>
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <Layout>
            <Header>
                <div className="header-inner">
                    <div className="header-left">
                        <div className="logo">
                            <Link href="/">
                                <a><GithubOutlined style={iconStyle} /></a>
                            </Link>
                        </div>
                        <div className="search">
                            <Search
                                value={search}
                                placeholder="请输入搜索内容"
                                onSearch={handleOnSearch}
                                onChange={handleOnChange}
                            >
                            </Search>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {isLogin ? (
                                <Dropdown overlay={userDropDown}>
                                    <a href="/">
                                        <Avatar size={40} src="https://avatars.githubusercontent.com/u/52414106"></Avatar>
                                    </a>
                                </Dropdown>
                            ) : (
                                    <Tooltip>
                                        <a href="/">
                                            <Avatar size={40} icon="user"></Avatar>
                                        </a>
                                    </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </Header>

            <Content>

            </Content>

            <Footer>
                footer
            </Footer>
            <style jsx>{`
                .header-inner {
                    display: flex;
                    justify-content: space-between;
                }
                .header-left {
                    display: flex;
                }
                .search {
                    padding-top: 15px;
                }
                .header-right {
                    margin-right: 20px;
                }
            `}</style>
            <style jsx global>
                {`
					#__next {
						height: 100%;
					}
					.ant-layout {
						min-height: 100%;
					}
					.ant-layout-header {
						padding-left: 0;
						padding-right: 0;
					}
					.ant-layout-content {
						background: #fff;
					}
				`}
            </style>
        </Layout >
    )
}

export default MyLayout