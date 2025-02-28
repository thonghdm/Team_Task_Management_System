import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme with green success color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // dark blue for button
    },
    success: {
      main: '#34d399', // green for success icon
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

const PaymentSuccessModal = ({ open, onClose, titile, message }) => {
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
                backgroundColor: 'success.main',
                color: 'white',
                width: 80,
                height: 80,
                mb: 3,
                '&:hover': {
                  backgroundColor: 'success.main',
                },
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>

            <Typography
              variant="h5"
              component="h2"
              color="success.main"
              fontWeight="bold"
              gutterBottom
            >
              {titile}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: '90%', mx: 'auto', lineHeight: 1.6 }}
            >
              {message}
            </Typography>

            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                minWidth: '120px',
                py: 1,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 'medium',
                backgroundColor: 'primary.main',
              }}
            >
              Đóng
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default PaymentSuccessModal;