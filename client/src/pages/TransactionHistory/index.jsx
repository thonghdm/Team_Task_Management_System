import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Configure dayjs to use Vietnamese locale
dayjs.locale('vi');

// Create a custom theme with indigo primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#303F9F', // indigo
    },
    secondary: {
      main: '#F50057',
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

const TransactionHistory = () => {
  // Initial transaction data
  const initialTransactions = [
    {
      id: 1,
      date: '2025/02/23 17:06:19',
      previousBalance: '41,000 VND',
      amount: '-2,000 VND',
      newBalance: '39,000 VND',
      description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
    },
    {
      id: 233,
      date: '2025/02/22 21:41:08',
      previousBalance: '43,000 VND',
      amount: '-2,000 VND',
      newBalance: '41,000 VND',
      description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
    }, {
        id: 12,
        date: '2025/02/23 17:06:19',
        previousBalance: '41,000 VND',
        amount: '-2,000 VND',
        newBalance: '39,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      },
      {
        id: 254,
        date: '2025/02/22 21:41:08',
        previousBalance: '43,000 VND',
        amount: '-2,000 VND',
        newBalance: '41,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      }, {
        id: 145,
        date: '2025/02/23 17:06:19',
        previousBalance: '41,000 VND',
        amount: '-2,000 VND',
        newBalance: '39,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      },
      {
        id: 255,
        date: '2025/02/22 21:41:08',
        previousBalance: '43,000 VND',
        amount: '-2,000 VND',
        newBalance: '41,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      }, {
        id: 18,
        date: '2025/02/23 17:06:19',
        previousBalance: '41,000 VND',
        amount: '-2,000 VND',
        newBalance: '39,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      },
      {
        id: 27,
        date: '2025/02/22 21:41:08',
        previousBalance: '43,000 VND',
        amount: '-2,000 VND',
        newBalance: '41,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      }, {
        id: 16,
        date: '2025/02/23 17:06:19',
        previousBalance: '41,000 VND',
        amount: '-2,000 VND',
        newBalance: '39,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      },
      {
        id: 25,
        date: '2025/02/22 21:41:08',
        previousBalance: '43,000 VND',
        amount: '-2,000 VND',
        newBalance: '41,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      }, {
        id: 13,
        date: '2025/02/23 17:06:19',
        previousBalance: '41,000 VND',
        amount: '-2,000 VND',
        newBalance: '39,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      },
      {
        id: 21,
        date: '2025/02/22 21:41:08',
        previousBalance: '43,000 VND',
        amount: '-2,000 VND',
        newBalance: '41,000 VND',
        description: 'Mua 1 key 1 Giờ dùng trong 1 giờ'
      }
  ];

  // State for search and filters
  const [transactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(dayjs('2025-02-19'));
  const [endDate, setEndDate] = useState(dayjs('2025-02-26'));
  const [transactionType, setTransactionType] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle search function
  const handleSearch = () => {
    console.log('Searching with params:', {
      query: searchQuery,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      transactionType,
      itemsPerPage
    });
    // In a real app, this would filter the transactions based on search criteria
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" fontWeight="bold">
            Lịch Sử Giao Dịch
          </Typography>
          
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Tìm kiếm"
                  placeholder="Nội dung giao dịch..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Từ"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Đến"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Loại giao dịch</InputLabel>
                  <Select
                    value={transactionType}
                    label="Loại giao dịch"
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="deposit">Nạp tiền</MenuItem>
                    <MenuItem value="expense">Chi tiêu</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Hiển thị</InputLabel>
                  <Select
                    value={itemsPerPage}
                    label="Hiển thị"
                    onChange={(e) => setItemsPerPage(e.target.value)}
                  >
                    <MenuItem value={10}>10 / trang</MenuItem>
                    <MenuItem value={20}>20 / trang</MenuItem>
                    <MenuItem value={50}>50 / trang</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={1}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleSearch}
                  sx={{ height: '56px' }}
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                  <TableCell>#</TableCell>
                  <TableCell>Thời gian giao dịch</TableCell>
                  <TableCell>Số dư trước</TableCell>
                  <TableCell>Lượng thay đổi</TableCell>
                  <TableCell>Số dư sau</TableCell>
                  <TableCell>Mô tả</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.previousBalance}</TableCell>
                    <TableCell sx={{ color: 'error.main' }}>{transaction.amount}</TableCell>
                    <TableCell>{transaction.newBalance}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              Hiển thị 1-2 trong tổng số 2 giao dịch
            </Typography>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default TransactionHistory;