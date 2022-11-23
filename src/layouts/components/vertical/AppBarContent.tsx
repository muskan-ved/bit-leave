// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import MenuIcon from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/layouts/components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit'  onClick={toggleNavVisibility} sx={{ ml: -2.75 }}>
            <MenuIcon />
          </IconButton>
        ) : null}

        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <LanguageDropdown settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown settings={settings} />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
