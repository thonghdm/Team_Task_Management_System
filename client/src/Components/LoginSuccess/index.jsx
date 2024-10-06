import React, { useEffect } from 'react'
import { loginSuccess } from '~/redux/actions/authAction'
import { useParams, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const LoginSuccess = () => {
    const { userId, tokenLogin } = useParams()
    const dispatch = useDispatch()
    const { isLoggedIn } = useSelector(state => state.auth)

    useEffect(() => {
        if (userId && tokenLogin) {
            dispatch(loginSuccess(userId, tokenLogin))
        }
    }, [dispatch, userId, tokenLogin]);

    return (
        <div>
            {isLoggedIn ? <Navigate to='/board/home' replace={true} /> : <h3>Yêu cầu bạn hãy đăng nhập</h3>}
        </div>
    )
}

export default LoginSuccess