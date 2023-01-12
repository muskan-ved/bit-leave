// ** React Import
import { ReactNode, useEffect, useRef, useState } from 'react'

// ** MUI Import
import List from '@mui/material/List'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import Drawer from './Drawer'
import VerticalNavItems from './VerticalNavItems'
import VerticalNavHeader from './VerticalNavHeader'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Props {
  hidden: boolean
  navWidth: number
  navHover: boolean
  settings: Settings
  children: ReactNode
  navVisible: boolean
  collapsedNavWidth: number
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  setNavHover: (values: boolean) => void
  setNavVisible: (value: boolean) => void
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  verticalNavMenuContent?: (props?: any) => ReactNode
  afterVerticalNavMenuContent?: (props?: any) => ReactNode
  beforeVerticalNavMenuContent?: (props?: any) => ReactNode
}

const StyledBoxForShadow = styled(Box)<BoxProps>(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  display: 'none',
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  '&.d-block': {
    display: 'block'
  }
}))

const Navigation = (props: Props) => {
  // ** Props
  const {
    hidden,
    settings,
    afterVerticalNavMenuContent,
    beforeVerticalNavMenuContent,
    verticalNavMenuContent: userVerticalNavMenuContent
  } = props

  // ** States
  const [groupActive, setGroupActive] = useState<string[]>([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])
  const [imageURL, setImageURL] = useState('')

  // ** Ref
  const shadowRef = useRef(null)

  // ** Hooks
  const theme = useTheme()

  // ** Var
  const { skin } = settings
  const { afterVerticalNavMenuContentPosition, beforeVerticalNavMenuContentPosition } = themeConfig

  function UrlExists() {
    var http = new XMLHttpRequest()
    const userData = window.localStorage.getItem('userData')
    let OrgId
    if (userData != null) {
      const data = JSON.parse(userData)
      OrgId = data.orgId
    }
    const url = `https://bl-org-assets.s3.ap-southeast-2.amazonaws.com/${OrgId}/logo`
    http.open('HEAD', url, true)
	http.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	http.setRequestHeader( 'Content-Type', 'application/json' );
    http.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        if (this.status === 200) {
          setImageURL(url)
        } else {
          localStorage.setItem('orgnLogo', '/images/cards/company_logo.png')
          setImageURL('/images/cards/company_logo.png')
        }
      }
    }
    http.send()
  }

  useEffect(() => {
    UrlExists()
  }, [])

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = (ref: HTMLElement) => {
    if (ref) {
      // @ts-ignore
      ref._getBoundingClientRect = ref.getBoundingClientRect

      ref.getBoundingClientRect = () => {
        // @ts-ignore
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  // ** Scroll Menu
  const scrollMenu = (container: any) => {
    if (beforeVerticalNavMenuContentPosition === 'static' || !beforeVerticalNavMenuContent) {
      container = hidden ? container.target : container
      if (shadowRef && container.scrollTop > 0) {
        // @ts-ignore
        if (!shadowRef.current.classList.contains('d-block')) {
          // @ts-ignore
          shadowRef.current.classList.add('d-block')
        }
      } else {
        // @ts-ignore
        shadowRef.current.classList.remove('d-block')
      }
    }
  }

  const shadowBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return `linear-gradient(${theme.palette.customColors.darkBg} 5%,${hexToRGBA(
        theme.palette.customColors.darkBg,
        0.85
      )} 30%,${hexToRGBA(theme.palette.customColors.darkBg, 0.5)} 65%,${hexToRGBA(
        theme.palette.customColors.darkBg,
        0.3
      )} 75%,transparent)`
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return `linear-gradient(${theme.palette.customColors.lightBg} 5%,${hexToRGBA(
        theme.palette.customColors.lightBg,
        0.85
      )} 30%,${hexToRGBA(theme.palette.customColors.lightBg, 0.5)} 65%,${hexToRGBA(
        theme.palette.customColors.lightBg,
        0.3
      )} 75%,transparent)`
    } else {
      return `linear-gradient(${theme.palette.background.default} 5%,${hexToRGBA(
        theme.palette.background.default,
        0.85
      )} 30%,${hexToRGBA(theme.palette.background.default, 0.5)} 65%,${hexToRGBA(
        theme.palette.background.default,
        0.3
      )} 75%,transparent)`
    }
  }

  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  const userData = window.localStorage.getItem("userData")
  let data;
  if (userData != null) {
      data = JSON.parse(userData)
    }  
  const checkRoleForSideNavHeight = (data.role === 'user' ? '89vh' :  '120vh' )
  return (
    <Drawer {...props}>
      <VerticalNavHeader {...props} />
      {beforeVerticalNavMenuContent && beforeVerticalNavMenuContentPosition === 'fixed'
        ? beforeVerticalNavMenuContent(props)
        : null}
      {(beforeVerticalNavMenuContentPosition === 'static' || !beforeVerticalNavMenuContent) && (
        <StyledBoxForShadow ref={shadowRef} sx={{ background: shadowBgColor() }} />
      )}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* @ts-ignore */}
        <ScrollWrapper
          containerRef={(ref: any) => handleInfiniteScroll(ref)}
          {...(hidden
            ? {
                onScroll: (container: any) => scrollMenu(container),
                sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
              }
            : {
                options: { wheelPropagation: false },
                onScrollY: (container: any) => scrollMenu(container)
              })}
        >
          {beforeVerticalNavMenuContent && beforeVerticalNavMenuContentPosition === 'static'
            ? beforeVerticalNavMenuContent(props)
            : null}
          {userVerticalNavMenuContent ? (
            userVerticalNavMenuContent(props)
          ) : (
            <List className='nav-items' sx={{ pt: 0, height: checkRoleForSideNavHeight, '& > :first-child': { mt: '0' } }}>
              <VerticalNavItems
                groupActive={groupActive}
                setGroupActive={setGroupActive}
                currentActiveGroup={currentActiveGroup}
                setCurrentActiveGroup={setCurrentActiveGroup}
                orgLogoURL={imageURL}
                {...props}
              />
            </List>
          )}
          {afterVerticalNavMenuContent && afterVerticalNavMenuContentPosition === 'static'
            ? afterVerticalNavMenuContent(props)
            : null}
        </ScrollWrapper>
      </Box>
      {afterVerticalNavMenuContent && afterVerticalNavMenuContentPosition === 'fixed'
        ? afterVerticalNavMenuContent(props)
        : null}
    </Drawer>
  )
}

export default Navigation
