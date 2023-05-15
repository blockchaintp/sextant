/* eslint-disable import/no-unresolved */
import * as React from 'react'
import { Helmet } from 'react-helmet'
import classnames from 'classnames'
import { styled } from '@mui/system';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'

import SideMenu, { SideMenuItem, SideMenuProps } from '../components/layout/SideMenu'
import AppBarMenu from '../components/layout/AppBarMenu'
import Loading from '../components/system/Loading'

const Root = styled('div')({
  position: 'relative',
  minHeight: '100vh',
})

const StyledAppBarWrapper = styled(AppBar)({
  flexGrow: 1,
  flex: 1,
})

const LineTypography = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

const TextTypography = styled(Typography)(({ theme }) => ({
  flex: 1,
  marginTop: theme.spacing(0.5),
}))

const ImgLogo = styled('img')({
  height: '42px',
  marginRight: '20px',
  flex: 0,
})

const LogoText = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
})

const StyledToolBar = styled(Toolbar)(({ theme }) => ({
  margin: theme.spacing(1),
}))

const ContentContainer = styled('div')({
  height: 'calc(100% - 64px)',
  paddingTop: '80px',
})

const BoxWrapper = styled('div')({
  // padding that is the height of the footer -
  // ensures enough space for footer in shared container
  paddingBottom: '4rem',
  // minHeight: 'calc(100vh - 4rem)',
})

const FooterToolbar = styled(Toolbar)({
  // absolute postion within the root container set to the bottom
  position: 'absolute',
  bottom: '0',
  width: '100%',
  height: '4rem',
})

const GlobalLoadingContainer = styled('div')({
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255,255,255,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
})

const GlobalLoading = styled('div')({
  width: '200px',
  textAlign: 'center',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '20px',
})

export interface CISideMenuProps extends SideMenuProps {
  _ci?: string
  hover?: boolean
}

const CISideMenu = ({ _ci, ...rest }: CISideMenuProps) => {
  return <SideMenu {...rest} />;
}

interface LayoutProps {
  user: {
    createdAt: string
    id: string
    meta: {}
    permission: string
    roles: string[]
    username: string
  }
  sideMenuItems: SideMenuItem[]
  appBarMenuItems: {
    handler: string
    icon: React.ReactElement<any, any> | React.ComponentType<any>
    title: string
  }[]
  openPage: (handler: string) => void
  children: []
  header: {
    logo: string
    text: string
  }
  globalLoading: boolean
}
const Layout: React.FC<LayoutProps> = ({
  user,
  sideMenuItems,
  appBarMenuItems,
  openPage,
  children,
  header,
  globalLoading,
}) => {

  return (
    <Root className={classnames('main-layout-root')}>
      <Helmet>
        <link rel="shortcut icon" type="image/png" href={'../assets/small-logo-blue.png'} />
      </Helmet>
      <StyledAppBarWrapper className={classnames('main-layout-appbar')}>
        <AppBar position="static">
          <StyledToolBar>
            <CISideMenu
              _ci="sidemenu"
              items={sideMenuItems}
              openPage={openPage}
            />
            <ImgLogo src={header.logo} alt="" />
            <LogoText>
              <LineTypography
                variant="h4"
                color="inherit"
              >
                |
              </LineTypography>
              <TextTypography
                variant="h5"
                color="inherit"
              >
                {header.text}
              </TextTypography>
            </LogoText>
            <AppBarMenu
              user={user}
              items={appBarMenuItems}
              openPage={openPage}
            />
          </StyledToolBar>
        </AppBar>
      </StyledAppBarWrapper>
      <BoxWrapper className={classnames('main-layout-box')}>
        <ContentContainer className={classnames('main-layout-content')}>
          { children }
        </ContentContainer>
        <div className={classnames('main-layout-footer')}>
          <FooterToolbar>
            <Typography variant="caption" color="textSecondary">
              &copy; 2018-2023
              {' '}
              <a href="https://btp.works/" target="_blank" rel="noreferrer">BTP Works</a>
              {' '}
              All rights reserved :
              {' '}
              <a href="https://btp.works/support" target="_blank" rel="noreferrer">Support page</a>
            </Typography>
          </FooterToolbar>
        </div>
      </BoxWrapper>
      {
        globalLoading && (
          <GlobalLoadingContainer>
            <GlobalLoading>
              <Loading />
            </GlobalLoading>
          </GlobalLoadingContainer>
        )
      }
    </Root>
  )
}

export default Layout
