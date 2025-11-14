import { useState, useEffect } from 'react';
import './LandingPage.css';

interface Section {
  id: string;
  title: string;
  bgColor: string;
}

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections: Section[] = [
    { id: 'hero', title: 'Hero Section', bgColor: '#667eea' },
    { id: 'features', title: 'Features', bgColor: '#764ba2' },
    { id: 'about', title: 'About Us', bgColor: '#f093fb' },
    { id: 'pricing', title: 'Pricing', bgColor: '#4facfe' },
    { id: 'contact', title: 'Contact', bgColor: '#43e97b' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index].id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  };

  return (
    <div className="landing-page">
      {/* Navigation Dots */}
      <nav className="nav-dots">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`nav-dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to ${section.title}`}
          >
            <span className="tooltip">{section.title}</span>
          </button>
        ))}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="section" style={{ background: sections[0].bgColor }}>
        <div className="content">
          <h1 className="fade-in">Welcome to Your Product</h1>
          <p className="fade-in-delay">Build something amazing with our platform</p>
          <button className="cta-button fade-in-delay-2">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section" style={{ background: sections[1].bgColor }}>
        <div className="content">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Performance</h3>
              <p>Lightning-fast load times and smooth interactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Enterprise-grade security with Clerk authentication</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile First</h3>
              <p>Responsive design that works on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section" style={{ background: sections[2].bgColor }}>
        <div className="content">
          <h2>About Us</h2>
          <p className="about-text">
            We're building the future of web applications with modern technology
            and thoughtful design. Our mission is to empower developers and businesses
            to create amazing digital experiences.
          </p>
          <div className="stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section" style={{ background: sections[3].bgColor }}>
        <div className="content">
          <h2>Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">$0<span>/month</span></div>
              <ul>
                <li>✓ Basic features</li>
                <li>✓ 1 user</li>
                <li>✓ Community support</li>
              </ul>
              <button className="pricing-button">Start Free</button>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Popular</div>
              <h3>Pro</h3>
              <div className="price">$29<span>/month</span></div>
              <ul>
                <li>✓ All features</li>
                <li>✓ 10 users</li>
                <li>✓ Priority support</li>
                <li>✓ Advanced analytics</li>
              </ul>
              <button className="pricing-button">Get Started</button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price">Custom</div>
              <ul>
                <li>✓ Unlimited users</li>
                <li>✓ Custom features</li>
                <li>✓ Dedicated support</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <button className="pricing-button">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ background: sections[4].bgColor }}>
        <div className="content">
          <h2>Get In Touch</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows={5} required></textarea>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
          <div className="social-links">
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;