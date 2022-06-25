// ** Icon imports
import { EmailOutline, GiftOpenOutline, ViewDashboardOutline, WalletOutline, HomeOutline, ShieldOutline} from 'mdi-material-ui'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      sectionTitle: 'Settings'
    },
    {
      title: 'Thresholds',
      icon: ShieldOutline,
      path: '/thresholds'
    },
    {
      title: 'Templates',
      icon: EmailOutline,
      path: '/templates',
    },
    // {
    //   title: 'Dashboard',
    //   icon: ViewDashboardOutline,
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page'
    // },
    // {
    //   title: 'My Wallet',
    //   icon: WalletOutline,
    //   path: '/my-wallet',
    //   action: 'read',
    //   subject: 'acl-page'
    // },
    {
      title: 'Perks',
      icon: GiftOpenOutline,
      path: '/perks',
      action: 'read',
      subject: 'acl-page'
    }
  ]
}

export default navigation
