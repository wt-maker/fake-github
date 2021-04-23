import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Layout, Input, Dropdown, Avatar, Menu, Tooltip } from 'antd'
import { withRouter } from 'next/router'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { logout } from '../store/store'
import Container from './Container'
const { Header, Content, Footer } = Layout
const { Search } = Input

const iconStyle = {
    color: '#FFFFFF',
    fontSize: '40px'
}

const MyLayout = ({children, user, logout, router}) => {

    let isLogin = false
    if (user && user.id) {
        isLogin = true
    }

    const [search, setSearch] = useState()

    const handleOnSearch = useCallback(() => {
        router.push(`search?query=${search}`)
    }, [search])

    const handleOnChange = useCallback((e) => {
        setSearch(e.target.value)
    }, [])

    const handleLogout = (e) => {
        logout()
        e.preventDefault()
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
                <Container renderer={<div className="header-inner"/>}>
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
                                        <Avatar size={40} src={user.avatar_url}></Avatar>
                                    </a>
                                </Dropdown>
                            ) : (
                                    <Tooltip>
                                        <a href="/">
                                            <Avatar size={40} icon={<UserOutlined />}></Avatar>
                                        </a>
                                    </Tooltip>
                            )}
                        </div>
                    </div>
                </Container>
            </Header>

            <Content>
                {children}
            </Content>

            <Footer>
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
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
const mapReducerToProps = (dispatch) => {
    return {
        logout: ()=>dispatch(logout())
    }
}
export default connect(mapStateToProps, mapReducerToProps)(withRouter(MyLayout))