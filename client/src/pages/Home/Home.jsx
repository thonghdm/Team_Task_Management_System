import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetOne } from '~/apis/User/userService'

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoggedIn,typeLogin, accesstoken, userData  } = useSelector(state => state.auth)
    const [userDataGG, setUserData] = useState({})
    useEffect(() => {
        const fetchUser = async () => {
            let response = await apiGetOne(accesstoken)
            if (response?.data.err === 0) {
                setUserData(response.data?.response)
            } else {
                setUserData({})
            }
        }
        fetchUser()
    }, [isLoggedIn,accesstoken,typeLogin])

    let data = {}
    if (isLoggedIn) {
        data = typeLogin ? userData : userDataGG
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px' }} >
            <div>
                {isLoggedIn
                    && <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            dispatch(logout())
                            navigate('/')
                        }}
                    >
                        Đăng xuất
                    </button>}

            </div>
            <div>
                <h4>{data?.displayName}</h4>
                <h4>{data?.email}</h4>
                {data?.image && <img src={data?.image} alt="avatar" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />}
            </div>

        </div>
    )
}

export default Home