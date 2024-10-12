import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetOne } from '~/apis/User/userService'
import { apiRefreshToken } from '~/apis/Auth/authService'
import actionTypes from '~/redux/actions/actionTypes'
const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(state => state.auth)
  const [userDataGG, setUserData] = useState({})
  console.log('Home')
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response = await apiGetOne(accesstoken)
        if (response?.data.err === 0) {
          setUserData(response.data?.response)
        } else {
          setUserData({})
        }
      } catch (error) {
        if (error.status === 401) {
          try {
            const response = await apiRefreshToken();
            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              data: { accesstoken: response.data.token, typeLogin: true, userData: response.data.userWithToken }
            })
          }
          catch (error) {
            console.log("error", error);
            if (error.status === 403) {
              alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
              dispatch({
                type: actionTypes.LOGOUT,
              });
              navigate('/');
            }
          }
        } else {
          setUserData({})
          console.log(error.message);
        }

      }
    }
    fetchUser()
  }, [isLoggedIn, accesstoken, typeLogin])



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