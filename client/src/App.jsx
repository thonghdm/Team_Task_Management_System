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
import { Routes, Route } from 'react-router-dom'
import LoginSuccess from './Components/LoginSuccess'
import Homes from '~/pages/Homes'
import Boards from '~/pages/Boards'
import OTP from '~/Components/OTP'
import SignUpSuccess from '~/pages/Auth/SignUp/SignUpSuccess'
import ProtectedRoute from '~/pages/Auth/SignUp/ProtectedRoute'
import { AuthProvider } from '~/pages/Auth/SignUp/AuthContext'
import Error from './pages/Error'
import ResetPassword from '~/pages/Auth/ResetPassword'
import NewPassword from '~/pages/Auth/ResetPassword/NewPassword'
import Profile from '~/pages/Profile'
import AddProjects from '~/pages/Projects/AddProjects'
import ProjectTemplate from '~/pages/Projects/AddProjects/ProjectTemplate'
import ProjectsBlank from './pages/Projects/AddProjects/ProjectsBlank'
import { ToastContainer } from 'react-toastify'

import Introduce from '~/pages/Introduce'
import ImportProject from './pages/Projects/AddProjects/ImportProject'

import Admin from '~/pages/Admin'

import TransactionHistory from '~/pages/TransactionHistory'
import CallVideo from './pages/Inbox/Call-video'
import CallNotification from './pages/Inbox/Call-video/CallNotification'

import { CallProvider } from '~/Context/CallProvider'
import ChatProvider from '~/Context/ChatProvider'

import Contact from '~/pages/Contact'

function App() {
  return (
    <AuthProvider>
        <ChatProvider>
          <CallProvider>
      <ToastContainer position="bottom-left" />
        <Routes>
          <Route path='/' element={<Introduce />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SingUp />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/otp" element={<ProtectedRoute><OTP /></ProtectedRoute>} />
              <Route path="/sign-up-success" element={<ProtectedRoute><SignUpSuccess /></ProtectedRoute>} />
          <Route path='/error' element={<Error />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/new-password' element={<ProtectedRoute><NewPassword /></ProtectedRoute>} />
          <Route path='/profile/*' element={<Profile />} />
          <Route path='/login-success/:userId/:tokenLogin' element={<LoginSuccess />} />
          <Route path='/board/*' element={<Boards />} />
          <Route path="/projects-new" element={<AddProjects />} />
          <Route path="/projects-new/blank" element={<ProjectsBlank />} />
          <Route path="/projects-new/import-sheet" element={<ImportProject />} />
          <Route path='/admin/*' element={<Admin />} />
          <Route path='/transaction-history/*' element={<TransactionHistory />} />
              <Route path="/call-video/:callId" element={<CallVideo/>} />
        </Routes>
      </CallProvider>
        </ChatProvider>
    </AuthProvider>
  )
}

export default App
