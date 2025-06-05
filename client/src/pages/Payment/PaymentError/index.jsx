import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '~/apis/Project/subscriptionApi'
import { useSelector } from "react-redux";

// Create a custom theme with error color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // dark blue for button
    },
    error: {
      main: '#ef4444', // red for error icon
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const PaymentErrorModal = ({ open, onClose, errorMessage, onRetry }) => {
  // Default error message if none provided
  const defaultErrorMessage = 'An error occurred during payment. Please try again later or contact MISA support.';

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
            maxWidth: '500px',
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối nhẹ
            backdropFilter: 'blur(5px)', // Hiệu ứng mờ
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 2,
            }}
          >
            <IconButton
              disableRipple
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                width: 80,
                height: 80,
                mb: 3,
                '&:hover': {
                  backgroundColor: 'error.main',
                },
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 40 }} />
            </IconButton>

            <Typography
              variant="h5"
              component="h2"
              color="error.main"
              fontWeight="bold"
              gutterBottom
            >
              Thanh toán thất bại
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: '90%', mx: 'auto', lineHeight: 1.6 }}
            >
              {errorMessage || defaultErrorMessage}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  minWidth: '120px',
                  py: 1,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }}
              >
                Đóng
              </Button>

              <Button
                variant="contained"
                onClick={onRetry}
                sx={{
                  minWidth: '120px',
                  py: 1,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  backgroundColor: 'primary.main',
                }}
              >
                Thử lại
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

// Example usage
const PaymentError = () => {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const { accesstoken, userData } = useSelector(state => state.auth);

  const [errorMessage, setErrorMessage] = React.useState(
    'There was an error connecting to the payment gateway. Please check your internet connection and try again..'
  );


  const handleClose = () => {
    navigate('/board/home/1');
    setOpen(false);
    // Additional actions after closing could go here
  };

  const retryPayment = async () => {
    const savedData = localStorage.getItem('pendingSubscription');
    if (!savedData) {
      console.error("No pending subscription found.");
      return;
    }

    const data = JSON.parse(savedData);

    try {
      const response = await createCheckoutSession(accesstoken, data);
      if (response) {
        window.location.href = response;
      }
    } catch (error) {
      console.error("Error retrying payment:", error.message);
    }
  };


  return (
    <PaymentErrorModal
      open={open}
      onClose={handleClose}
      onRetry={retryPayment}
      errorMessage={errorMessage}
    />
  );
};

export default PaymentError;