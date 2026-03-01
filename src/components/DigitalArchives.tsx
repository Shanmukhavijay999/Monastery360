import { Button } from "@/components/ui/button";
import { Search, Download, Eye, BookOpen, Scroll, Palette } from "lucide-react";
import digitalArchivesImage from "@/assets/digital-archives.jpg";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const DigitalArchives = () => {
  const archives = [
    {
      category: "Ancient Manuscripts",
      count: "234",
      description: "Rare Buddhist texts and scriptures digitally preserved in high resolution",
      icon: Scroll,
      items: ["Kangyur Collection", "Tengyur Texts", "Ritual Manuals", "Historical Records"],
    },
    {
      category: "Sacred Murals",
      count: "156",
      description: "High-definition scans of monastery wall paintings and artwork",
      icon: Palette,
      items: ["Thangka Paintings", "Wall Murals", "Mandala Art", "Deity Portraits"],
    },
    {
      category: "Historical Documents",
      count: "89",
      description: "Important historical papers, letters, and administrative records",
      icon: BookOpen,
      items: ["Royal Decrees", "Monastery Records", "Trade Documents", "Correspondence"],
    },
  ];

  const featured = [
    {
      title: "17th Century Kangyur Manuscript",
      language: "Tibetan",
      condition: "Excellent",
      pages: "1,234",
      description: "Complete Buddhist canon written in gold ink on handmade paper",
    },
    {
      title: "Pemayangtse Thangka Collection",
      type: "Visual Art",
      condition: "Good",
      items: "45",
      description: "Intricate silk paintings depicting Buddhist deities and teachings",
    },
    {
      title: "Royal Monastery Charter",
      date: "1705 AD",
      condition: "Fair",
      significance: "High",
      description: "Original founding document establishing monastery rights and lands",
    },
  ];

  return (
    <section id="archives" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="section-heading text-foreground">
              Digital Cultural Archives
            </h2>
            <p className="section-subheading">
              Preserving Sikkim's cultural heritage through advanced digitization.
              Access rare manuscripts, sacred art, and historical documents.
            </p>
          </div>
        </ScrollReveal>

        {/* Archive Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {archives.map((archive, index) => {
            const IconComponent = archive.icon;
            return (
              <ScrollReveal key={archive.category} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-card rounded-2xl border border-border/60 p-8 text-center hover:shadow-premium hover:border-border transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-500">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{archive.category}</h3>
                  <div className="text-3xl font-bold text-primary mb-3">{archive.count}</div>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{archive.description}</p>

                  <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                    {archive.items.map((item) => (
                      <span key={item} className="text-[11px] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>

                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-2 h-10 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    Browse Collection
                  </Button>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Featured Archive — Split Layout */}
        <ScrollReveal className="mb-16">
          <div className="bg-card rounded-3xl border border-border/60 overflow-hidden hover:shadow-premium transition-all duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={digitalArchivesImage}
                  alt="Ancient Buddhist manuscripts and artwork"
                  className="w-full h-full object-cover min-h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 dark:to-background/40" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-5">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Featured Collection
                  </span>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    AI Enhanced
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Sacred Art & Manuscripts Collection
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Over 500 rare Buddhist manuscripts, thangka paintings, and historical documents,
                  all enhanced with AI-powered search and translation capabilities.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                  {[
                    { label: "Languages", value: "Tibetan, Sanskrit, Nepali" },
                    { label: "Time Period", value: "15th – 19th Century" },
                    { label: "Resolution", value: "Up to 300 DPI" },
                    { label: "Access", value: "Free for Research" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                      <div className="font-medium text-foreground">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-2 font-medium">
                    <Search className="w-4 h-4" />
                    Search Archives
                  </Button>
                  <Button variant="outline" className="rounded-xl gap-2 font-medium border-border hover:bg-secondary">
                    <Download className="w-4 h-4" />
                    Download Catalog
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card rounded-2xl border border-border/60 p-6 hover:shadow-premium hover:border-border transition-all duration-500"
              >
                <h4 className="font-semibold text-foreground mb-3">{item.title}</h4>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.description}</p>

                <div className="space-y-2 mb-5 text-sm">
                  {item.language && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="text-foreground font-medium">{item.language}</span>
                    </div>
                  )}
                  {item.type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-foreground font-medium">{item.type}</span>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">{item.date}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <span className={`font-medium ${item.condition === "Excellent" ? "text-emerald-500" :
                        item.condition === "Good" ? "text-blue-500" : "text-amber-500"
                      }`}>
                      {item.condition}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-1.5 border-border hover:bg-secondary text-sm">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalArchives;