import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Box, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import RecommendIcon from '@mui/icons-material/Recommend';
import Footer from '../components/Footer';

const HeroSection = () => (
  <Box className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-20 pb-32">
    <Container maxWidth="lg" className="relative z-10">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h1" 
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
          >
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Recommendations</span>
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h5" className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Unlock the power of neural networks to deliver personalized content, products, and insights. 
            Simple, scalable, and secure.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            component={Link} 
            to="/auth" 
            variant="contained" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Free
          </Button>
          <Button 
            component={Link} 
            to="/about" 
            variant="outlined" 
            size="large"
            className="px-8 py-4 text-lg rounded-full border-2 border-gray-300 hover:border-gray-400 text-gray-700"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </Container>
    
    {/* Abstract Background Shapes */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-30 pointer-events-none">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
  </Box>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <CardContent className="p-8 flex flex-col items-start h-full">
        <Avatar className="bg-blue-50 text-blue-600 w-14 h-14 mb-6">
          {icon}
        </Avatar>
        <Typography variant="h5" className="font-bold mb-3 text-gray-900">
          {title}
        </Typography>
        <Typography variant="body1" className="text-gray-600 leading-relaxed">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const FeaturesSection = () => (
  <Box id="features" className="py-24 bg-white">
    <Container maxWidth="lg">
      <div className="text-center mb-16">
        <Typography variant="overline" className="text-blue-600 font-bold tracking-wider uppercase">
          Features
        </Typography>
        <Typography variant="h3" className="font-bold text-gray-900 mt-2 mb-4">
          Why Choose Neuro Recommender?
        </Typography>
        <Typography variant="h6" className="text-gray-500 max-w-2xl mx-auto">
          Built for performance, designed for simplicity. Everything you need to build a recommendation engine.
        </Typography>
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FeatureCard 
            icon={<AutoAwesomeIcon fontSize="large" />}
            title="Smart Algorithms"
            description="Utilize state-of-the-art neural collaborative filtering to understand user preferences deeply."
            delay={0}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard 
            icon={<SpeedIcon fontSize="large" />}
            title="Real-time Processing"
            description="Get recommendations in milliseconds. Optimized for high-throughput and low-latency environments."
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard 
            icon={<DataUsageIcon fontSize="large" />}
            title="Data Insights"
            description="Visualize your dataset distribution and model performance with our intuitive dashboard."
            delay={0.4}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const HowItWorksSection = () => (
  <Box id="how-it-works" className="py-24 bg-gray-50">
    <Container maxWidth="lg">
      <div className="text-center mb-16">
        <Typography variant="overline" className="text-blue-600 font-bold tracking-wider uppercase">
          Process
        </Typography>
        <Typography variant="h3" className="font-bold text-gray-900 mt-2 mb-4">
          How It Works
        </Typography>
        <Typography variant="h6" className="text-gray-500 max-w-2xl mx-auto">
          Three simple steps to get personalized recommendations for your users.
        </Typography>
      </div>

      <Grid container spacing={8} className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0 transform -translate-y-1/2"></div>

        <Grid item xs={12} md={4} className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center bg-gray-50 p-4"
          >
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 border-4 border-blue-100">
              <SettingsInputComponentIcon className="text-blue-600 text-4xl" />
            </div>
            <Typography variant="h5" className="font-bold mb-2">1. Connect Data</Typography>
            <Typography variant="body1" className="text-gray-600">
              Upload your user-item interaction datasets or connect your API.
            </Typography>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4} className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center bg-gray-50 p-4"
          >
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 border-4 border-blue-100">
              <ModelTrainingIcon className="text-blue-600 text-4xl" />
            </div>
            <Typography variant="h5" className="font-bold mb-2">2. Train Model</Typography>
            <Typography variant="body1" className="text-gray-600">
              Our engine trains a neural collaborative filtering model on your data.
            </Typography>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4} className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center text-center bg-gray-50 p-4"
          >
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 border-4 border-blue-100">
              <RecommendIcon className="text-blue-600 text-4xl" />
            </div>
            <Typography variant="h5" className="font-bold mb-2">3. Get Recommendations</Typography>
            <Typography variant="body1" className="text-gray-600">
              Receive real-time, personalized recommendations for every user.
            </Typography>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  </Box>
);



function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default Landing;
