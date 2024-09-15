import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetOne } from '~/apis/User/userService'

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoggedIn, token } = useSelector(state => state.auth)
    const [userData, setUserData] = useState({})

    useEffect(() => {
        const fetchUser = async () => {
            let response = await apiGetOne(token)
            console.log(response);
            if (response?.data.err === 0) {
                setUserData(response.data?.response)
            } else {
                setUserData({})
            }
        }
        fetchUser()
    }, [isLoggedIn])

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
                <h4>{userData?.displayName}</h4>
                <h4>{userData?.email}</h4>
                {userData?.image && <img src={userData?.image} alt="avatar" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />}
            </div>

        </div>
    )
}

export default Home