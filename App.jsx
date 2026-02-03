import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Scroll-triggered animation hook ─── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const FadeIn = ({ children, delay = 0, direction = 'up', style = {} }) => {
  const [ref, inView] = useInView(0.1);
  const transforms = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(40px)', right: 'translateX(-40px)', none: 'none' };
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : transforms[direction], transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
};

/* ─── Image helper — Unsplash (works on real deployment) ─── */
const unsplash = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMAGES = {
  hero: unsplash('1507525428034-b723cf961d3e', 1800),
  transfer: unsplash('1549317661-bd32c8ce0afe', 800),
  chef: unsplash('1556910103-1c02745aae4d', 800),
  yacht: unsplash('1540946485063-a40da27545f8', 800),
  wine: unsplash('1506377247377-2a5b3b417ebb', 800),
  spa: unsplash('1544161515-4ab6ce6db874', 800),
  restaurant: unsplash('1414235077428-338989a2e8c0', 800),
  sintra: unsplash('1555881400-74d7acaacd6b', 800),
  groceries: unsplash('1542838132-92c53300491e', 800),
  photography: unsplash('1452587925148-ce544e77e70d', 800),
  beach: unsplash('1507525428034-b723cf961d3e', 800),
  golf: unsplash('1535131749006-b7f58c99034b', 800),
  fado: unsplash('1558618666-fcd25c85f7e7', 800),
  romantic: unsplash('1518998053901-5348d3961a04', 800),
  family: unsplash('1502086943666-2bd500bca4e5', 800),
  golfpkg: unsplash('1587174486073-ae5e7f7af439', 800),
  about1: unsplash('1555881400-74d7acaacd6b', 500),
  about2: unsplash('1414235077428-338989a2e8c0', 400),
  about3: unsplash('1540946485063-a40da27545f8', 400),
};

