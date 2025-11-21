import * as React from 'react';
import { Drawer, Box, IconButton, Tooltip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

interface TabItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface TabNavigationProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  width?: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab = 'experiments',
  onTabChange,
  width = 90,
}) => {
  const iconStyles = {
    fontSize: '24px',
    fontWeight: 300,
    lineHeight: '100%',
    letterSpacing: '0px',
    textAlign: 'center' as const,
    verticalAlign: 'middle',
  };

  const tabItems: TabItem[] = [
    {
      id: 'experiments',
      icon: <ScienceIcon sx={iconStyles} />,
      label: 'Experiments',
    },
    {
      id: 'users',
      icon: <PeopleIcon sx={iconStyles} />,
      label: 'Users',
    },
    {
      id: 'settings',
      icon: <SettingsIcon sx={iconStyles} />,
      label: 'Settings',
    },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f7',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 2,
          gap: 1,
        }}
      >
        {tabItems.map((item) => (
          <Tooltip key={item.id} title={item.label} placement="right">
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Active indicator - blue bar on left */}
              {activeTab === item.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: 48,
                    backgroundColor: '#1976d2',
                    borderRadius: '0 4px 4px 0',
                  }}
                />
              )}
              
              <IconButton
                onClick={() => handleTabClick(item.id)}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: activeTab === item.id ? '#e3f2fd' : 'transparent',
                  color: activeTab === item.id ? '#1976d2' : '#333333',
                  '&:hover': {
                    backgroundColor: activeTab === item.id ? '#e3f2fd' : '#e8e8ea',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {item.icon}
              </IconButton>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Drawer>
  );
};

export default TabNavigation;

