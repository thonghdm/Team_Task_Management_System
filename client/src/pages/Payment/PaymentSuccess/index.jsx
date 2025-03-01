import React from 'react';
import PaymentSuccessModal from '~/Components/PaymentSuccessModal';
import { useNavigate } from 'react-router-dom';

// Example usage
const PaymentSuccess = () => {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/board/home/1');
    setOpen(false);
    // Additional actions after closing could go here
  };

  return (
    <PaymentSuccessModal open={open} onClose={handleClose} titile={"Thanh toán thành công"} message={"Đơn hàng của quý khách đã thanh toán thành công. MISA sẽ sớmliên hệ với quý khách sớm để bàn giao sản phẩm, dịch vụ."} />
  );
};

export default PaymentSuccess;