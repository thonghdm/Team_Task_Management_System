import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SignIn from './pages/Auth/SignIn/SignIn'
import SingUp from './pages/Auth/SignUp/SignUp'
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import LoginSuccess from './components/LoginSuccess'
import Homes from '~/pages/Homes'
import Boards from '~/pages/Boards'
import OTP from '~/pages/Auth/OTP'
import SignUpSuccess from '~/pages/Auth/SignUp/SignUpSuccess'
import ProtectedRoute from '~/pages/Auth/SignUp/ProtectedRoute'
import { AuthProvider } from '~/pages/Auth/SignUp/AuthContext';

function ModeSelect() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    setMode(event.target.value)
  };

  return (
    <Box >
      <FormControl sx={{ minWidth: 30, m: 2 }} size="small">
        <InputLabel id="lable-select-dark-light-mode">Mode</InputLabel>
        <Select
          labelId="lable-select-dark-light-mode"
          id="select-dark-light-mode"
          value={mode}
          label="Mode"
          onChange={handleChange}
        >
          <MenuItem value="light">
            <Box sx={{ display: 'flex', gap: 1 }}>
              <LightModeIcon />Light
            </Box>
          </MenuItem>
          <MenuItem value="dark">
            <Box sx={{ display: 'flex', gap: 1 }}>
              <SettingsBrightnessIcon />Dark
            </Box>
          </MenuItem>
          <MenuItem value="system">
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DarkModeIcon />System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      {/* <ModeSelect />
      <Box sx={{ color: 'primary.main' }}>aaaaaaaaaaaaaa</Box>
      <TextField id="outlined-search" label="Search..." type='search' size='small' /> */}
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SingUp />} />
        <Route path="/otp" element={<ProtectedRoute><OTP /></ProtectedRoute>} />
        <Route path="/sign-up-success" element={<ProtectedRoute><SignUpSuccess /></ProtectedRoute>} /> {/* Example success route */}


        <Route path='/login-success/:userId/:tokenLogin' element={<LoginSuccess />} />
        <Route path='/board/*' element={<Boards />} />
      </Routes>

    </AuthProvider>
  )
}

export default App
