import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Shield, 
  ArrowRight, 
  Users, 
  Bot, 
  Sparkles,
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Star,
  MessageSquare,
  Code,
  Zap,
  Lock,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from './Aurora';

export default function HomePage() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI-Powered Assistance",
      description: "Get instant help with our advanced AI system"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Support",
      description: "Connect with experts and other users"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Smart Solutions",
      description: "Intelligent answers to your questions"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Get instant responses to your queries with our optimized AI system"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise-grade security"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Natural Conversations",
      description: "Experience human-like interactions with our advanced language model"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Developer Friendly",
      description: "Easy integration with comprehensive API documentation"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "The AI Help Center has transformed how we handle customer support. Response times are down 80%!",
      avatar: "SJ"
    },
    {
      name: "David Chen",
      role: "Tech Lead",
      content: "Incredibly accurate responses and the integration was seamless. A game-changer for our team.",
      avatar: "DC"
    },
    {
      name: "Emma Wilson",
      role: "Customer Success",
      content: "Our customers love the instant, accurate responses. It's like having a 24/7 support team.",
      avatar: "EW"
    }
  ];

  const navItems = [
    {
      label: 'Products',
      items: [
        { label: 'Features', href: '/features' },
        { label: 'Solutions', href: '/solutions' },
        { label: 'Enterprise', href: '/enterprise' },
        { label: 'Pricing', href: '/pricing' }
      ]
    },
    {
      label: 'Resources',
      items: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api' },
        { label: 'Guides', href: '/guides' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      label: 'Company',
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Partners', href: '/partners' }
      ]
    }
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="bg-gray-900/90 backdrop-blur-md fixed w-full z-10 shadow-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center cursor-pointer"
                >
                  <MessageCircle className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI Help Center
                  </span>
                </motion.div>

                {/* Navigation Items */}
                <div className="hidden md:flex items-center space-x-6">
                  {navItems.map((item) => (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="px-2 py-2 text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                        {item.label}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                      
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 py-1"
                        >
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/auth/login')}
                  className="px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Login
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/auth/signup')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/login')}
                  className="flex items-center px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Admin
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Welcome to AI Help Center
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Get instant, intelligent assistance with our AI-powered help center. Fast, accurate, and always available.
              </p>

              {/* Learning Purpose Message */}
              <div className="bg-blue-900/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30 mb-12 max-w-2xl mx-auto">
                <p className="text-gray-300 text-lg">
                  This project was created for learning purposes by <span className="text-blue-400 font-semibold">Ajay Palvai</span>. 
                  It demonstrates the implementation of modern web technologies and AI integration. 
                  This is not a copied project - it's an original work showcasing my development skills.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth/signup')}
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg flex items-center mx-auto"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Developer Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-24 mb-24 max-w-4xl mx-auto"
            >
              <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden">
                    <img
                      src="/jpeg-optimizer_my pass photo.jpg"
                      alt="Ajay Palvai"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Ajay Palvai</h2>
                  <p className="text-blue-400 mb-4">Full Stack Developer / Data Science & ML</p>
                  
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    A passionate fresher skilled in React.js, Node.js, and Machine Learning, eager to build innovative and user-friendly applications. Graduated with a B.Tech in Computer Science (Data Science) from MGIT, Hyderabad (2024) and a Diploma in Computer Engineering from Bomma Institute (2021). Worked on projects like a YouTube Transcript Summarizer, Crypto Investment Website, Smart Resume Analyzer, and AI Help Center, showcasing expertise in React.js, FastAPI, NLP, authentication systems, and AI-driven automation. Committed to developing scalable and intelligent solutions that enhance user experiences.
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 mb-6">
                    <motion.a
                      href="https://github.com/Ajaypalvai07" 
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <Github className="h-6 w-6 text-white" />
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/ajay-palvai-384750210/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <Linkedin className="h-6 w-6 text-white" />
                    </motion.a>
                    <motion.a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=palvaiajay4730@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <Mail className="h-6 w-6 text-white" />
                    </motion.a>
                  </div>

                  <motion.a
                    href="https://www.linkedin.com/in/ajay-palvai-384750210/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Hire Me
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </motion.a>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">Fresher</div>
                    <div className="text-gray-400">Experience Level</div>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-lg font-bold text-white">Crypto Investment Website</div>
                    <div className="text-gray-400">Project 1</div>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-lg font-bold text-white">AI Help Centre</div>
                    <div className="text-gray-400">Project 2</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-700"
                >
                  <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-24 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-gray-300">Always Available</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">1s</div>
                <div className="text-gray-300">Response Time</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">99%</div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Benefits Section */}
        <section className="py-24 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience the future of customer support with our cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Don't just take our word for it - hear from some of our satisfied users
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{testimonial.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth/signup')}
                className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg inline-flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold text-white">AI Help Center</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Revolutionizing customer support with AI-powered solutions.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API Status</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cookie Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Security</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2024 AI Help Center. All rights reserved.
                </p>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className="text-gray-400 text-sm">Made with</span>
                  <Heart className="h-4 w-4 mx-1 text-red-500" />
                  <span className="text-gray-400 text-sm">by Ajay Palvai</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 