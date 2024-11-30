import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import actionTypes from '~/redux/actions/actionTypes';

const Error = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Oops! Something went wrong.</h1>
        <p>It seems you've reached this page in error.</p>
        <button style={{ cursor: "pointer" }} onClick={() => {
          dispatch({
            type: actionTypes.LOGOUT,
          });
          navigate("/sign-in")
        }}>Back To Home</button>
      </div>
    </>
  )
}

export default Error