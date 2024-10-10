import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Oops! Something went wrong.</h1>
        <p>It seems you've reached this page in error.</p>
        <button style={{ cursor: "pointer" }} onClick={() => navigate("/sign-in")}>Back To Home</button>
      </div>
    </>
  )
}

export default Error