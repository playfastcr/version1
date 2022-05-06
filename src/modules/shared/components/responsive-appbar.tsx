import { AuthContext, AuthStatus } from '@context/auth.context';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Logo from '@playfast/assets/images/logo_text.png';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const ResponsiveAppBar = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const history = useHistory();
  const pages = ['INICIO', 'RETOS'];
  const [pagesPathname, setPagesPathname] = React.useState<string[]>(['/home', '/challenges']);

  const settings = ['Billetera digital', 'Salir'];
  const settingsPathname = ['/wallet', '/logout'];
  const logoutOptions = ['Ingresar', 'Registrarme'];
  const logoutOptionsPathname = ['/auth/sign-in', '/auth/sign-up'];
  const authContext = React.useContext(AuthContext);
  const [showAuthOptions, setShowAuthOptions] = useState<boolean>(true);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const location = useLocation();

  React.useEffect(() => {
    setButtonOptions();
  }, [authContext]);

  const setButtonOptions = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      setShowAuthOptions(false);
      const newPagesPathname = ['/home', '/challenges'];
      setPagesPathname(newPagesPathname);
    } else if (authContext.authStatus === AuthStatus.SignedOut) {
      setShowAuthOptions(true);
      const newPagesPathname = ['/home', '/auth/sign-in'];
      setPagesPathname(newPagesPathname);
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = useCallback(() => {
    handleCloseUserMenu();
    authContext.signOut();
    history.replace('../../home');
  }, [authContext]);

  const styles = {
    appbar: {
      background: '#121721',
    },
    container: {
      padding: '16px ',
      paddingLeft: '96px',
      paddingRight: '96px',
      background: '#121721',
      boxShadow:
        '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
    },
    link: {
      textDecoration: 'none',
      color: 'white',
    },
    active: {
      color: '#FFFFFF',
      textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      flex: 'none',
      borderBottom: '3px solid #5ACBB7',
      height: '32px',
    },
    inactive: {
      color: '#FFFFFF',
      textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      flex: 'none',
      height: '32px',
    },
    menuIcon: { fontSize: 24, cursor: 'pointer', fill: 'white' },
    iconButton: {
      p: 0,
      width: '40px',
      height: '40px',
      border: '1px solid #FFFFFF',
      boxSizing: 'border-box',
      borderRadius: '20px',
    },
    logoutIcon: {
      width: '16px',
      marginRight: '4px',
    },
    settingsMenu: {
      mt: '45px',
      '& .MuiPaper-root.MuiMenu-paper': {
        boxShadow: '0px 0px 0px 1px rgb(255 255 255 / 12%)',
      },
    },
    divider: {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      margin: '8px',
    },
    white: {
      color: '#FFFFFF',
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <AppBar sx={styles.appbar} position="static">
      <Container style={styles.container} maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <img src={Logo} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={styles.menuIcon} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, i) => {
                return (
                  <Link key={page} to={`..${pagesPathname[i]}`} style={styles.link}>
                    <MenuItem
                      style={
                        location.pathname.includes(pagesPathname[i])
                          ? styles.active
                          : styles.inactive
                      }
                      key={page}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  </Link>
                );
              })}
            </Menu>
          </Box>
          <Box component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <img src={Logo} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, i) => {
              return (
                <Link key={page} to={`..${pagesPathname[i]}`} style={styles.link}>
                  <Typography
                    textAlign="center"
                    style={
                      location.pathname.includes(pagesPathname[i]) ? styles.active : styles.inactive
                    }
                    variant="h6"
                    px={3}
                  >
                    {page}
                  </Typography>
                </Link>
              );
            })}
          </Box>
          {showAuthOptions && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Mi cuenta">
                <IconButton onClick={handleOpenUserMenu} sx={styles.iconButton}>
                  <PersonIcon sx={styles.menuIcon}></PersonIcon>
                </IconButton>
              </Tooltip>
              <Menu
                sx={styles.settingsMenu}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {logoutOptions.map((option, i) => (
                  <>
                    <Link key={option} to={`..${logoutOptionsPathname[i]}`} style={styles.link}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{option}</Typography>
                      </MenuItem>
                    </Link>
                    {option !== 'Registrarme' ? <Divider sx={styles.divider} /> : <></>}
                  </>
                ))}
              </Menu>
            </Box>
          )}
          {!showAuthOptions && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Abrir configuraciones">
                <IconButton onClick={handleOpenUserMenu} sx={styles.iconButton}>
                  <PersonIcon sx={styles.menuIcon}></PersonIcon>
                </IconButton>
              </Tooltip>
              <Menu
                sx={styles.settingsMenu}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, i) =>
                  setting === 'Salir' ? (
                    <MenuItem key={setting} onClick={signOut}>
                      <Logout sx={styles.logoutIcon}></Logout>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ) : (
                    <>
                      <Link key={setting} to={`..${settingsPathname[i]}`} style={styles.link}>
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      </Link>
                      <Divider sx={styles.divider} />
                    </>
                  )
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
