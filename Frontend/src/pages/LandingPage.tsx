import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  Flame, 
  History, 
  BarChart3, 
  Apple, 
  Upload, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight,
  Shield,
  Users,
  Target,
  Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import heroImage from '@/assets/hero_dashboard_mockup.png';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll to update header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'AI Food Recognition',
      description: 'Snap a photo of your meal and let our vision model instantly identify the ingredients and dish type with high precision.',
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      icon: Sparkles,
      title: 'Automatic Macro Analysis',
      description: 'Get real-time nutritional breakdowns including calories, proteins, carbohydrates, and healthy fats from simple plate photos.',
      color: 'text-secondary',
      bg: 'bg-secondary/10 border-secondary/20',
    },
    {
      icon: Flame,
      title: 'Calorie Target Tracking',
      description: 'Monitor your dynamic daily calorie intake versus your specific base energy expenditure and fitness goals.',
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
    },
    {
      icon: History,
      title: 'Meal Library & Log',
      description: 'Access a visual timeline of all your previous plates with rich details, time stamps, and automated analysis status.',
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/20',
    },
    {
      icon: BarChart3,
      title: 'Insightful Analytics',
      description: 'Identify habits, trace nutrient balance over time, and visualize your progress with weekly and monthly analytics reports.',
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      icon: Apple,
      title: 'AI Personal Coach',
      description: 'Receive personalized dietary advice, recipes, and habit feedback curated dynamically based on your eating habits.',
      color: 'text-secondary',
      bg: 'bg-secondary/10 border-secondary/20',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload a Meal Photo',
      description: 'Simply capture a quick snap of your plate using your phone camera or upload a saved food image into the dashboard.',
    },
    {
      number: '02',
      icon: Cpu,
      title: 'AI Nutrient Extraction',
      description: 'Our proprietary computer vision models segment the foods, compute weight estimations, and query our nutrient database.',
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Log Progress & Elevate',
      description: 'Instantly watch your daily nutrient charts update, receive tailored suggestions, and keep your calorie targets on track.',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Military-Grade Accuracy',
      detail: 'Powered by highly optimized deep neural vision networks trained on millions of diverse food images.',
    },
    {
      icon: Users,
      title: 'Personalized Coaching',
      detail: 'Tailored specifically to your current weight, activity level, dietary requirements, and health targets.',
    },
    {
      icon: Target,
      title: 'Microsecond Speeds',
      detail: 'Log an entire meal in under 3 seconds. No tedious manual database search or weighing required.',
    },
    {
      icon: Activity,
      title: 'Holistic Bio-Insights',
      detail: 'Integrate patterns and view deep trends of macro and micro nutrient consumption for a happier, healthier body.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30 selection:text-primary">
      {/* Decorative Radial Background Gradients */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/12 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />

      {/* --- STICKY NAVIGATION BAR --- */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-panel bg-surface-medium/80 shadow-lg shadow-black/25 backdrop-blur-md py-3 border-b border-slate-900/60' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary transition-transform group-hover:scale-105">
              <Camera className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NutriLens
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-sm font-medium text-slate-300 hover:text-primary transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium text-slate-300 hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-sm font-medium text-slate-300 hover:text-primary transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('benefits')} 
              className="text-sm font-medium text-slate-300 hover:text-primary transition-colors cursor-pointer"
            >
              Benefits
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="border-slate-800 hover:border-slate-700 text-slate-200"
            >
              Login
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => navigate('/signup')}
              className="px-5"
            >
              Sign Up
            </Button>
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-900 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-surface-medium border-b border-slate-900/90 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="px-6 py-6 flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-left py-2 font-medium text-slate-300 hover:text-primary border-b border-slate-900/50"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-left py-2 font-medium text-slate-300 hover:text-primary border-b border-slate-900/50"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-left py-2 font-medium text-slate-300 hover:text-primary border-b border-slate-900/50"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('benefits')} 
                className="text-left py-2 font-medium text-slate-300 hover:text-primary border-b border-slate-900/50"
              >
                Benefits
              </button>
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                  className="w-full border-slate-800 text-slate-200"
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/signup')}
                  className="w-full"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section 
        id="home" 
        className="relative pt-32 pb-24 md:pt-44 md:pb-36 flex items-center overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <Badge variant="primary" className="py-1 px-3.5 text-[10px] tracking-widest font-black uppercase text-primary border border-primary/25 bg-primary/5 rounded-full select-none shadow-sm shadow-primary/5 animate-pulse">
              ✨ Intelligent Nutrition Platform
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-slate-100">
              Smarter Nutrition <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Starts with AI.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl font-normal leading-relaxed">
              Ditch the complex spreadsheets and manual weight logs. With NutriLens, just snap a picture of your food, and our AI vision model estimates weights, computes caloric content, and tracks your daily goals instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-3">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02]"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('features')}
                className="border-slate-800 hover:border-slate-700 text-slate-300 hover:scale-[1.02]"
              >
                Explore Features
              </Button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-900/60 w-full max-w-md">
              <div className="space-y-0.5">
                <h4 className="text-2xl font-black text-slate-100">99.4%</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">AI Accuracy</p>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-2xl font-black text-slate-100">3s</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Scan Speed</p>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-2xl font-black text-slate-100">10k+</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Plates Logged</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Visual background rings/glow */}
            <div className="absolute h-[380px] w-[380px] rounded-full border border-primary/10 animate-[spin_60s_linear_infinite]" />
            <div className="absolute h-[460px] w-[460px] rounded-full border border-slate-900/40 animate-[spin_100s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-primary/10 to-secondary/5 blur-[80px] pointer-events-none" />

            {/* Main Phone Dashboard Mockup */}
            <div className="relative glass-panel border border-slate-800/80 rounded-[40px] p-3 shadow-2xl shadow-black/85 max-w-[340px] w-full z-10 transition-transform duration-500 hover:scale-[1.03]">
              <div className="overflow-hidden rounded-[32px] bg-[#0b0f0e] border border-slate-900">
                <img 
                  src={heroImage} 
                  alt="NutriLens Dashboard Mockup" 
                  className="w-full h-auto object-cover select-none"
                />
              </div>

              {/* Floating glass overlay indicators */}
              <div className="absolute -left-6 top-1/4 glass-panel border border-primary/20 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce [animation-duration:5s] z-20">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  🔥
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Logged Meal</p>
                  <p className="text-xs font-bold text-slate-100">420 kcal • Salad</p>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 glass-panel border border-secondary/20 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce [animation-duration:6s] z-20">
                <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">
                  🥗
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">AI Scan Status</p>
                  <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    Analyzed <CheckCircle2 className="h-3 w-3 text-secondary" />
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section 
        id="features" 
        className="relative py-24 md:py-32 bg-slate-950/20 border-t border-slate-900/60 z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="secondary" className="px-3 py-0.5 text-[9px] uppercase tracking-wider font-bold">
              Product Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              Equipped with Cutting-Edge AI
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
              We combined advanced neural architectures with comprehensive nutritional databases to deliver the most effortless health tracking package ever created.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                variant="glass" 
                hoverable 
                className="group relative flex flex-col justify-between border-slate-900 hover:border-slate-800 transition-all duration-300"
              >
                <Card.Content className="p-7 space-y-5 flex-1">
                  {/* Icon */}
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${feature.bg}`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>

                  <div className="space-y-2">
                    <Card.Title className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </Card.Title>
                    <p className="text-sm text-slate-400 leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section 
        id="how-it-works" 
        className="relative py-24 md:py-32 z-10"
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
            <Badge variant="accent" className="px-3 py-0.5 text-[9px] uppercase tracking-wider font-bold">
              User Experience
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              Plate to Metrics in Three Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
              No manual search. No guessing weights. Just a frictionless path to full awareness of what you consume daily.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6 relative">
            
            {/* Background connecting line (Desktop only) */}
            <div className="hidden lg:block absolute top-[70px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-900 z-0" />

            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="group relative flex flex-col items-center text-center px-4 z-10"
              >
                {/* Step Circle */}
                <div className="h-16 w-16 rounded-3xl bg-surface-medium border border-slate-800 flex items-center justify-center mb-6 relative transition-all duration-300 group-hover:border-primary group-hover:scale-105 shadow-md shadow-black/10">
                  <step.icon className="h-6 w-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                  
                  {/* Step Number Tag */}
                  <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-400 flex items-center justify-center group-hover:text-primary">
                    {step.number}
                  </span>
                </div>

                {/* Step Details */}
                <h3 className="text-lg font-bold text-slate-100 mb-2 transition-colors duration-200 group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section 
        id="benefits" 
        className="relative py-24 md:py-32 bg-slate-950/20 border-y border-slate-900/60 z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Sticky/Fixed-ish text headers */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4 text-left">
              <Badge variant="warning" className="px-3 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                Why NutriLens
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                Unlock Complete control over your macro targets
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
                Unlike traditional tracking tools which become tedious chores, NutriLens integrates smoothly with your daily life. It is designed to work efficiently, saving your time while yielding optimal, personalized suggestions.
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/signup')}
                rightIcon={<ChevronRight className="h-4 w-4" />}
                className="mt-2"
              >
                Join NutriLens Today
              </Button>
            </div>

            {/* Benefits Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <Card 
                  key={idx} 
                  variant="glass" 
                  hoverable 
                  className="border-slate-900/80 hover:border-slate-800 p-6 flex flex-col gap-4 text-left"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <benefit.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-extrabold text-slate-100 tracking-wide">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {benefit.detail}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* --- CALL TO ACTION (CTA) SECTION --- */}
      <section className="relative py-24 md:py-32 z-10 overflow-hidden">
        {/* Glow overlay inside the CTA container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-primary/10 blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6">
          <div className="relative glass-panel border border-slate-800/80 rounded-[40px] px-8 py-16 md:p-20 text-center overflow-hidden shadow-2xl">
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <Badge variant="primary" className="py-1 px-3 text-[9px] uppercase tracking-wider font-extrabold">
                Get Started Instantly
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-100 leading-[1.1]">
                Start Your Healthy Journey Today
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-lg font-normal leading-relaxed">
                Take control of your diet, understand your macro inputs, and build sustainable eating habits with your personalized AI scanner.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:scale-[1.02]"
                >
                  Create Free Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  className="border-slate-800 hover:border-slate-700 text-slate-200 hover:scale-[1.02]"
                >
                  Login to Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative bg-slate-950/80 border-t border-slate-900 pt-16 pb-8 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 text-left">
          
          {/* Column 1: Branding & Description */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary">
                <Camera className="h-4.5 w-4.5 text-background" />
              </div>
              <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NutriLens
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              A premium, AI-powered health assistant that helps you monitor macro and calorie intakes with simple meal pictures. Track metrics seamlessly, adapt recommendations, and stay healthy.
            </p>
          </div>

          {/* Column 2: Product Navigation */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollToSection('features')} className="text-slate-500 hover:text-primary transition-colors cursor-pointer text-left">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="text-slate-500 hover:text-primary transition-colors cursor-pointer text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('benefits')} className="text-slate-500 hover:text-primary transition-colors cursor-pointer text-left">
                  Benefits
                </button>
              </li>
              <li>
                <a href="#pricing" className="text-slate-500 hover:text-primary transition-colors">
                  Pricing (Mock)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Resources */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="text-slate-500 hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="text-slate-500 hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#blog" className="text-slate-500 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-500 hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legals */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Legals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#privacy" className="text-slate-500 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-slate-500 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-slate-500 hover:text-primary transition-colors">
                  Cookie Settings
                </a>
              </li>
              <li>
                <a href="#security" className="text-slate-500 hover:text-primary transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Socials & copyright bar */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} NutriLens Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors">
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors">
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors">
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors">
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
