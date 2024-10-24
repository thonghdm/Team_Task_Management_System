import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRefreshToken } from "~/apis/Auth/authService";
import { loginSuccess, logout } from "~/redux/features/auth/authSlice";

export const useRefreshToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const {
        data: { token, userData },
      } = await apiRefreshToken();

      const result = await dispatch(
        loginSuccess({
          tokenLogin: token,
          id: userData.id,
        })
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return token;
    } catch (refreshError) {
      if (refreshError.response?.status === 403) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        await dispatch(logout());
        navigate("/");
      } else {
        toast.error(
          refreshError.response?.data.message || "Error refreshing token!"
        );
      }
      throw refreshError;
    }
  };

  return refreshToken;
};
