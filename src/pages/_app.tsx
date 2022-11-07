// ** React Imports
import { ReactNode, useEffect, useState} from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports

import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { OnboardingProvider } from 'src/context/OnboardingContext'
import * as gtag from '../lib/gtag'
import Script from 'next/script'
import auth from 'src/configs/auth'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const maintainenceMode = false;
  let userId;
  const userData =window.localStorage.getItem("userData")
  if (userData != null) {
      const data = JSON.parse(userData)
      userId = data.id;
    }  
    
  const router = useRouter()
  useEffect(() => { 
     
    const handleRouteChange = (url:any) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])
  

  if(maintainenceMode)
  {
    return(    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} - Optimising your Leave, Well-being and Balance Sheet`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Optimising your Leave, Well-being and Balance Sheet`}
        />
        <meta name='keywords' content='Bit Leave, Leave, Well-being, Balance Sheet' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      Platform under maintainence.
    </CacheProvider>);
  }
  return (

    <>
      <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${auth.ga_tracking_id}`}
          />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${auth.ga_tracking_id}', {
              page_path: window.location.pathname,
              'user_id': '${userId}
            });
          `,
        }}
      />
    <CacheProvider value={emotionCache}>
            
      <Head>
        <title>{`${themeConfig.templateName} - Optimising your Leave, Well-being and Balance Sheet`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Optimising your Leave, Well-being and Balance Sheet`}
        />
        <meta name='keywords' content='Bit Leave, Leave, Well-being, Balance Sheet' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Provider store={store}>
        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>

                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                        <OnboardingProvider>

                            {getLayout(<Component {...pageProps} />)}
                        </OnboardingProvider>

                          </AclGuard>

                      </Guard>
                    </WindowWrapper>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </Provider>
    </CacheProvider>
    </>
  )
}

export default App
