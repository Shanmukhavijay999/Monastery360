import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Bell, Star } from "lucide-react";
import culturalEventsImage from "@/assets/cultural-events.jpg";

const CulturalEvents = () => {
  const upcomingEvents = [
    {
      title: "Losar Festival",
      date: "March 15, 2024",
      time: "6:00 AM - 8:00 PM",
      location: "Rumtek Monastery",
      type: "Festival",
      participants: "500+",
      description: "Tibetan New Year celebration with traditional dances, prayers, and feasting",
      status: "upcoming",
      featured: true
    },
    {
      title: "Cham Dance Performance",
      date: "March 22, 2024", 
      time: "10:00 AM - 2:00 PM",
      location: "Pemayangtse Monastery",
      type: "Cultural Performance",
      participants: "200+",
      description: "Sacred masked dances performed by monks in traditional costumes",
      status: "upcoming"
    },
    {
      title: "Buddha Purnima",
      date: "April 8, 2024",
      time: "5:00 AM - 9:00 PM", 
      location: "Multiple Monasteries",
      type: "Religious Festival",
      participants: "1000+",
      description: "Buddha's birthday celebration with special prayers and processions",
      status: "upcoming"
    },
    {
      title: "Meditation Retreat",
      date: "April 15-17, 2024",
      time: "3 Day Retreat",
      location: "Tashiding Monastery",
      type: "Spiritual Program",
      participants: "50",
      description: "Silent meditation retreat guided by senior monks",
      status: "registration"
    }
  ];

  const eventCategories = [
    { name: "Religious Festivals", count: 12, color: "saffron" },
    { name: "Cultural Performances", count: 8, color: "gold" },
    { name: "Meditation Programs", count: 6, color: "mountain-blue" },
    { name: "Educational Tours", count: 15, color: "accent" }
  ];

  return (
    <section id="events" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
            Cultural Calendar & Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join authentic monastery festivals, spiritual ceremonies, and cultural performances. 
            Experience Sikkim's living Buddhist traditions throughout the year.
          </p>
        </div>

        {/* Event Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {eventCategories.map((category, index) => (
            <Card key={category.name} className="hover:shadow-monastery transition-monastery animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-saffron mb-1">{category.count}</div>
                <div className="text-sm font-medium text-deep-earth">{category.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Event */}
        <div className="mb-16 animate-fade-in-up">
          <Card className="overflow-hidden shadow-monastery">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={culturalEventsImage}
                  alt="Buddhist monks participating in traditional monastery festival"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-earth/20"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-saffron text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                  <span className="bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm">
                    Live Stream Available
                  </span>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-saffron" />
                  <span className="text-sm font-semibold text-saffron">March 15, 2024</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-deep-earth mb-4">
                  Losar Festival 2024
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Join us for the most significant celebration in the Tibetan Buddhist calendar. 
                  Experience traditional ceremonies, masked dances, butter sculpture displays, 
                  and community feasting at Rumtek Monastery.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Rumtek Monastery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>500+ Expected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <span>Free Entry</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="monastery" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </Button>
                  <Button variant="temple" className="gap-2">
                    <Bell className="w-4 h-4" />
                    Set Reminder
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-2xl font-bold text-deep-earth mb-8 animate-fade-in-up">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter(event => !event.featured).map((event, index) => (
              <Card key={event.title} className="hover:shadow-monastery transition-monastery animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-deep-earth">{event.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold
                      ${event.status === 'upcoming' ? 'bg-saffron text-primary-foreground' :
                        event.status === 'registration' ? 'bg-gold text-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {event.status === 'upcoming' ? 'Upcoming' :
                       event.status === 'registration' ? 'Register Now' : 'Past'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {event.participants} participants
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-warm-stone text-deep-earth px-2 py-1 rounded">
                      {event.type}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="monastery" size="sm">
                        {event.status === 'registration' ? 'Register' : 'Learn More'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalEvents;