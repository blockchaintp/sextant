import LoginIcon from '@mui/icons-material/ExitToApp'
import LogoutIcon from '@mui/icons-material/PowerSettingsNew'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StorageIcon from '@mui/icons-material/Storage'
import ViewIcon from '@mui/icons-material/Visibility'
import KeyIcon from '@mui/icons-material/VpnKey'
import SettingsIcon from '@mui/icons-material/Settings'
import ClipboardIcon from '@mui/icons-material/FileCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import UpArrowIcon from '@mui/icons-material/KeyboardArrowUp'
import DownArrowIcon from '@mui/icons-material/KeyboardArrowDown'
import UploadIcon from '@mui/icons-material/CloudUpload'
import BuildIcon from '@mui/icons-material/Build'
import RemoveIcon from '@mui/icons-material/RemoveCircle'
import RepeatIcon from '@mui/icons-material/Repeat'
import ViewArchiveIcon from '@mui/icons-material/ViewModule'
import CreateArchiveIcon from '@mui/icons-material/AddAPhoto'
import AdministrationIcon from '@mui/icons-material/BusinessCenter'

import edition, { Edition } from './edition'

import {
  FunctionComponent,
  ComponentType,
  ReactElement,
} from 'react';
import {
  SvgIconProps,
} from '@mui/material';

// Type for an icon component
type IconComponent = ComponentType<SvgIconProps>;

// Type for an object of icons
type Icons = {
  [key: string]: IconComponent | null;
};

const icons: Icons = {
  home: HomeIcon,
  users: PeopleIcon,
  user: AccountCircleIcon,
  login: LoginIcon,
  logout: LogoutIcon,
  more: MoreVertIcon,
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  remove: RemoveIcon,
  repeat: RepeatIcon,
  cluster: StorageIcon,
  deployment: DashboardIcon,
  view: ViewIcon,
  key: KeyIcon,
  settings: SettingsIcon,
  clipboard: ClipboardIcon,
  refresh: RefreshIcon,
  upArrow: UpArrowIcon,
  downArrow: DownArrowIcon,
  upload: UploadIcon,
  build: BuildIcon,
  viewArchive: ViewArchiveIcon,
  createArchive: CreateArchiveIcon,
  administration: AdministrationIcon,
}

type SideMenuProps = {
  loggedIn: boolean
  isSuperuser: boolean
  isAdmin: boolean
  handlers: {
    logout: () => void
  }
}

type Page = {
  title: string
  handler: string | (() => void)
  icon: IconComponent
  params?: {
    [key: string]: string
  }
}

type SideMenuPage = Page;

const separator: Page = { title: '-', handler: () => {}, icon: null };

const sideMenu = ({
  loggedIn,
  isSuperuser,
  isAdmin,
  handlers,
}: SideMenuProps): SideMenuPage[] => {
  if (loggedIn) {
    const pages: Page[] = [
      {
        title: 'Clusters',
        handler: 'clusters',
        icon: icons.cluster,
      },
      {
        title: 'Deployments',
        handler: 'deployments',
        params: {
          cluster: 'all',
        },
        icon: icons.deployment,
      },
    ];

    if (isSuperuser || isAdmin) {
      pages.push({
        title: 'Users',
        handler: 'users',
        icon: icons.users,
      });
    }

    if (isSuperuser) {
      pages.push({
        title: 'Administration',
        handler: 'administration',
        icon: icons.administration,
      });
    }

    return pages.concat([
      {
        title: 'Logout',
        handler: handlers.logout,
        icon: icons.logout,
      },
    ]);
  }

  return [
    {
      title: 'Login',
      handler: 'login',
      icon: icons.login,
    },
  ];
};

type AppbarMenuProps = {
  loggedIn: boolean;
  handlers: {
    logout: () => void;
  };
};

type AppbarMenuItem = Page;

const appbarMenu = ({
  loggedIn,
  handlers,
}: AppbarMenuProps): AppbarMenuItem[] => {
  if (loggedIn) {
    return [
      {
        title: 'Account Details',
        handler: 'accountdetails',
        icon: icons.user,
      },
      {
        title: 'Access Token',
        handler: 'accesstoken',
        icon: icons.key,
      },
      {
        title: 'Logout',
        handler: handlers.logout,
        icon: icons.logout,
      },
    ];
  }
  return [
    {
      title: 'Login',
      handler: 'login',
      icon: icons.login,
    },
  ];
};

export type Settings = {
  edition: Edition;
  title: string;
  api: string;
  devMode: boolean;
  snackbarAutoHide: number;
  sideMenuWidth: number;
  icons: Icons;
  sideMenu: (props: SideMenuProps) => SideMenuPage[];
  appbarMenu: (props: AppbarMenuProps) => AppbarMenuItem[];
};

const settings: Settings = {
  edition,
  title: 'Sextant',
  api: '/api/v1',
  devMode: process.env.NODE_ENV === 'development',
  snackbarAutoHide: 5000,
  sideMenuWidth: 250,
  icons,
  sideMenu,
  appbarMenu,
};

export default settings;