const AlemWebsite = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeService, setActiveService] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [heroOffset, setHeroOffset] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', arrival: '', departure: '',
    guests: '2', services: [], message: '', budget: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setHeroOffset(window.scrollY * 0.35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = useCallback((id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const services = [
    { id: 1, title: "Private Airport Transfer", subtitle: "Arrive in style", category: "transport", description: "Luxury vehicle collection from Lisbon Airport with champagne service. Mercedes S-Class, Range Rover, or vintage convertibles available.", price: 180, priceLabel: "From €180", duration: "Per journey", includes: ["Meet & greet at arrivals", "Complimentary champagne", "WiFi on board", "Child seats available"], image: IMAGES.transfer },
    { id: 2, title: "Private Chef Experience", subtitle: "Culinary artistry", category: "dining", description: "Michelin-trained chefs prepare bespoke multi-course experiences in your villa. Portuguese gastronomy reimagined, paired with exceptional wines.", price: 450, priceLabel: "From €450", duration: "Per evening", includes: ["5-course tasting menu", "Wine pairing", "All ingredients", "Kitchen cleanup"], image: IMAGES.chef },
    { id: 3, title: "Yacht Charter", subtitle: "The Atlantic awaits", category: "experiences", description: "Private sailing along the Cascais coastline. Sunset cruises to Sintra's dramatic cliffs, swimming in hidden coves, champagne on deck.", price: 1200, priceLabel: "From €1,200", duration: "Half day (4hrs)", includes: ["Captain & crew", "Champagne & canapés", "Swimming stops", "Fishing equipment"], image: IMAGES.yacht },
    { id: 4, title: "Wine Experiences", subtitle: "Terroir & tradition", category: "experiences", description: "Private tastings at prestigious quintas in the Setúbal and Colares regions. Meet winemakers, explore cellars, discover rare vintages.", price: 380, priceLabel: "From €380", duration: "Per person", includes: ["2-3 winery visits", "Private guide", "Luxury transport", "Gourmet lunch"], image: IMAGES.wine },
    { id: 5, title: "In-Villa Spa", subtitle: "Restoration", category: "wellness", description: "Expert therapists deliver spa experiences at your residence. Massage, facials, private yoga sessions with ocean views.", price: 220, priceLabel: "From €220", duration: "Per session", includes: ["Licensed therapist", "Premium products", "60-90 minute session", "Aromatherapy"], image: IMAGES.spa },
    { id: 6, title: "VIP Restaurant Access", subtitle: "Doors open", category: "dining", description: "Reservations at Portugal's most coveted tables. Belcanto, Alma, Fortaleza do Guincho—secured with a single message.", price: 0, priceLabel: "Complimentary", duration: "For guests", includes: ["Priority reservations", "Best tables", "Special occasions arranged", "Dietary coordination"], image: IMAGES.restaurant },
    { id: 7, title: "Sintra Day Trip", subtitle: "Palaces & wonder", category: "experiences", description: "Private tour of UNESCO-listed Sintra. Pena Palace, Quinta da Regaleira's mystical gardens, and the Moorish Castle ruins.", price: 480, priceLabel: "From €480", duration: "Full day", includes: ["Private guide", "Skip-the-line tickets", "Luxury transport", "Gourmet lunch"], image: IMAGES.sintra },
    { id: 8, title: "Pre-Arrival Provisioning", subtitle: "Every detail", category: "convenience", description: "Your villa stocked before you arrive. Premium Portuguese products, specific requests, dietary requirements—handled seamlessly.", price: 150, priceLabel: "From €150", duration: "+ product cost", includes: ["Premium groceries", "Wine selection", "Fresh flowers", "Special requests"], image: IMAGES.groceries },
    { id: 9, title: "Private Photography", subtitle: "Moments preserved", category: "experiences", description: "Professional photographers capture your Portuguese journey. Golden hour sessions at Pena Palace, candid family moments, editorial portraits.", price: 400, priceLabel: "From €400", duration: "2 hours", includes: ["Professional photographer", "50+ edited photos", "Online gallery", "Print-ready files"], image: IMAGES.photography },
    { id: 10, title: "Arrábida Beach Day", subtitle: "Hidden paradise", category: "experiences", description: "Escape to Arrábida's pristine coastline. Crystal-clear waters, hidden coves, and a seafood lunch at a fisherman's taverna.", price: 420, priceLabel: "From €420", duration: "Full day", includes: ["Private transport", "Beach setup", "Seafood lunch", "Snorkeling gear"], image: IMAGES.beach },
    { id: 11, title: "Golf Concierge", subtitle: "Tee time secured", category: "experiences", description: "Access to Portugal's finest courses. Penha Longa, Oitavos Dunes, Quinta da Marinha—with equipment rental and caddie arranged.", price: 350, priceLabel: "From €350", duration: "Per round", includes: ["Premium tee times", "Club rental available", "Caddie arrangement", "Transport"], image: IMAGES.golf },
    { id: 12, title: "Fado Evening", subtitle: "Soul of Portugal", category: "dining", description: "An intimate evening of traditional Fado music in Lisbon's Alfama district. Dinner at a historic casa de fado with premium seating.", price: 280, priceLabel: "From €280", duration: "Evening", includes: ["Reserved seating", "Traditional dinner", "Wine included", "Private transport"], image: IMAGES.fado }
  ];

  const categories = [
    { id: 'all', label: 'All' }, { id: 'experiences', label: 'Experiences' }, { id: 'dining', label: 'Dining' },
    { id: 'wellness', label: 'Wellness' }, { id: 'transport', label: 'Transport' }, { id: 'convenience', label: 'Convenience' }
  ];

  const filteredServices = activeFilter === 'all' ? services : services.filter(s => s.category === activeFilter);

  const packages = [
    { id: 1, title: "Romantic Escape", duration: "3 Days", price: "€2,400", description: "Sunset yacht cruise, private chef dinner, couples spa, Sintra day trip", image: IMAGES.romantic, highlights: ["Sunset yacht cruise", "Private chef (2 evenings)", "Couples massage", "Sintra private tour", "Airport transfers"] },
    { id: 2, title: "Family Adventure", duration: "5 Days", price: "€3,800", description: "Beach days, palace tours, cooking class, dolphin watching", image: IMAGES.family, highlights: ["Arrábida beach day", "Sintra palaces tour", "Family cooking class", "Dolphin watching trip", "Pre-stocked groceries", "Airport transfers"] },
    { id: 3, title: "Golf & Gastronomy", duration: "4 Days", price: "€3,200", description: "Three rounds at top courses, wine tasting, Michelin dining", image: IMAGES.golfpkg, highlights: ["3 premium golf rounds", "Wine country tour", "2 Michelin dinners", "Private chef evening", "Luxury transfers"] }
  ];

  const testimonials = [
    { name: "James & Sophie M.", location: "London, UK", text: "Além transformed our anniversary trip into something magical. The sunset yacht cruise was unforgettable, and the private chef dinner—prepared in our villa while we watched the stars—was the highlight of our year.", rating: 5, initials: "JS", color: "#2C3E50" },
    { name: "The Rodriguez Family", location: "Miami, USA", text: "Traveling with three kids can be stressful, but Além handled everything. From the car seats in our airport transfer to kid-friendly restaurant bookings—they thought of details we didn't even consider.", rating: 5, initials: "RF", color: "#8E6B47" },
    { name: "Henrik L.", location: "Stockholm, Sweden", text: "I've used concierge services worldwide. Além is different—personal, responsive, and genuinely knowledgeable. They secured a tee time at Oitavos that I'd been told was impossible. Worth every euro.", rating: 5, initials: "HL", color: "#34495E" },
    { name: "Marie-Claire D.", location: "Paris, France", text: "The wine tour exceeded all expectations. Our guide knew every winemaker personally. We discovered bottles we'd never find in Paris and had them shipped home. Exceptional service from start to finish.", rating: 5, initials: "MC", color: "#6B4E3D" }
  ];

  const partners = [
    { name: "Penha Longa Resort", type: "Golf Partner" },
    { name: "Quinta da Bacalhôa", type: "Wine Partner" },
    { name: "Cascais Yacht Club", type: "Maritime Partner" },
    { name: "Chef António Mendes", type: "Culinary Partner" },
  ];

  const faqs = [
    { q: "How far in advance should I book?", a: "We recommend booking at least 7 days in advance for most services, and 2-3 weeks for yacht charters, private chefs, and popular experiences during peak season (June-September). However, we're experts at last-minute arrangements—just reach out and we'll do everything possible." },
    { q: "What's your cancellation policy?", a: "More than 7 days before: Full refund minus 10% admin fee. 3-7 days before: 50% refund. Less than 3 days or no-show: No refund. Weather-dependent activities receive full refunds if we cancel due to conditions." },
    { q: "How do payments work?", a: "We require a 50% deposit to confirm your booking, with the balance due 48 hours before your experience. We accept all major credit cards, bank transfer, and PayPal. All prices are in Euros and include VAT." },
    { q: "Do you only serve guests staying in Cascais?", a: "While we're based in Cascais, we serve guests staying anywhere in the Lisbon coast region—Cascais, Estoril, Sintra, and Lisbon itself. Transport can be arranged from any location." },
    { q: "Can you accommodate dietary restrictions?", a: "Absolutely. All our culinary partners are experienced with vegetarian, vegan, gluten-free, kosher, halal, and allergy-specific requirements. Just let us know when booking." },
    { q: "What if something goes wrong?", a: "We're available 24/7 on WhatsApp. If any issue arises, contact us immediately and we'll resolve it. We personally vet all partners and stand behind every experience we book." }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Required';
    if (!formData.email.trim()) errors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Required';
    if (!formData.arrival) errors.arrival = 'Required';
    if (!formData.departure) errors.departure = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) setFormSubmitted(true);
  };

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif", backgroundColor: '#FAFAF8', color: '#1A1A1A', overflowX: 'hidden' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        
        .nav-link { position: relative; color: inherit; text-decoration: none; font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; cursor: pointer; transition: color 0.3s; padding: 8px 0; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #C9A96E; transition: width 0.3s; }
        .nav-link:hover { color: #C9A96E; }
        .nav-link:hover::after { width: 100%; }
        
        .card { cursor: pointer; transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); background: #FFF; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .card:hover { transform: translateY(-10px); box-shadow: 0 24px 48px rgba(0,0,0,0.12); }
        .card-img { transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .card:hover .card-img { transform: scale(1.08); }
        
        .btn { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; padding: 16px 36px; border: none; cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); border-radius: 2px; }
        .btn-dark { background: #1A1A1A; color: #FFF; }
        .btn-dark:hover { background: #C9A96E; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,169,110,0.3); }
        .btn-outline { background: transparent; color: #1A1A1A; border: 1px solid #1A1A1A; }
        .btn-outline:hover { background: #1A1A1A; color: #FFF; transform: translateY(-2px); }
        .btn-gold { background: #C9A96E; color: #FFF; }
        .btn-gold:hover { background: #B8986A; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,169,110,0.3); }
        .btn-white { background: transparent; color: #FFF; border: 1px solid rgba(255,255,255,0.5); }
        .btn-white:hover { background: #FFF; color: #1A1A1A; }
        
        .filter-btn { font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 10px 20px; background: transparent; color: #666; border: 1px solid #E0E0E0; cursor: pointer; transition: all 0.3s; border-radius: 24px; }
        .filter-btn:hover, .filter-btn.active { background: #1A1A1A; color: #FFF; border-color: #1A1A1A; }
        
        input, textarea, select { font-family: 'Montserrat', sans-serif; font-size: 14px; padding: 14px 16px; width: 100%; border: 1px solid #E0E0E0; background: #FFF; outline: none; transition: border-color 0.3s; border-radius: 4px; color: #1A1A1A; }
        input:focus, textarea:focus, select:focus { border-color: #C9A96E; }
        .input-error { border-color: #E57373 !important; }
        
        .faq-item { border-bottom: 1px solid #E8E8E8; cursor: pointer; transition: background 0.3s; }
        .faq-item:hover { background: #FAFAF8; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .faq-answer.open { max-height: 250px; }
        
        .whatsapp-btn { position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 24px rgba(37,211,102,0.4); z-index: 1000; transition: all 0.3s; text-decoration: none; }
        .whatsapp-btn:hover { transform: scale(1.1) translateY(-2px); box-shadow: 0 8px 32px rgba(37,211,102,0.5); }
        
        .mobile-menu { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #1A1A1A; z-index: 999; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 36px; opacity: 0; pointer-events: none; transition: opacity 0.4s; }
        .mobile-menu.open { opacity: 1; pointer-events: auto; }
        .mobile-menu .nav-link { color: #FFF; font-size: 16px; letter-spacing: 4px; }
        .mobile-menu .nav-link::after { background: #C9A96E; }
        
        .hamburger { display: none; flex-direction: column; gap: 6px; cursor: pointer; z-index: 1001; padding: 8px; }
        .hamburger span { width: 24px; height: 1.5px; background: #1A1A1A; transition: all 0.3s; }
        .hamburger.scrolled span { background: #1A1A1A; }
        .hamburger.open span { background: #FFF; }
        .hamburger.open span:first-child { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:last-child { transform: rotate(-45deg) translate(5px, -5px); }
        
        @media (max-width: 768px) { .hamburger { display: flex; } .desktop-nav { display: none !important; } }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal-content { background: #FFF; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 12px; position: relative; }
        .modal-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; background: #FFF; border: none; cursor: pointer; z-index: 10; border-radius: 50%; font-size: 22px; box-shadow: 0 2px 12px rgba(0,0,0,0.15); transition: transform 0.3s; display: flex; align-items: center; justify-content: center; }
        .modal-close:hover { transform: rotate(90deg); }
        
        .stars { color: #C9A96E; font-size: 16px; letter-spacing: 4px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: #DDD; cursor: pointer; transition: all 0.4s; }
        .dot.active { background: #C9A96E; transform: scale(1.4); }

        .trust-item { display: flex; align-items: center; gap: 10px; font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #888; }
        .trust-icon { width: 20px; height: 20px; opacity: 0.5; }

        ::selection { background: #C9A96E; color: #FFF; }
      `}</style>

      {/* ─── Navigation ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: scrolled ? '14px 32px' : '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, background: scrolled ? 'rgba(250,250,248,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.05)' : 'none', transition: 'all 0.4s' }}>
        <div onClick={() => scrollToSection('hero')} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 400, letterSpacing: '8px', cursor: 'pointer', color: scrolled ? '#1A1A1A' : '#1A1A1A' }}>ALÉM</div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          <span className="nav-link" onClick={() => scrollToSection('services')}>Services</span>
          <span className="nav-link" onClick={() => scrollToSection('packages')}>Packages</span>
          <span className="nav-link" onClick={() => scrollToSection('about')}>About</span>
          <span className="nav-link" onClick={() => scrollToSection('faq')}>FAQ</span>
          <button className="btn btn-dark" onClick={() => scrollToSection('booking')} style={{ padding: '12px 24px', marginLeft: '8px' }}>Book Now</button>
        </div>
        <div className={`hamburger ${menuOpen ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span></div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <span className="nav-link" onClick={() => scrollToSection('hero')}>Home</span>
        <span className="nav-link" onClick={() => scrollToSection('services')}>Services</span>
        <span className="nav-link" onClick={() => scrollToSection('packages')}>Packages</span>
        <span className="nav-link" onClick={() => scrollToSection('about')}>About</span>
        <span className="nav-link" onClick={() => scrollToSection('faq')}>FAQ</span>
        <button className="btn btn-gold" onClick={() => scrollToSection('booking')} style={{ marginTop: '16px' }}>Book Now</button>
      </div>

      {/* ─── Hero ─── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '120%', transform: `translateY(-${heroOffset}px)` }}>
          <img src={IMAGES.hero} alt="Cascais Coast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(100deg, rgba(250,250,248,0.96) 0%, rgba(250,250,248,0.85) 45%, rgba(250,250,248,0.15) 100%)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, padding: '0 32px', maxWidth: '620px', marginLeft: '6%' }}>
          <FadeIn delay={0.1}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '20px' }}>Cascais · Sintra · Lisbon</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 style={{ fontSize: 'clamp(44px, 8vw, 76px)', fontWeight: 300, lineHeight: 1.05, marginBottom: '28px', letterSpacing: '-1px' }}>
              Beyond<br /><span style={{ fontStyle: 'italic', fontWeight: 300 }}>the stay</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.35}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', lineHeight: 1.9, color: '#555', maxWidth: '420px', marginBottom: '36px' }}>Private concierge services for discerning travelers. Yacht charters, private chefs, curated experiences—every detail handled.</p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => scrollToSection('booking')}>Start Planning</button>
              <button className="btn btn-outline" onClick={() => scrollToSection('services')}>View Services</button>
            </div>
          </FadeIn>
          <FadeIn delay={0.65}>
            <div style={{ display: 'flex', gap: '40px', marginTop: '56px', paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              {[{ n: '200+', l: 'Guests served' }, { n: '4.9★', l: 'Average rating' }, { n: '24/7', l: 'Availability' }].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: '26px', fontWeight: 300, color: '#C9A96E' }}>{s.n}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999', marginTop: '4px' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Trust Bar ─── */}
      <section style={{ background: '#FFF', borderBottom: '1px solid #F0F0F0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {['Trusted by 200+ guests', 'Secure payments', 'Free cancellation on select services', '24/7 WhatsApp support'].map((t, i) => (
            <div key={i} className="trust-item">
              <span style={{ color: '#C9A96E', fontSize: '14px' }}>✓</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ background: '#1A1A1A', color: '#FFF', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '16px' }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300, marginBottom: '60px' }}>Three steps to extraordinary</h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
            {[
              { n: '01', t: 'Tell Us Your Vision', d: 'Share your dates, interests, and preferences via WhatsApp or our booking form.' },
              { n: '02', t: 'We Curate & Confirm', d: 'Receive a personalized itinerary and proposal within 24 hours.' },
              { n: '03', t: 'Simply Enjoy', d: 'Everything is handled. Arrive and immerse yourself in Portugal.' }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div>
                  <p style={{ fontSize: '48px', fontWeight: 300, color: 'rgba(201,169,110,0.3)', marginBottom: '16px' }}>{s.n}</p>
                  <h3 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '14px', letterSpacing: '0.5px' }}>{s.t}</h3>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', lineHeight: 1.8 }}>{s.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="services" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>OUR SERVICES</p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 300 }}>Curated experiences</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button key={c.id} className={`filter-btn ${activeFilter === c.id ? 'active' : ''}`} onClick={() => setActiveFilter(c.id)}>{c.label}</button>
              ))}
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
            {filteredServices.map((s, idx) => (
              <FadeIn key={s.id} delay={idx * 0.05}>
                <div className="card" onClick={() => setActiveService(s)}>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img className="card-img" src={s.image} alt={s.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '6px' }}>{s.subtitle}</p>
                    <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '14px' }}>{s.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888' }}>
                      <span style={{ fontWeight: 500, color: '#1A1A1A' }}>{s.priceLabel}</span>
                      <span>{s.duration}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Packages ─── */}
      <section id="packages" style={{ background: '#F5F4F0', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>PACKAGES</p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 300 }}>Complete experiences</h2>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {packages.map((p, idx) => (
              <FadeIn key={p.id} delay={idx * 0.12}>
                <div className="card">
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img className="card-img" src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(26,26,26,0.9)', color: '#FFF', padding: '6px 14px', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', borderRadius: '2px', letterSpacing: '1px' }}>{p.duration}</div>
                  </div>
                  <div style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: 500 }}>{p.title}</h3>
                      <span style={{ fontSize: '24px', fontWeight: 300, color: '#C9A96E' }}>{p.price}</span>
                    </div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', marginBottom: '20px', lineHeight: 1.7 }}>{p.description}</p>
                    <div style={{ marginBottom: '24px' }}>
                      {p.highlights.slice(0, 4).map((h, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#555' }}>
                          <span style={{ color: '#C9A96E', fontSize: '10px' }}>●</span>{h}
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-dark" style={{ width: '100%' }} onClick={() => scrollToSection('booking')}>Book Package</button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>TESTIMONIALS</p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300, marginBottom: '56px' }}>Guest stories</h2>
          </FadeIn>

          <div style={{ minHeight: '280px', position: 'relative' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ position: i === testimonialIndex ? 'relative' : 'absolute', top: 0, left: 0, right: 0, opacity: i === testimonialIndex ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: i === testimonialIndex ? 'auto' : 'none' }}>
                <div className="stars" style={{ marginBottom: '24px' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontSize: 'clamp(18px, 3vw, 22px)', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '28px', fontWeight: 300 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500, letterSpacing: '1px' }}>{t.initials}</div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 500, fontSize: '15px' }}>{t.name}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#999' }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '32px' }}>
            {testimonials.map((_, i) => (<div key={i} className={`dot ${i === testimonialIndex ? 'active' : ''}`} onClick={() => setTestimonialIndex(i)} />))}
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <FadeIn direction="right">
              <div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>ABOUT ALÉM</p>
                <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300, marginBottom: '28px', lineHeight: 1.15 }}>Your local insider</h2>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', lineHeight: 1.9, color: '#555' }}>
                  <p style={{ marginBottom: '18px' }}>Além was born from a simple belief: the best trips are those where every detail is handled—invisibly, seamlessly, perfectly.</p>
                  <p style={{ marginBottom: '28px' }}>Based in Cascais, we've spent years building relationships with Portugal's finest chefs, captains, guides, and artisans. Every partner is personally vetted. Every experience is genuinely curated.</p>
                </div>
                <div style={{ borderTop: '1px solid #E8E8E8', paddingTop: '28px' }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '2px', color: '#C9A96E', marginBottom: '16px', textTransform: 'uppercase' }}>Our Partners</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {partners.map((p, i) => (
                      <div key={i}>
                        <p style={{ fontWeight: 500, fontSize: '14px' }}>{p.name}</p>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <img src={IMAGES.about1} alt="Sintra Palace" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', gridRow: 'span 2' }} />
                <img src={IMAGES.about2} alt="Fine Dining" loading="lazy" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                <img src={IMAGES.about3} alt="Yacht" loading="lazy" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Instagram CTA ─── */}
      <section style={{ background: '#1A1A1A', color: '#FFF', padding: '80px 24px', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>FOLLOW ALONG</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300, marginBottom: '20px' }}>@alem.concierge</h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', marginBottom: '32px' }}>Behind the scenes of extraordinary experiences in Portugal</p>
          <a href="https://instagram.com/alem.concierge" target="_blank" rel="noopener noreferrer" className="btn btn-white" style={{ textDecoration: 'none', display: 'inline-block' }}>Follow on Instagram</a>
        </FadeIn>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ background: '#F5F4F0', padding: '100px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>FAQ</p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300 }}>Common questions</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: '#FFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  <div style={{ padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 500, fontSize: '15px', paddingRight: '16px', lineHeight: 1.5 }}>{f.q}</p>
                    <span style={{ fontSize: '22px', color: '#C9A96E', transform: activeFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', flexShrink: 0 }}>+</span>
                  </div>
                  <div className={`faq-answer ${activeFaq === i ? 'open' : ''}`} style={{ padding: '0 28px' }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', lineHeight: 1.8, color: '#666', paddingBottom: '22px' }}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Booking ─── */}
      <section id="booking" style={{ background: '#1A1A1A', color: '#FFF', padding: '100px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '5px', color: '#C9A96E', marginBottom: '14px' }}>BOOK NOW</p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300 }}>{formSubmitted ? 'Thank you!' : 'Start planning'}</h2>
            </div>
          </FadeIn>

          {formSubmitted ? (
            <FadeIn>
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px', color: '#FFF' }}>✓</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.8 }}>We'll send a personalized proposal to<br /><strong style={{ color: '#FFF' }}>{formData.email}</strong><br />within 24 hours.</p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
                {[1, 2, 3].map(n => (
                  <React.Fragment key={n}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: bookingStep >= n ? '#C9A96E' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: bookingStep >= n ? '#FFF' : '#666', transition: 'all 0.3s' }}>{n}</div>
                    {n < 3 && <div style={{ width: '40px', height: '2px', background: bookingStep > n ? '#C9A96E' : '#333', alignSelf: 'center', transition: 'background 0.3s' }} />}
                  </React.Fragment>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {bookingStep === 1 && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '28px', fontWeight: 400, fontSize: '22px' }}>Trip Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Arrival *</label>
                        <input type="date" value={formData.arrival} onChange={e => setFormData({...formData, arrival: e.target.value})} className={formErrors.arrival ? 'input-error' : ''} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Departure *</label>
                        <input type="date" value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} className={formErrors.departure ? 'input-error' : ''} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Guests</label>
                        <select value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Budget</label>
                        <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}><option value="">Select...</option><option value="1-2.5k">€1,000 – €2,500</option><option value="2.5-5k">€2,500 – €5,000</option><option value="5k+">€5,000+</option><option value="flexible">Flexible</option></select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
                      <button type="button" className="btn btn-gold" onClick={() => setBookingStep(2)}>Continue</button>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '28px', fontWeight: 400, fontSize: '22px' }}>Select Services <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888' }}>(Optional)</span></h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      {services.slice(0, 8).map(s => (
                        <div key={s.id} onClick={() => toggleService(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: `1px solid ${formData.services.includes(s.id) ? '#C9A96E' : '#333'}`, borderRadius: '6px', cursor: 'pointer', background: formData.services.includes(s.id) ? 'rgba(201,169,110,0.08)' : 'transparent', transition: 'all 0.3s' }}>
                          <div style={{ width: '20px', height: '20px', border: `2px solid ${formData.services.includes(s.id) ? '#C9A96E' : '#555'}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.services.includes(s.id) ? '#C9A96E' : 'transparent', transition: 'all 0.3s', flexShrink: 0 }}>
                            {formData.services.includes(s.id) && <span style={{ color: '#FFF', fontSize: '12px' }}>✓</span>}
                          </div>
                          <div>
                            <p style={{ fontSize: '13px', marginBottom: '2px' }}>{s.title}</p>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888' }}>{s.priceLabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setBookingStep(1)} style={{ color: '#FFF', borderColor: '#555' }}>Back</button>
                      <button type="button" className="btn btn-gold" onClick={() => setBookingStep(3)}>Continue</button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '28px', fontWeight: 400, fontSize: '22px' }}>Your Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Name *</label>
                        <input type="text" placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={formErrors.name ? 'input-error' : ''} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Email *</label>
                        <input type="email" placeholder="you@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={formErrors.email ? 'input-error' : ''} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone *</label>
                        <input type="tel" placeholder="+1 555 123 4567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={formErrors.phone ? 'input-error' : ''} />
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Notes</label>
                      <textarea rows={3} placeholder="Special occasions, interests, dietary needs..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setBookingStep(2)} style={{ color: '#FFF', borderColor: '#555' }}>Back</button>
                      <button type="submit" className="btn btn-gold">Submit Request</button>
                    </div>
                  </div>
                )}
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: '#0F0F0F', color: '#FFF', padding: '56px 32px 36px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '36px', marginBottom: '48px' }}>
            <div>
              <h4 style={{ fontSize: '24px', letterSpacing: '6px', marginBottom: '16px', fontWeight: 400 }}>ALÉM</h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', lineHeight: 1.8 }}>Private concierge for the<br />Portuguese Riviera.</p>
            </div>
            <div>
              <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '2px', color: '#C9A96E', marginBottom: '18px' }}>CONTACT</h5>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', lineHeight: 2.2 }}>
                <a href="https://wa.me/351912345678" style={{ color: '#FFF', textDecoration: 'none' }}>+351 912 345 678</a><br />
                <a href="mailto:concierge@alem.pt" style={{ color: '#FFF', textDecoration: 'none' }}>concierge@alem.pt</a>
              </p>
            </div>
            <div>
              <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '2px', color: '#C9A96E', marginBottom: '18px' }}>NAVIGATE</h5>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', lineHeight: 2.2 }}>
                {['services', 'packages', 'about', 'faq'].map(s => (
                  <span key={s} onClick={() => scrollToSection(s)} style={{ cursor: 'pointer', display: 'block', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#888'}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                ))}
              </p>
            </div>
            <div>
              <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '2px', color: '#C9A96E', marginBottom: '18px' }}>FOLLOW</h5>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', lineHeight: 2.2 }}>
                <a href="https://instagram.com/alem.concierge" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>Instagram</a><br />
                <a href="https://wa.me/351912345678" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>WhatsApp</a>
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #222', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#555' }}>© 2026 Além. All rights reserved.</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#555' }}>Cascais, Portugal</p>
          </div>
        </div>
      </footer>

      {/* ─── WhatsApp FAB ─── */}
      <a href="https://wa.me/351912345678?text=Hi%20Al%C3%A9m%2C%20I%27d%20like%20to%20plan%20a%20trip" target="_blank" rel="noopener noreferrer" className="whatsapp-btn" aria-label="Contact us on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFF"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* ─── Service Modal ─── */}
      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveService(null)}>×</button>
            <img src={activeService.image} alt={activeService.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
            <div style={{ padding: '36px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '2.5px', color: '#C9A96E', marginBottom: '8px', textTransform: 'uppercase' }}>{activeService.subtitle}</p>
              <h3 style={{ fontSize: '30px', fontWeight: 500, marginBottom: '18px' }}>{activeService.title}</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', lineHeight: 1.8, color: '#666', marginBottom: '28px' }}>{activeService.description}</p>
              
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '1.5px', color: '#999', marginBottom: '12px', textTransform: 'uppercase' }}>What's Included</p>
              <div style={{ marginBottom: '28px' }}>
                {activeService.includes.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontSize: '13px' }}>
                    <span style={{ color: '#C9A96E', fontSize: '10px' }}>●</span>{item}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0', marginBottom: '28px' }}>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#999', marginBottom: '4px', letterSpacing: '1px' }}>PRICE</p>
                  <p style={{ fontSize: '24px', fontWeight: 400 }}>{activeService.priceLabel}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#999', marginBottom: '4px', letterSpacing: '1px' }}>DURATION</p>
                  <p style={{ fontSize: '16px' }}>{activeService.duration}</p>
                </div>
              </div>

              <button className="btn btn-dark" style={{ width: '100%' }} onClick={() => { setActiveService(null); scrollToSection('booking'); }}>Book This Experience</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlemWebsite;
