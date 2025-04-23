import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionByUserId } from '~/apis/Project/subscriptionApi';

// Set locale to Vietnamese
dayjs.locale('vi');

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#303F9F',
    },
    secondary: {
      main: '#F50057',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

const TransactionHistory = () => {
  const { accesstoken, userData } = useSelector(state => state.auth);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (accesstoken && userData?._id) {
      fetchTransactions();
    }
  }, [accesstoken, userData]);

  // Add a new state for original data
  const [allTransactions, setAllTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await getSubscriptionByUserId(accesstoken, userData._id);
      const fetchedTransactions = response?.data?.filter(transaction => 
       transaction.plan_id.price !== 0
      );
      console.log('Fetched transactions:', fetchedTransactions); // Debugging line
      setAllTransactions(fetchedTransactions);
      setTransactions(fetchedTransactions); 
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  const handleSearch = () => {
    const filteredTransactions = allTransactions.filter(transaction => {
      const transactionDate = dayjs(transaction.createdAt);
      return (
        (transactionDate.isAfter(startDate, 'day') || transactionDate.isSame(startDate, 'day')) &&
        (transactionDate.isBefore(endDate, 'day') || transactionDate.isSame(endDate, 'day'))
      );
    });

    setTransactions(filteredTransactions);
  };

  const resetFilters = () => {
    setStartDate(dayjs().subtract(7, 'day'));
    setEndDate(dayjs());
    setTransactions(allTransactions);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={handleBack} color="primary" sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Transaction History
            </Typography>
          </Box>

          <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="From Date"
                    value={startDate}
                    onChange={(newVal) => setStartDate(newVal)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="To Date"
                    value={endDate}
                    onChange={(newVal) => setEndDate(newVal)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{
                      height: '56px',
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={resetFilters}
                    sx={{
                      height: '56px',
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Transactions table */}
          <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(48, 63, 159, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions && transactions.length > 0 ? (
                    transactions.map((item, index) => (
                      <TableRow key={item._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 500 }}>
                          {`- ${item.plan_id.price.toLocaleString()} $`}
                        </TableCell>
                        <TableCell>{`Subscribed to ${item.plan_id.subscription_type} plan`}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No transaction records found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default TransactionHistory;