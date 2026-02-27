import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const links = {
    explore: [
      { name: "Virtual Tours", href: "#tours" },
      { name: "Monastery Map", href: "#map" },
      { name: "Digital Archives", href: "#archives" },
      { name: "Audio Guides", href: "#audio" }
    ],
    events: [
      { name: "Cultural Calendar", href: "#events" },
      { name: "Festival Schedule", href: "#events" },
      { name: "Meditation Programs", href: "#events" },
      { name: "Educational Tours", href: "#events" }
    ],
    resources: [
      { name: "Research Portal", href: "#" },
      { name: "Educational Materials", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Download App", href: "#" }
    ],
    about: [
      { name: "Project Overview", href: "#" },
      { name: "Preservation Mission", href: "#" },
      { name: "Technology Partners", href: "#" },
      { name: "Contact Us", href: "#" }
    ]
  };

  return (
    <footer className="bg-deep-earth text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">M360</span>
              </div>
              <h3 className="text-2xl font-bold text-gold">Monastery360</h3>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Preserving and showcasing Sikkim's rich monastery heritage through 
              cutting-edge digital technology and immersive experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <span>info@monastery360.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+91 3592 123456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Department of Higher & Technical Education, Sikkim</span>
              </div>
            </div>
          </div>
          
          {/* Links Sections */}
          <div>
            <h4 className="font-bold text-gold mb-4">Explore</h4>
            <ul className="space-y-2">
              {links.explore.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-gold transition-monastery text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gold mb-4">Events</h4>
            <ul className="space-y-2">
              {links.events.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-gold transition-monastery text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gold mb-4">Resources</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-gold transition-monastery text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gold mb-4">About</h4>
            <ul className="space-y-2">
              {links.about.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-gold transition-monastery text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <h4 className="font-bold text-gold mb-2">Stay Connected</h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Get updates on new virtual tours, cultural events, and preservation initiatives.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-gold"
              />
              <Button variant="temple" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-primary-foreground/60">
              © 2024 Government of Sikkim. All rights reserved. | 
              <span className="text-gold"> Preserving Heritage Through Technology</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-monastery">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-monastery">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-monastery">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-monastery">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;