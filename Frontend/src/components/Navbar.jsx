import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '../context/AuthContext';
import { useToast } from './ToastProvider';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [open, setOpen] = useState(false);
    
    const isLanding = location.pathname === '/';

    const doLogout = async () => {
        await logout();
        showToast('Logged out', 'success');
        navigate('/');
    };

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        setOpen(false);
    };

    const handleLogoClick = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            if (location.pathname !== '/') {
                navigate('/');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setOpen(false);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setOpen(false);
    };

    const LandingLinks = () => (
        <>
            <Button color="inherit" onClick={scrollToTop}>Home</Button>
            <Button color="inherit" onClick={() => scrollToSection('features')}>Features</Button>
            <Button color="inherit" onClick={() => scrollToSection('how-it-works')}>How It Works</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>
        </>
    );

    const AppLinks = () => (
        <>
            <Button color="inherit" component={Link} to="/dashboard">Home</Button>
            <Button color="inherit" component={Link} to="/favorites">Watchlist</Button>
            <Button color="inherit" component={Link} to="/datasets">Datasets</Button>
        </>
    );

    return (
        <>
            <AppBar position="sticky" color="default" elevation={0} className="border-b bg-white/80 backdrop-blur-md">
                <Toolbar className="container mx-auto justify-between">
                    <div className="flex items-center gap-2">
                        <IconButton edge="start" onClick={() => setOpen(true)} className="md:hidden">
                            <MenuIcon />
                        </IconButton>
                        <Typography 
                            variant="h6" 
                            component="div" 
                            onClick={handleLogoClick}
                            className="font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Neuro Recommender
                        </Typography>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {isLanding ? <LandingLinks /> : <AppLinks />}
                        
                        {user ? (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                        {user.email ? user.email[0].toUpperCase() : 'U'}
                                    </Avatar>
                                    <Typography variant="body2" className="text-gray-600 hidden lg:block font-medium">
                                        Profile
                                    </Typography>
                                </div>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={doLogout}
                                    size="small"
                                >
                                    Logout
                                </Button>
                                {isLanding && (
                                    <Button 
                                        variant="contained" 
                                        component={Link} 
                                        to="/dashboard"
                                        disableElevation
                                    >
                                        Dashboard
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-4">
                                <Button 
                                    component={Link} 
                                    to="/auth" 
                                    variant="contained" 
                                    disableElevation
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 260 }} role="presentation">
                    <div className="p-4 border-b">
                        <Typography variant="h6" className="font-bold text-blue-600">
                            Neuro Recommender
                        </Typography>
                    </div>
                    <List>
                        {isLanding ? (
                            <>
                                <ListItemButton onClick={scrollToTop}><ListItemText primary="Home" /></ListItemButton>
                                <ListItemButton onClick={() => scrollToSection('features')}><ListItemText primary="Features" /></ListItemButton>
                                <ListItemButton onClick={() => scrollToSection('how-it-works')}><ListItemText primary="How It Works" /></ListItemButton>
                                <ListItemButton component={Link} to="/about" onClick={() => setOpen(false)}><ListItemText primary="About" /></ListItemButton>
                                <ListItemButton component={Link} to="/contact" onClick={() => setOpen(false)}><ListItemText primary="Contact" /></ListItemButton>
                            </>
                        ) : (
                            <>
                                <ListItemButton component={Link} to="/datasets" onClick={() => setOpen(false)}><ListItemText primary="Datasets" /></ListItemButton>
                                <ListItemButton component={Link} to="/dashboard" onClick={() => setOpen(false)}><ListItemText primary="Dashboard" /></ListItemButton>
                            </>
                        )}
                        
                        <div className="my-2 border-t border-gray-100" />
                        
                        {user ? (
                            <>
                                <ListItem><ListItemText primary={user.email} secondary="Logged in" /></ListItem>
                                <ListItemButton onClick={() => { setOpen(false); doLogout(); }}>
                                    <ListItemText primary="Logout" className="text-red-600" />
                                </ListItemButton>
                            </>
                        ) : (
                            <ListItemButton component={Link} to="/auth" onClick={() => setOpen(false)}>
                                <ListItemText primary="Sign In / Register" className="text-blue-600 font-medium" />
                            </ListItemButton>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Navbar;
