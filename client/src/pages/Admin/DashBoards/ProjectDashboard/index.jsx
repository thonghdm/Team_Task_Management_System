import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Typography, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Import StatsCard
import StatsCard from '~/pages/Admin/DashBoards/Components/StatsCard';

// Mock data
const dashboardData = {
  statsCards: [
    {
      title: 'Tổng Dự Án',
      value: '12',
      subtext: '+15% so với tháng trước',
      icon: <DashboardIcon />,
      color: 'primary.main'
    },
    {
      title: 'Dự Án Đang Hoạt Động',
      value: '7',
      subtext: '3 dự án mới tuần này',
      icon: <WorkIcon />,
      color: 'success.main'
    },
    {
      title: 'Dự Án Hoàn Thành',
      value: '5',
      subtext: 'Hiệu suất tốt',
      icon: <CheckCircleIcon />,
      color: 'secondary.main'
    },
    {
      title: 'Nhân Sự',
      value: '28',
      subtext: '+2 thành viên mới',
      icon: <PeopleIcon />,
      color: 'info.main'
    }
  ],
  projectProgress: [
    { name: 'Tháng 1', progress: 40 },
    { name: 'Tháng 2', progress: 55 },
    { name: 'Tháng 3', progress: 70 },
    { name: 'Tháng 4', progress: 65 },
    { name: 'Tháng 5', progress: 80 }
  ],
  activities: [
    { 
      id: 1, 
      project: 'Dự án Web App', 
      description: 'Hoàn thành giai đoạn thiết kế', 
      date: '15/01/2024' 
    },
    { 
      id: 2, 
      project: 'Hệ thống CRM', 
      description: 'Bắt đầu giai đoạn phát triển', 
      date: '22/01/2024' 
    },
    { 
      id: 3, 
      project: 'Mobile App', 
      description: 'Kiểm tra và tối ưu', 
      date: '29/01/2024' 
    }
  ]
};

const ProjectDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard 
              title={card.title}
              value={card.value}
              subtext={card.subtext}
              icon={card.icon}
              color={card.color}
            />
          </Grid>
        ))}
      </Grid>

    </>
  );
};

export default ProjectDashboard;