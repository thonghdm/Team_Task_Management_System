import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "~/redux/features/auth/authSlice";

const LoginSuccess = () => {
  const { userId, tokenLogin } = useParams();
  const dispatch = useDispatch();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (userId && tokenLogin) {
        await dispatch(loginSuccess({ id: userId, tokenLogin })).unwrap();
      }
    };
    fetchData();
  }, [dispatch, userId, tokenLogin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <Navigate to="/board/home" replace={true} />
      ) : (
        <h3>Yêu cầu bạn hãy đăng nhập</h3>
      )}
    </div>
  );
};

export default LoginSuccess;
