import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const Footer = () => {
  const links = {
    explore: [
      { name: "Virtual Tours", href: "#tours" },
      { name: "Monastery Map", href: "#map" },
      { name: "Digital Archives", href: "#archives" },
      { name: "Audio Guides", href: "#audio" },
    ],
    events: [
      { name: "Cultural Calendar", href: "#events" },
      { name: "Festival Schedule", href: "#events" },
      { name: "Meditation Programs", href: "#events" },
      { name: "Educational Tours", href: "#events" },
    ],
    resources: [
      { name: "Research Portal", href: "#" },
      { name: "Educational Materials", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Download App", href: "#" },
    ],
    about: [
      { name: "Project Overview", href: "#" },
      { name: "Preservation Mission", href: "#" },
      { name: "Technology Partners", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-xs font-black text-primary-foreground">M360</span>
                </div>
                <h3 className="text-xl font-bold text-background">Monastery360</h3>
              </div>
              <p className="text-background/50 mb-6 leading-relaxed text-sm max-w-xs">
                Preserving and showcasing Sikkim's rich monastery heritage through
                cutting-edge digital technology and immersive experiences.
              </p>
              <div className="space-y-2.5 text-sm text-background/40">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5" /> info@monastery360.gov.in
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5" /> +91 3592 123456
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5" /> Dept. of Higher Education, Sikkim
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-background/40 mb-4">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {items.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => link.href.startsWith("#") ? scrollToSection(link.href) : null}
                        className="text-sm text-background/60 hover:text-background transition-colors duration-300"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-background/10 py-10">
          <div className="max-w-md">
            <h4 className="text-sm font-semibold text-background mb-2">Stay Connected</h4>
            <p className="text-background/40 text-xs mb-4">
              Get updates on new virtual tours, events, and preservation initiatives.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-background/5 border border-background/10 rounded-xl text-sm text-background placeholder:text-background/30 focus:outline-none focus:border-background/20 transition-colors"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 text-sm font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/30">
              © 2024 Government of Sikkim. All rights reserved.
              <span className="text-primary ml-1">Preserving Heritage Through Technology</span>
            </p>
            <div className="flex items-center gap-4 text-xs text-background/30">
              <button className="hover:text-background/60 transition-colors">Privacy</button>
              <button className="hover:text-background/60 transition-colors">Terms</button>
              <button className="hover:text-background/60 transition-colors">Accessibility</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;