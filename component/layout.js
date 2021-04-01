import { useState } from 'react'
import Link from 'next/link'
import { Layout, Input, Dropdown, Avatar, Menu, Tooltip } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
const { Header, Content, Footer } = Layout
const { Search } = Input

const iconStyle = {
    color: '#FFFFFF',
    fontSize: '40px'
}

const MyLayout = ({children}) => {

    const isLogin = false

    const [search, setSearch] = useState()

    const handleOnSearch = () => {
        console.log("search")
    }

    const handleOnChange = (e) => {
        console.log(e.target.value)
        setSearch(e.target.value)
    }

    const handleLogout = () => {

    }

    const userDropDown = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a onClick={handleLogout}>登 出</a>
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
                {children}
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
                    align-items: center;
                }
                .logo {
                    height: 45px;
                    margin-left: 40px;
                    margin-right:40px;
                }
                .search{
                    height: 32px;
                }
                .header-right {
                    margin-right:40px;
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