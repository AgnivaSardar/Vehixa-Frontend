import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import LiveEvaluation from './components/LiveEvaluation';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import MaintenanceInsights from './components/MaintainenceInsights';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <LiveEvaluation />
      <Dashboard />
      <Alerts />
      <MaintenanceInsights />
      <Footer />
    </div>
  );
}
