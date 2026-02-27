import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, Eye, BookOpen, Scroll, Palette } from "lucide-react";
import digitalArchivesImage from "@/assets/digital-archives.jpg";

const DigitalArchives = () => {
  const archives = [
    {
      category: "Ancient Manuscripts",
      count: "234",
      description: "Rare Buddhist texts and scriptures digitally preserved in high resolution",
      icon: Scroll,
      items: ["Kangyur Collection", "Tengyur Texts", "Ritual Manuals", "Historical Records"]
    },
    {
      category: "Sacred Murals", 
      count: "156",
      description: "High-definition scans of monastery wall paintings and artwork",
      icon: Palette,
      items: ["Thangka Paintings", "Wall Murals", "Mandala Art", "Deity Portraits"]
    },
    {
      category: "Historical Documents",
      count: "89",
      description: "Important historical papers, letters, and administrative records",
      icon: BookOpen,
      items: ["Royal Decrees", "Monastery Records", "Trade Documents", "Correspondence"]
    }
  ];

  const featured = [
    {
      title: "17th Century Kangyur Manuscript",
      language: "Tibetan",
      condition: "Excellent",
      pages: "1,234",
      description: "Complete Buddhist canon written in gold ink on handmade paper"
    },
    {
      title: "Pemayangtse Thangka Collection", 
      type: "Visual Art",
      condition: "Good",
      items: "45",
      description: "Intricate silk paintings depicting Buddhist deities and teachings"
    },
    {
      title: "Royal Monastery Charter",
      date: "1705 AD", 
      condition: "Fair",
      significance: "High",
      description: "Original founding document establishing monastery rights and lands"
    }
  ];

  return (
    <section id="archives" className="py-20 bg-warm-stone">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
            Digital Cultural Archives
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preserving Sikkim's cultural heritage through advanced digitization. 
            Access rare manuscripts, sacred art, and historical documents for research and education.
          </p>
        </div>

        {/* Archive Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {archives.map((archive, index) => {
            const IconComponent = archive.icon;
            return (
              <Card key={archive.category} className="group hover:shadow-monastery transition-monastery animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-monastery">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-deep-earth mb-2">{archive.category}</h3>
                  <div className="text-3xl font-bold text-saffron mb-3">{archive.count}</div>
                  <p className="text-muted-foreground text-sm mb-4">{archive.description}</p>
                  
                  <div className="space-y-1 mb-4">
                    {archive.items.map((item) => (
                      <div key={item} className="text-xs bg-background text-deep-earth px-2 py-1 rounded">
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="monastery" size="sm" className="w-full">
                    <Eye className="w-4 h-4" />
                    Browse Collection
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Archive */}
        <div className="mb-16 animate-fade-in-up">
          <Card className="overflow-hidden shadow-monastery">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={digitalArchivesImage}
                  alt="Ancient Buddhist manuscripts and artwork"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-earth/20"></div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-saffron text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Featured Collection
                  </span>
                  <span className="bg-warm-stone text-deep-earth px-3 py-1 rounded-full text-xs">
                    AI Enhanced
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-deep-earth mb-4">
                  Sacred Art & Manuscripts Collection
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Our most comprehensive digital archive featuring over 500 rare Buddhist manuscripts, 
                  thangka paintings, and historical documents, all enhanced with AI-powered search 
                  and translation capabilities.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <div className="font-semibold text-deep-earth">Languages</div>
                    <div className="text-muted-foreground">Tibetan, Sanskrit, Nepali</div>
                  </div>
                  <div>
                    <div className="font-semibold text-deep-earth">Time Period</div>
                    <div className="text-muted-foreground">15th - 19th Century</div>
                  </div>
                  <div>
                    <div className="font-semibold text-deep-earth">Resolution</div>
                    <div className="text-muted-foreground">Up to 300 DPI</div>
                  </div>
                  <div>
                    <div className="font-semibold text-deep-earth">Access</div>
                    <div className="text-muted-foreground">Free for Research</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="monastery" className="gap-2">
                    <Search className="w-4 h-4" />
                    Search Archives
                  </Button>
                  <Button variant="temple" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Catalog
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Featured Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item, index) => (
            <Card key={item.title} className="hover:shadow-monastery transition-monastery animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6">
                <h4 className="font-bold text-deep-earth mb-3">{item.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                
                <div className="space-y-2 mb-4 text-xs">
                  {item.language && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="text-deep-earth">{item.language}</span>
                    </div>
                  )}
                  {item.type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-deep-earth">{item.type}</span>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-deep-earth">{item.date}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className={`${item.condition === 'Excellent' ? 'text-green-600' : 
                                     item.condition === 'Good' ? 'text-blue-600' : 'text-amber-600'}`}>
                      {item.condition}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalArchives;