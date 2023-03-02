// ** Icon imports
import { EmailOutline, GiftOpenOutline, ViewDashboardOutline, WalletOutline, HomeOutline, ShieldOutline, FileUploadOutline, OfficeBuildingMarkerOutline, HelpCircleOutline } from 'mdi-material-ui'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { GridTripleDotsVerticalIcon } from '@mui/x-data-grid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

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
			badgeColor: 'warning',
			badgeContent: '',
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
			path: '/dashboard/stats', //User Dashboard
			action: 'read',
			subject: 'dashboard'
		},
		{
			title: 'My Leave',
			icon: CalendarMonthIcon,
			path: '/dashboard/leaves', //User Dashboard
			action: 'read',
			subject: 'dashboard'
		},
		{
			title: 'Org Chart',
			icon: GridTripleDotsVerticalIcon,
			path: '/dashboard/organisation-view',
			action: 'read',
			subject: 'dashboardOrgChartView'
		},
		{
			title: 'Scenarios',
			icon: ReceiptLongIcon,
			path: '/dashboard/scenarios',
			action: 'read',
			subject: 'dashboardScenarios'
		},
		{
			sectionTitle: 'Settings',
			action: 'read',
			subject: 'settingsSection'
		},
		{
			title: 'Leave Thresholds',
			icon: ShieldOutline,
			path: '/thresholds',
			action: 'manage',
			subject: 'admin'
		},
		{
			title: 'Email Templates',
			icon: EmailOutline,
			path: '/templates',
			action: 'manage',
			subject: 'admin'
		},
		{
			title: 'Payroll Connection',
			icon: AttachMoneyOutlinedIcon,
			path: '/payroll',
			action: 'manage',
			subject: 'admin'
		},

		{
			title: 'Build Org Chart',
			icon: FileUploadOutline,
			path: '/organisation',
			action: 'manage',
			subject: 'admin',
		},
		{
			title: 'Roles',
			icon: PersonOutlineIcon,
			path: '/roleManage',
			action: 'manage',
			subject: 'admin'
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
			badgeContent: 'coming soon'
		},
		{
			title: 'Perks',
			icon: GiftOpenOutline,
			disabled: false,
			action: 'read',
			subject: 'Perks',
			badgeColor: 'primary',
			badgeContent: 'coming soon'
		},
		{
			title: 'How To',
			icon: HelpCircleOutline,
			action: 'read',
			subject: 'howTo',
			disabled: false,
			path: process.env.NEXT_PUBLIC_APP_URL + '/home/'
		},
	]

}

export default navigation
