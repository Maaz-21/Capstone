import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Paper elevation={0} className="p-8 rounded-2xl shadow-xl bg-white border border-gray-100">
          {user ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PersonIcon className="text-blue-600 text-3xl" />
              </div>
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                Welcome back!
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-6">
                Signed in as {user.email}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => logout()}
                fullWidth
                size="large"
                className="border-2"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <Typography variant="h4" className="font-bold text-white-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {isLogin ? 'Enter your credentials to access your account' : 'Get started with your free account today'}
                </Typography>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg mb-6 text-sm flex items-center gap-2"
                >
                  <span className="font-medium">Error:</span> {error}
                </motion.div>
              )}

              <form onSubmit={submit} className="space-y-5">
                {!isLogin && (
                  <TextField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 py-3 text-lg shadow-lg hover:shadow-xl transition-all normal-case"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:bg-blue-50 normal-case font-medium"
                  >
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Paper>
      </motion.div>
    </div>
  );
}
