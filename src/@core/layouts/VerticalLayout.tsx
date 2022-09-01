// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import AppBar from './components/vertical/appBar'
import Customizer from 'src/@core/components/customizer'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ErrorComponent from 'src/layouts/components/error/error'
import { useDispatch } from 'react-redux'
import { hide } from 'src/store/apiError'
import router from 'next/router'
import { AppDispatch, RootState } from 'src/store'
import EmployeeOnboardingDialog from './components/shared-components/employeeOnboarding'
import { useSelector } from 'react-redux'
import { loadEmployee } from 'src/store/employee'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = (props: LayoutProps) => {
  // ** Props
  const { hidden, settings, children, scrollToTop } = props

  const dispatch = useDispatch<AppDispatch>()

  // ** Vars
  const { skin, navHidden, contentWidth } = settings
  const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize
  const store = useSelector((state: RootState) => state.employee)

  const fetchEmployee = async () => {
    const data = await dispatch(loadEmployee())
    if(data.payload?.data){
      if(data.payload?.data.profile.onboarded==false){
      //setDialogOpen(true)
      }
    }
  }

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow = false }) => {
      console.log(
        `App is changing to ${url} ${shallow ? 'with' : 'without'
        } shallow routing`
      )
      var data = {
        canShow: false,
        redirect: false,
        code: '',
        message: '',
        location: '',
      }
      dispatch(hide(data))
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])
  useEffect(() => {
    if (store.profile == null) {
      fetchEmployee()
    }

  }, [])
  
  // ** States
  const [navHover, setNavHover] = useState<boolean>(false)
  const [navVisible, setNavVisible] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}
        {navHidden &&
          themeConfig.layout === 'vertical' &&
          !(navHidden && settings.lastLayout === 'horizontal') ? null : (
          <Navigation
            navWidth={navWidth}
            navHover={navHover}
            navVisible={navVisible}
            setNavHover={setNavHover}
            setNavVisible={setNavVisible}
            collapsedNavWidth={collapsedNavWidth}
            toggleNavVisibility={toggleNavVisibility}
            navigationBorderWidth={navigationBorderWidth}
            {...props}
          />
        )}
        <MainContentWrapper className='layout-content-wrapper'>
          {/* AppBar Component */}
          <AppBar toggleNavVisibility={toggleNavVisibility} {...props} />

          {/* Content */}
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            <ErrorComponent></ErrorComponent>
            {children}

          </ContentWrapper>

          {/* Footer Component */}
          <Footer {...props} />

          {/* Portal for React Datepicker */}
          <DatePickerWrapper sx={{ zIndex: 11 }}>
            <Box id='react-datepicker-portal'></Box>
          </DatePickerWrapper>
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {/* Customizer */}
      {disableCustomizer || hidden ? null : <Customizer />}

      {/* Scroll to top button */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
      <EmployeeOnboardingDialog open={dialogOpen} handleClose={handleDialogClose}></EmployeeOnboardingDialog>

    </>
  )
}

export default VerticalLayout
