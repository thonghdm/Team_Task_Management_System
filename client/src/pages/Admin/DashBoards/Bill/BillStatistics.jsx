import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  Tooltip as MuiTooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  People,
  Star,
  CheckCircle,
  Warning,
  Schedule,
  Diamond,
  WorkspacePremium,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  premium: '#FF4B91',
  free: '#4B9EFF',
  success: '#00C853',
  warning: '#FFB300',
  error: '#FF1744',
};

const BillStatistics = ({ billData }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('all');

  // Process data for statistics
  const statistics = useMemo(() => {
    if (!billData?.data) return null;

    const data = billData.data;
    const totalSubscriptions = data.length;
    const premiumSubscriptions = data.filter(bill => bill.plan_id.subscription_type === 'Premium').length;
    const freeSubscriptions = data.filter(bill => bill.plan_id.subscription_type === 'Free').length;
    const activeSubscriptions = data.filter(bill => bill.is_active).length;
    const totalRevenue = data.reduce((sum, bill) => sum + (bill.plan_id.price || 0), 0);
    const monthlyRevenue = totalRevenue / 12; // Assuming yearly subscription

    // Calculate subscription distribution
    const subscriptionDistribution = [
      { name: 'Premium', value: premiumSubscriptions },
      { name: 'Free', value: freeSubscriptions },
    ];

    // Get recent subscriptions
    const recentSubscriptions = [...data]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalSubscriptions,
      premiumSubscriptions,
      freeSubscriptions,
      activeSubscriptions,
      totalRevenue,
      monthlyRevenue,
      subscriptionDistribution,
      recentSubscriptions,
    };
  }, [billData]);

  if (!statistics) return null;

  return (
    <Box>
      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
              : 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
            color: 'white',
            height: '100%',
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Total Subscriptions
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {statistics.totalSubscriptions}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <People sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {statistics.activeSubscriptions} Active
                    </Typography>
                  </Box>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha('#c2185b', 0.9)} 0%, ${alpha('#e91e63', 0.8)} 100%)`
              : 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
            color: 'white',
            height: '100%',
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Premium Plans
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {statistics.premiumSubscriptions}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Diamond sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {((statistics.premiumSubscriptions / statistics.totalSubscriptions) * 100).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Box>
                <WorkspacePremium sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha('#00796b', 0.9)} 0%, ${alpha('#009688', 0.8)} 100%)`
              : 'linear-gradient(135deg, #00796b 0%, #009688 100%)',
            color: 'white',
            height: '100%',
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                    ${statistics.monthlyRevenue.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      ${statistics.totalRevenue.toFixed(2)} Total Revenue
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha('#f57c00', 0.9)} 0%, ${alpha('#ff9800', 0.8)} 100%)`
              : 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
            color: 'white',
            height: '100%',
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {((statistics.premiumSubscriptions / statistics.totalSubscriptions) * 100).toFixed(1)}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      Free to Premium
                    </Typography>
                  </Box>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Tables Section */}
      <Grid container spacing={3}>
        {/* Subscription Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
              : theme.palette.background.paper,
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.9)
                    : theme.palette.primary.main
                }}
              >
                Subscription Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statistics.subscriptionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statistics.subscriptionDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === 'Premium' ? COLORS.premium : COLORS.free} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.9)
                          : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: theme.palette.mode === 'dark'
                          ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                          : '0 4px 8px rgba(0,0,0,0.1)',
                        color: theme.palette.text.primary
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.text.secondary, 0.8)
                          : theme.palette.text.secondary
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Subscriptions Table */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            height: '100%',
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
              : theme.palette.background.paper,
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.9)
                    : theme.palette.primary.main
                }}
              >
                Recent Subscriptions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.text.primary, 0.9)
                          : theme.palette.text.primary
                      }}>Plan</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.text.primary, 0.9)
                          : theme.palette.text.primary
                      }}>Start Date</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.text.primary, 0.9)
                          : theme.palette.text.primary
                      }}>End Date</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.text.primary, 0.9)
                          : theme.palette.text.primary
                      }}>Status</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.text.primary, 0.9)
                          : theme.palette.text.primary
                      }} align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.recentSubscriptions.map((subscription) => (
                      <TableRow 
                        key={subscription._id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.main, 0.08)
                              : alpha(theme.palette.primary.main, 0.04),
                            transition: 'background-color 0.2s'
                          }
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: subscription.plan_id.subscription_type === 'Premium' ? COLORS.premium : COLORS.free,
                                width: 32,
                                height: 32,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              {subscription.plan_id.subscription_type === 'Premium' ? <Diamond /> : <CheckCircle />}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {subscription.plan_id.subscription_type}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.start_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={subscription.is_active ? <CheckCircle /> : <Warning />}
                            label={subscription.is_active ? 'Active' : 'Expired'}
                            color={subscription.is_active ? 'success' : 'error'}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }} align="right">
                          ${subscription.plan_id.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Status Overview */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
              : theme.palette.background.paper,
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.palette.mode === 'dark'
                ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                : '0 8px 16px rgba(0,0,0,0.2)',
            }
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.9)
                    : theme.palette.primary.main
                }}
              >
                Subscription Status Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.text.primary, 0.9)
                            : theme.palette.text.primary
                        }}
                      >
                        Premium
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {statistics.premiumSubscriptions} / {statistics.totalSubscriptions}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(statistics.premiumSubscriptions / statistics.totalSubscriptions) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: COLORS.premium
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.text.primary, 0.9)
                            : theme.palette.text.primary
                        }}
                      >
                        Free
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {statistics.freeSubscriptions} / {statistics.totalSubscriptions}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(statistics.freeSubscriptions / statistics.totalSubscriptions) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: COLORS.free
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.5)
                      : 'grey.50',
                    borderRadius: 2,
                    boxShadow: theme.palette.mode === 'dark'
                      ? `inset 0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`
                      : 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.primary.main, 0.9)
                          : theme.palette.primary.main
                      }}
                    >
                      Detailed Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Subscriptions:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{statistics.totalSubscriptions}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Active Subscriptions:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{statistics.activeSubscriptions}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Conversion Rate:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {((statistics.premiumSubscriptions / statistics.totalSubscriptions) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Average Revenue:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${(statistics.totalRevenue / statistics.totalSubscriptions).toFixed(2)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillStatistics;