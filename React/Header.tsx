import React, { useState } from 'react';
import { AppBar, Toolbar, Container, Stack } from '@mui/material';

import { MenuAppBar } from './MenuAppBar';
import { HeaderAvatar } from './HeaderAvatar';
import { Logo } from './Logo';
import { NavBar } from './NavBar';
import { HeaderProps } from './types';
import { MenuType } from 'constant';

export const Header: React.FC<HeaderProps> = ({ pages }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const mainMenu = pages.filter(({ menuType }) =>
    menuType.includes(MenuType.Main)
  );
  const secondaryMenu = pages.filter(({ menuType }) =>
    menuType.includes(MenuType.Secondary)
  );

  return (
    <AppBar
      position="relative"
      sx={{
        bgcolor: 'common.lightBackground',
        boxShadow: 0,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <MenuAppBar
            pages={mainMenu}
            anchorElNav={anchorElNav}
            handleOpenNavMenu={handleOpenNavMenu}
            handleCloseNavMenu={handleCloseNavMenu}
          />
          <Stack width="100%" direction="row" spacing={3} alignItems="center">
            <Logo />
            <NavBar pages={mainMenu} />
            <HeaderAvatar
              pages={secondaryMenu}
              anchorElUser={anchorElUser}
              handleOpenUserMenu={handleOpenUserMenu}
              handleCloseUserMenu={handleCloseUserMenu}
            />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
