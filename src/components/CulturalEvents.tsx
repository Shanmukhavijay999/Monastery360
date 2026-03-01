import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Bell, Star, CheckCircle, X } from "lucide-react";
import culturalEventsImage from "@/assets/cultural-events.jpg";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Event {
  title: string;
  date: string;
  /** ISO-8601 date string used for .ics and reminder scheduling */
  isoDate: string;
  /** ISO-8601 end date (optional, defaults to same day) */
  isoDateEnd?: string;
  /** Start time as "HH:MM" 24-h */
  startTime: string;
  /** End time as "HH:MM" 24-h */
  endTime: string;
  time: string;
  location: string;
  type: string;
  participants: string;
  description: string;
  status: string;
  featured?: boolean;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a local date/time into ICS DTSTART/DTEND format: YYYYMMDDTHHMMSS */
function toIcsDate(isoDate: string, time: string): string {
  const [y, m, d] = isoDate.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

/** Download an .ics calendar file for the given event */
function downloadIcs(event: Event) {
  const dtStart = toIcsDate(event.isoDate, event.startTime);
  const dtEnd = toIcsDate(event.isoDateEnd ?? event.isoDate, event.endTime);
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Monastery360//Cultural Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${now}-${event.title.replace(/\s+/g, "")}@monastery360`,
    `DTSTAMP:${now}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "_")}_2026.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Request notification permission and schedule a browser reminder 1 day before the event */
async function scheduleReminder(event: Event): Promise<"ok" | "denied" | "unsupported"> {
  if (!("Notification" in window)) return "unsupported";

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return "denied";

  // Calculate ms until 1 day before the event at 9:00 AM
  const eventDate = new Date(`${event.isoDate}T${event.startTime}:00`);
  const reminderDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
  reminderDate.setHours(9, 0, 0, 0);
  const delay = reminderDate.getTime() - Date.now();

  if (delay > 0) {
    setTimeout(() => {
      new Notification(`🛕 Reminder: ${event.title} is Tomorrow!`, {
        body: `📍 ${event.location}\n⏰ ${event.time}\n${event.description}`,
        icon: "/favicon.ico",
        tag: event.title,
      });
    }, delay);
  } else {
    // Event is very soon – fire an immediate notification
    new Notification(`🛕 ${event.title} – Coming Up Soon!`, {
      body: `📍 ${event.location}\n⏰ ${event.time}`,
      icon: "/favicon.ico",
      tag: event.title,
    });
  }

  return "ok";
}

// ─── Component ────────────────────────────────────────────────────────────────
const CulturalEvents = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [calendarAdded, setCalendarAdded] = useState<Record<string, boolean>>({});
  const [reminderSet, setReminderSet] = useState<Record<string, boolean>>({});

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const upcomingEvents: Event[] = [
    {
      title: "Losar Festival",
      date: "March 15, 2026",
      isoDate: "2026-03-15",
      startTime: "06:00",
      endTime: "20:00",
      time: "6:00 AM – 8:00 PM",
      location: "Rumtek Monastery",
      type: "Festival",
      participants: "500+",
      description: "Tibetan New Year celebration with traditional dances, prayers, and feasting",
      status: "upcoming",
      featured: true,
    },
    {
      title: "Cham Dance Performance",
      date: "March 22, 2026",
      isoDate: "2026-03-22",
      startTime: "10:00",
      endTime: "14:00",
      time: "10:00 AM – 2:00 PM",
      location: "Pemayangtse Monastery",
      type: "Cultural Performance",
      participants: "200+",
      description: "Sacred masked dances performed by monks in traditional costumes",
      status: "upcoming",
    },
    {
      title: "Buddha Purnima",
      date: "April 8, 2026",
      isoDate: "2026-04-08",
      startTime: "05:00",
      endTime: "21:00",
      time: "5:00 AM – 9:00 PM",
      location: "Multiple Monasteries",
      type: "Religious Festival",
      participants: "1000+",
      description: "Buddha's birthday celebration with special prayers and processions",
      status: "upcoming",
    },
    {
      title: "Meditation Retreat",
      date: "April 15–17, 2026",
      isoDate: "2026-04-15",
      isoDateEnd: "2026-04-17",
      startTime: "06:00",
      endTime: "21:00",
      time: "3 Day Retreat",
      location: "Tashiding Monastery",
      type: "Spiritual Program",
      participants: "50",
      description: "Silent meditation retreat guided by senior monks",
      status: "registration",
    },
  ];

  const featuredEvent = upcomingEvents.find((e) => e.featured)!;

  const categories = [
    { name: "Religious Festivals", count: 12 },
    { name: "Cultural Performances", count: 8 },
    { name: "Meditation Programs", count: 6 },
    { name: "Educational Tours", count: 15 },
  ];

  // ── Handlers ──
  const handleAddToCalendar = (event: Event) => {
    downloadIcs(event);
    setCalendarAdded((prev) => ({ ...prev, [event.title]: true }));
    addToast(`📅 "${event.title}" added to your calendar!`, "success");
  };

  const handleSetReminder = async (event: Event) => {
    const result = await scheduleReminder(event);
    if (result === "ok") {
      setReminderSet((prev) => ({ ...prev, [event.title]: true }));
      addToast(`🔔 Reminder set for "${event.title}" — we'll notify you 1 day before!`, "success");
    } else if (result === "denied") {
      addToast("⚠️ Notification permission denied. Please enable it in your browser settings.", "error");
    } else {
      addToast("⚠️ Browser notifications are not supported on this device.", "error");
    }
  };

  return (
    <section id="events" className="section-padding bg-background">
      {/* ── Toast Container ── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm text-sm font-medium ${toast.type === "success"
                  ? "bg-emerald-950/90 border-emerald-700/60 text-emerald-200"
                  : toast.type === "error"
                    ? "bg-red-950/90 border-red-700/60 text-red-200"
                    : "bg-card/90 border-border text-foreground"
                } backdrop-blur-xl`}
            >
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="section-heading text-foreground">Cultural Calendar</h2>
            <p className="section-subheading">
              Join authentic monastery festivals, spiritual ceremonies, and cultural performances.
              Experience Sikkim's living Buddhist traditions.
            </p>
          </div>
        </ScrollReveal>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-16">
          {categories.map((cat, index) => (
            <ScrollReveal key={cat.name} delay={index * 0.08}>
              <div className="bg-card rounded-2xl border border-border/60 p-5 text-center hover:shadow-monastery hover:border-border transition-all duration-500">
                <div className="text-3xl font-bold text-primary mb-1">{cat.count}</div>
                <div className="text-sm font-medium text-foreground">{cat.name}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Featured Event */}
        <ScrollReveal className="mb-16">
          <div className="bg-card rounded-3xl border border-border/60 overflow-hidden hover:shadow-premium transition-all duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={culturalEventsImage}
                  alt="Buddhist monks at traditional festival"
                  className="w-full h-full object-cover min-h-[300px]"
                />
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                  <span className="glass px-3 py-1.5 rounded-full text-xs text-white font-medium">
                    Live Stream
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">March 15, 2026</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Losar Festival 2026
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Join us for the most significant celebration in the Tibetan Buddhist calendar.
                  Traditional ceremonies, masked dances, butter sculpture displays, and feasting.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
                  {[
                    { icon: Clock, text: "6:00 AM – 8:00 PM" },
                    { icon: MapPin, text: "Rumtek Monastery" },
                    { icon: Users, text: "500+ Expected" },
                    { icon: Bell, text: "Free Entry" },
                  ].map(({ icon: Ic, text }) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground">
                      <Ic className="w-4 h-4 flex-shrink-0" /> <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleAddToCalendar(featuredEvent)}
                    className={`rounded-xl gap-2 font-medium transition-all duration-300 ${calendarAdded[featuredEvent.title]
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                  >
                    {calendarAdded[featuredEvent.title] ? (
                      <><CheckCircle className="w-4 h-4" /> Added!</>
                    ) : (
                      <><Calendar className="w-4 h-4" /> Add to Calendar</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSetReminder(featuredEvent)}
                    className={`rounded-xl gap-2 font-medium border-border transition-all duration-300 ${reminderSet[featuredEvent.title]
                        ? "border-emerald-600 text-emerald-500 hover:bg-emerald-950/30"
                        : "hover:bg-secondary"
                      }`}
                  >
                    {reminderSet[featuredEvent.title] ? (
                      <><CheckCircle className="w-4 h-4" /> Reminder Set</>
                    ) : (
                      <><Bell className="w-4 h-4" /> Set Reminder</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Upcoming Events */}
        <ScrollReveal>
          <h3 className="text-2xl font-bold text-foreground mb-8">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.filter((e) => !e.featured).map((event) => (
              <motion.div
                key={event.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card rounded-2xl border border-border/60 p-6 hover:shadow-premium hover:border-border transition-all duration-500 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-foreground">{event.title}</h4>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${event.status === "upcoming"
                        ? "bg-primary/10 text-primary"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                  >
                    {event.status === "upcoming" ? "Upcoming" : "Register"}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {event.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {event.location}</div>
                  <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {event.participants}</div>
                </div>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed flex-1">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                      {event.type}
                    </span>
                    <Button
                      size="sm"
                      className="bg-foreground text-background hover:bg-foreground/90 rounded-xl text-xs font-medium"
                    >
                      {event.status === "registration" ? "Register" : "Learn More"}
                    </Button>
                  </div>
                  {/* Add to Calendar + Set Reminder for each card */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCalendar(event)}
                      className={`flex-1 rounded-xl gap-1.5 text-xs font-medium border-border transition-all duration-300 ${calendarAdded[event.title]
                          ? "border-emerald-600 text-emerald-500 hover:bg-emerald-950/30"
                          : "hover:bg-secondary"
                        }`}
                    >
                      {calendarAdded[event.title] ? (
                        <><CheckCircle className="w-3 h-3" /> Added</>
                      ) : (
                        <><Calendar className="w-3 h-3" /> Add to Cal</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetReminder(event)}
                      className={`flex-1 rounded-xl gap-1.5 text-xs font-medium border-border transition-all duration-300 ${reminderSet[event.title]
                          ? "border-emerald-600 text-emerald-500 hover:bg-emerald-950/30"
                          : "hover:bg-secondary"
                        }`}
                    >
                      {reminderSet[event.title] ? (
                        <><CheckCircle className="w-3 h-3" /> Set</>
                      ) : (
                        <><Bell className="w-3 h-3" /> Remind Me</>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CulturalEvents;