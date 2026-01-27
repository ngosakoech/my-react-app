import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  Event,
  Description,
  HowToVote,
  AttachMoney,
  Assessment,
  Settings,
  Gavel,
  Groups
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/auth.types';

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.SUBCOMMITTEE_MEMBER, UserRole.CHAIRPERSON, UserRole.SECRETARY]
  },
  {
    title: 'Meetings',
    icon: <Event />,
    path: '/meetings',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.CHAIRPERSON, UserRole.SECRETARY]
  },
  {
    title: 'Documents',
    icon: <Description />,
    path: '/documents',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.SUBCOMMITTEE_MEMBER, UserRole.CHAIRPERSON, UserRole.SECRETARY]
  },
  {
    title: 'Voting',
    icon: <HowToVote />,
    path: '/voting',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.CHAIRPERSON]
  },
  {
    title: 'Loan Applications',
    icon: <AttachMoney />,
    path: '/loans',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.SUBCOMMITTEE_MEMBER]
  },
  {
    title: 'Members',
    icon: <People />,
    path: '/members',
    roles: [UserRole.ADMIN]
  },
  {
    title: 'Committees',
    icon: <Groups />,
    path: '/committees',
    roles: [UserRole.ADMIN, UserRole.CHAIRPERSON]
  },
  {
    title: 'Reports',
    icon: <Assessment />,
    path: '/reports',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.CHAIRPERSON]
  },
  {
    title: 'Resolutions',
    icon: <Gavel />,
    path: '/resolutions',
    roles: [UserRole.ADMIN, UserRole.BOARD_MEMBER, UserRole.SECRETARY]
  },
  {
    title: 'Settings',
    icon: <Settings />,
    path: '/settings',
    roles: [UserRole.ADMIN]
  }
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

const drawerWidth = 240;

export const Sidebar = ({ open, onClose, userRole = UserRole.BOARD_MEMBER }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'inherit' : 'text.secondary'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};
