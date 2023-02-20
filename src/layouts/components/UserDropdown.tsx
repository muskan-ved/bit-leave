// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CardAccountPhone from 'mdi-material-ui/CardAccountPhoneOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Config
import API from 'src/configs/auth'

// ** API Call
import { loadEmployee } from 'src/store/employee';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { employeeType } from 'src/types/dashboard';
import { CircularProgress } from '@mui/material'
import * as gtag from '../../lib/gtag'


interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {

  const storedToken = window.localStorage.getItem(API.storageTokenKeyName)
  const userData = window.localStorage.getItem('userData')
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<employeeType | null>(null);

  let userName = "";
  let userRole = "";
  let userEmail = "";
  let userCompany = "";
  if (userData != null && storedToken) {
    const user = JSON.parse(userData)
    userName = user.fullName;
    userEmail = user.email
    userRole = user.role
    userCompany = user.companyname
  }

  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    gtag.event({
      action: 'user_dropdown',
      category: 'user_dropdown',
      label: "user_dropdown",
      value:'open'
    })
    setAnchorEl(event.currentTarget)
  }

  const handleContactUs =() =>{
    gtag.event({
      action: 'contact_us',
      category: 'contact_us',
      label: "contact_us",
      value:'contact_us'
    })
    window.open("mailto:brett@bitleave.co")
    setAnchorEl(null)
  }

  const handleDropdownClose = (url?: string) => {
    gtag.event({
      action: 'user_dropdown',
      category: 'user_dropdown',
      label: "user_dropdown",
      value:'close'
    })
    if (url) {
      router.push(url)
      gtag.event({
        action: 'profile',
        category: 'profile',
        label: "profile",
        value:'profile'
      })
    }
    setAnchorEl(null)
  }

  const fetchDataFromRedux = async () => {
    setIsLoading(true);
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDataFromRedux()
  }, [])
  

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    gtag.event({
      action: 'logout',
      category: 'logout',
      label: "logout",
      value:'logout'
    })
    logout()
    handleDropdownClose()
  }

  if (isLoading && !data)
  return (<CircularProgress color="success" />)

  const localStorageAvatar = localStorage.getItem('avatar')

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        sx={{ ml: 2, cursor: 'pointer' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          src={localStorageAvatar ? '/images/avatars/'+localStorageAvatar : data?.avatar ? '/images/avatars/'+data?.avatar : '/images/avatars/questionMark.png'}
          sx={{ width: 40, height: 40 }}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'ltr' ? 'right' : 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'ltr' ? 'right' : 'left'
        }}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt='John Doe'
                src={localStorageAvatar ? '/images/avatars/'+localStorageAvatar : data?.avatar ? '/images/avatars/'+data?.avatar : '/images/avatars/questionMark.png'}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box
              sx={{
                display: 'flex',
                marginLeft: 3,
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{userName}</Typography>
              <Typography
                variant='body2'
                sx={{ fontSize: '0.8rem', color: 'text.disabled' }}
              >
                {userRole}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem  onClick={() => handleDropdownClose('/profile')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem  onClick={() => handleContactUs()} sx={{ p: 0 }}>
          <Box sx={styles}>
            <CardAccountPhone sx={{ marginRight: 2 }} />
            Contact Us
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem  onClick={handleLogout} sx={{ py: 2 }}>
          <LogoutVariant
            sx={{
              marginRight: 2,
              fontSize: '1.375rem',
              color: 'text.secondary'
            }}
          />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
