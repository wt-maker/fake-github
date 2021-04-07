import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { request } from '../lib/api'

const Option = Select.Option

function SearchUser({ onChange, value }) {

    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])

    const fetchUser = async (value) => {
        setFetching(true)

        if (!value) {
            setFetching(false)
            setOptions([])
            return
        }

        const userData = await request({ url: `/search/users?q=${value}` })
        const data = userData.data.items.map(user => ({
            text: user.login,
            value: user.login
        }))
        setFetching(false)
        setOptions(data)
    }

    return (
        <Select
            style={{width: 200}}
            showSearch={true}
            placeholder="创建者"
            value={value}
            onSearch={fetchUser}
            filterOption={false}
            allowClear={true}
            onSearch={fetchUser}
            notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
        >
            {options.map(op => (
                <Option value={op.value} key={op.value}>
                    {op.text}
                </Option>
            ))}
        </Select>
    )
}

export default SearchUser