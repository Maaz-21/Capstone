import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import { useToast } from '../components/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    showToast('Message sent! We will get back to you soon.', 'success');
    setEmail('');
    setMessage('');
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20">
      <Container maxWidth="md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <Typography variant="h3" className="font-bold text-gray-900 mb-4">
              Get in Touch
            </Typography>
            <Typography variant="h6" className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our recommendation engine? We'd love to hear from you.
            </Typography>
          </div>

          <Paper elevation={0} className="p-8 md:p-12 rounded-2xl shadow-xl bg-white max-w-lg mx-auto border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                className="bg-gray-50"
              />
              <TextField
                label="Message"
                multiline
                rows={4}
                fullWidth
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                className="bg-gray-50"
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                endIcon={<SendIcon />}
                className="bg-blue-600 hover:bg-blue-700 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Send Message
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
