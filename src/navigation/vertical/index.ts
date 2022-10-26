// ** Icon imports
import { EmailOutline, GiftOpenOutline, ViewDashboardOutline, WalletOutline, HomeOutline, ShieldOutline, FileUploadOutline, OfficeBuildingMarkerOutline, HelpCircleOutline } from 'mdi-material-ui'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {

  const userData = localStorage.getItem("userData")
  let orgName;
  if (userData != null) {
    const data = JSON.parse(userData)
    orgName = data.companyname;
  }

  return [
    {
      sectionTitle: ' ',
      action: 'read',
      subject: 'sectionTitles'
    },
    {
      title: orgName,
      icon: OfficeBuildingMarkerOutline,
      disabled: false,
      badgeColor : 'warning',
      badgeContent : '',
      action: 'read',
      subject: 'orgname'
    },
    {
      sectionTitle: ' ',
      action: 'read',
      subject: 'sectionTitles'
    },
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home', //user home
      action: 'read',
      subject: 'home'
    },
    {
      sectionTitle: 'Dashboards',
      action: 'read',
      subject: 'sectionTitles'
    },
    {
      title: 'Dashboard',
      icon: ViewDashboardOutline,
      path: '/dashboard', //User Dashboard
      action: 'read',
      subject: 'dashboard'
    },
    {
      sectionTitle: 'Settings',
      action: 'read',
      subject: 'settingsSection'
    },
    {
      title: 'Org Setting',
      icon: SettingsOutlinedIcon,
      action: 'manage',
      subject: 'admin',
      children: [
        {
          title: 'Thresholds',
          icon: ShieldOutline,
          path: '/thresholds',
          action: 'manage',
          subject: 'admin'
        },
        {
          title: 'Templates',
          icon: EmailOutline,
          path: '/templates',
          action: 'manage',
          subject: 'admin'
        },

      ]
    },
    {
      title: 'Org Setup',
      icon: ManageAccountsOutlinedIcon,
      action: 'manage',
      subject: 'admin',
      children: [
        {
          title: 'Sync Org',
          icon: FileUploadOutline,
          //path: '/organisation',
          action: 'manage',
          subject: 'admin',
          badgeColor: "primary",
          badgeContent:'coming soon'
        },
        {
          title: 'bit.leave Setup',
          icon: SettingsOutlinedIcon,
          path: '/setup',
          action: 'manage',
          subject: 'admin'
        },
        {
          title: 'Roles',
          icon: PersonOutlineIcon,
          path: '/roleManage',
          action: 'manage',
          subject: 'admin'
        }
      ]
    },
    {
      sectionTitle: 'Benefits',
      action: 'read',
      subject: 'sectionTitles'
    },
    {
      title: 'Wallets',
      icon: WalletOutline,
      disabled: false,
      action: 'read',
      subject: 'Wallets',
      badgeColor: "primary",
      badgeContent:'coming soon'
    },
    {
      title: 'Perks',
      icon: GiftOpenOutline,
      disabled: false,
      action: 'read',
      subject: 'Perks',
      badgeColor: 'primary',
      badgeContent:'coming soon'
    },
    {
      title: 'How To',
      icon: HelpCircleOutline,
      action: 'read',
      subject: 'howTo',
      disabled: false,
      path: process.env.NEXT_PUBLIC_APP_URL +'/home/'
    },
  ]

}

export default navigation
