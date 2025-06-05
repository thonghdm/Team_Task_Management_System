import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  ToggleButtonGroup, 
  ToggleButton,
  useTheme,
  alpha,
  Paper,
  Divider
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

const MemberStatistics = ({statisticsMember}) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7days');
  
  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const getDataForRange = () => {
    switch (timeRange) {
      case '7days':
        return statisticsMember.weeklyData;
      case '1month':
        return statisticsMember.monthlyData;
      case '3months':
        return statisticsMember.quarterlyData;
      default:
        return statisticsMember.weeklyData;
    }
  };

  const getRangeLabel = () => {
    switch (timeRange) {
      case '7days':
        return 'Last 7 Days';
      case '1month':
        return 'Last Month';
      case '3months':
        return 'Last 3 Months';
      default:
        return 'Member Statistics';
    }
  };

  const totalNewMembers = getDataForRange().reduce((sum, item) => sum + item.newMembers, 0);
  const averageGrowth = totalNewMembers / getDataForRange().length;

  return (
    <Card 
      sx={{ 
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        borderRadius: 2,
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
          : theme.shadows[4],
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.palette.mode === 'dark'
            ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
            : theme.shadows[8],
        },
        height: '100%',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <CardContent>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 2
          }}
        >
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.primary.main, 0.9)
                  : theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PeopleIcon sx={{ fontSize: 24 }} />
              Member Statistics
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.text.secondary, 0.8)
                  : theme.palette.text.secondary,
                mt: 0.5
              }}
            >
              {getRangeLabel()}
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px !important',
                px: 2,
                py: 0.5,
                mx: 0.5,
                color: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.text.secondary, 0.8)
                  : theme.palette.text.secondary,
                '&.Mui-selected': {
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                  color: 'white',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.7)} 100%)`
                      : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
                  }
                },
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.1),
                }
              }
            }}
          >
            <ToggleButton value="7days">7 Days</ToggleButton>
            <ToggleButton value="1month">1 Month</ToggleButton>
            <ToggleButton value="3months">3 Months</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ height: 316, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getDataForRange()}>
              <defs>
                <linearGradient id="colorNewMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={theme.palette.mode === 'dark' ? 0.4 : 0.3}/>
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.2 : 0.1)}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fill: theme.palette.mode === 'dark' ? alpha(theme.palette.text.secondary, 0.8) : theme.palette.text.secondary }}
                axisLine={{ stroke: alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.2 : 0.1) }}
              />
              <YAxis 
                tick={{ fill: theme.palette.mode === 'dark' ? alpha(theme.palette.text.secondary, 0.8) : theme.palette.text.secondary }}
                axisLine={{ stroke: alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.2 : 0.1) }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.9)
                    : 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: 8,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                    : '0 4px 12px rgba(0,0,0,0.1)',
                  color: theme.palette.text.primary
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingBottom: 20,
                  color: theme.palette.mode === 'dark' ? alpha(theme.palette.text.secondary, 0.8) : theme.palette.text.secondary
                }}
              />
              <Area
                type="monotone"
                dataKey="newMembers"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNewMembers)"
                name="New Members"
                dot={{ 
                  r: 4,
                  fill: theme.palette.primary.main,
                  strokeWidth: 2,
                  stroke: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box 
          mt={3} 
          sx={{ 
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap'
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              flex: 1,
              minWidth: 200,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.text.secondary, 0.8)
                  : theme.palette.text.secondary,
                mb: 1
              }}
            >
              Total New Members
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.9)
                    : theme.palette.primary.main
                }}
              >
                {totalNewMembers}
              </Typography>
              <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
            </Box>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              flex: 1,
              minWidth: 200,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.text.secondary, 0.8)
                  : theme.palette.text.secondary,
                mb: 1
              }}
            >
              Average Daily Growth
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.success.main, 0.9)
                    : theme.palette.success.main
                }}
              >
                {averageGrowth.toFixed(1)}
              </Typography>
              <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
            </Box>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemberStatistics;