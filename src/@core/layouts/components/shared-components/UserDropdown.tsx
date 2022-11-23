// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

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
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

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
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

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
    logout()
    handleDropdownClose()
  }

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
          src='/images/avatars/1.png'
          sx={{ width: 40, height: 40 }}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
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
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>John Doe</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem  onClick={() => handleDropdownClose('/apps/user/view/12')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <AccountOutline sx={{ mr: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem  onClick={() => handleDropdownClose('/apps/email')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <EmailOutline sx={{ mr: 2 }} />
            Inbox
          </Box>
        </MenuItem> 
        <MenuItem  onClick={() => handleDropdownClose('/apps/chat')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <MessageOutline sx={{ mr: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem  onClick={() => handleDropdownClose('/pages/account-settings')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <CogOutline sx={{ mr: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem  onClick={() => handleDropdownClose('/pages/pricing')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ mr: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem  onClick={() => handleDropdownClose('/pages/faq')} sx={{ p: 0 }}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ mr: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 2 }} >
          <LogoutVariant sx={{ mr: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
