// ** Icon imports
import { EmailOutline, GiftOpenOutline, ViewDashboardOutline, WalletOutline, HomeOutline, ShieldOutline, FileUploadOutline, OfficeBuildingOutline } from 'mdi-material-ui'

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
      icon: OfficeBuildingOutline,
      disabled: true,
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
    {
      title: 'Sync Org',
      icon: FileUploadOutline,
      path: '/organisation',
      action: 'manage',
      subject: 'admin'
    },
    {
      sectionTitle: 'Benefits',
      action: 'read',
      subject: 'sectionTitles'
    },
    {
      title: 'Wallets \n (coming soon)',
      icon: WalletOutline,
      disabled: true,
      action: 'read',
      subject: 'Wallets'
    },
    {
      title: 'Perks (coming soon)',
      icon: GiftOpenOutline,
      disabled: true,
      action: 'read',
      subject: 'Perks'
    },

  ]

}

export default navigation
