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

const PaymentErrorModal = ({ open, onClose, errorMessage }) => {
  // Default error message if none provided
  const defaultErrorMessage = 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ của MISA.';
  
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
                onClick={() => {
                  // Here you would implement retry logic
                  console.log('Retrying payment');
                  onClose();
                }}
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

  const [errorMessage, setErrorMessage] = React.useState(
    'Đã xảy ra lỗi kết nối với cổng thanh toán. Vui lòng kiểm tra kết nối internet và thử lại.'
  );
  
  
  const handleClose = () => {
    setOpen(false);
    // Additional actions after closing could go here
  };

  
  return (
    <PaymentErrorModal 
      open={open} 
      onClose={handleClose} 
      errorMessage={errorMessage}
    />
  );
};

export default PaymentError;