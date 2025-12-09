import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

const Footer = () => (
  <Box className="bg-gray-900 text-white py-12 border-t border-gray-800">
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" className="font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Neuro Recommender
          </Typography>
          <Typography variant="body2" className="text-gray-400 mb-6">
            Empowering applications with intelligent recommendation systems.
          </Typography>
        </Grid>
        
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle2" className="font-bold mb-4 uppercase tracking-wider text-gray-500">Product</Typography>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/datasets" className="text-gray-400 hover:text-white transition-colors">Datasets</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
          </ul>
        </Grid>
        
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle2" className="font-bold mb-4 uppercase tracking-wider text-gray-500">Company</Typography>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
            <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" className="font-bold mb-4 uppercase tracking-wider text-gray-500">Stay Updated</Typography>
          <Typography variant="body2" className="text-gray-400 mb-4">
            Subscribe to our newsletter for the latest AI updates.
          </Typography>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-gray-800 border border-gray-700 rounded px-4 py-2 w-full text-white focus:outline-none focus:border-blue-500"
            />
            <Button variant="contained" className="bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </div>
        </Grid>
      </Grid>
      
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Neuro Recommender. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </Container>
  </Box>
);

export default Footer;
