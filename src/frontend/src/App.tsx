import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  Award,
  Baby,
  Bone,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Cross,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Smile,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";
import { useAuth } from "./hooks/useAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// ---------- Types ----------
interface FormState {
  status: "idle" | "loading" | "success" | "error";
}

// ---------- Routing State ----------
type AppRoute = "home" | "admin-login" | "admin-dashboard";

function getInitialRoute(): AppRoute {
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    if (hash === "#/admin/login") return "admin-login";
    if (hash === "#/admin") return "admin-dashboard";
    const path = window.location.pathname;
    if (path === "/admin/login") return "admin-login";
    if (path === "/admin") return "admin-dashboard";
  }
  return "home";
}

// ---------- Navbar ----------
function Navbar({ onAdminClick }: { onAdminClick: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "nav.home.link" },
    { label: "Services", href: "#services", ocid: "nav.services.link" },
    { label: "Doctors", href: "#doctors", ocid: "nav.doctors.link" },
    {
      label: "Appointment",
      href: "#appointment",
      ocid: "nav.appointment.link",
    },
    { label: "Contact", href: "#contact", ocid: "nav.contact.link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-nav" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-health-teal rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Cross className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-health-navy leading-tight">
              Apna<span className="text-health-teal"> Health</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-ocid={link.ocid}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-health-teal rounded-md transition-colors duration-200 hover:bg-health-surface"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onAdminClick}
              data-ocid="nav.admin.link"
              className="text-sm font-medium text-foreground/50 hover:text-health-teal px-3 py-2 rounded-md transition-colors"
            >
              Admin
            </button>
            <a
              href="#appointment"
              className="flex items-center gap-1.5 bg-health-teal hover:bg-health-teal-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground hover:bg-health-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <ul className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid={link.ocid}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-health-teal hover:bg-health-surface rounded-md transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-health-teal" />
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  data-ocid="nav.mobile.admin.link"
                  onClick={() => {
                    setMobileOpen(false);
                    onAdminClick();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground/60 hover:text-health-teal hover:bg-health-surface rounded-md transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-health-teal" />
                  Admin Panel
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.location.hash = "#appointment";
                  }}
                  className="w-full flex justify-center bg-health-teal text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---------- Hero ----------
function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1200x500.jpg')",
        }}
      />
      {/* Overlay — layered gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.06_210/0.88)] via-[oklch(0.22_0.08_200/0.72)] to-[oklch(0.25_0.1_190/0.45)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.04_210/0.6)] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          >
            <Heart className="w-3.5 h-3.5 text-red-300 fill-red-300" />
            Trusted Healthcare Since 2010
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6"
          >
            Your Health,
            <br />
            <span className="text-[oklch(0.78_0.14_180)]">Our Priority</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/85 text-xl leading-relaxed mb-10 max-w-xl"
          >
            Compassionate care for a healthier tomorrow. Expert doctors, modern
            facilities, and personalized treatment for every patient.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#appointment"
              data-ocid="hero.book_appointment.primary_button"
              className="inline-flex items-center gap-2 bg-health-teal hover:bg-health-teal-dark text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Book Appointment
            </a>
            <a
              href="#services"
              data-ocid="hero.our_services.secondary_button"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Our Services
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          role="presentation"
          aria-hidden="true"
        >
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 40C1200 38 1320 28 1380 23L1440 18V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="oklch(0.98 0.004 95)"
          />
        </svg>
      </div>
    </section>
  );
}

// ---------- Stats Bar ----------
const STATS = [
  {
    icon: Users,
    value: "5,000+",
    label: "Patients Treated",
    color: "text-health-teal",
  },
  {
    icon: Stethoscope,
    value: "50+",
    label: "Expert Doctors",
    color: "text-health-coral",
  },
  {
    icon: Award,
    value: "15+",
    label: "Years Experience",
    color: "text-health-teal",
  },
  {
    icon: Activity,
    value: "20+",
    label: "Medical Services",
    color: "text-health-coral",
  },
];

function StatsBar() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/60 flex flex-col items-center text-center hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-health-surface rounded-xl flex items-center justify-center mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="font-display font-bold text-3xl text-health-navy mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Services (backend-driven) ----------
const FALLBACK_SERVICES = [
  {
    icon: Stethoscope,
    title: "General Consultation",
    desc: "Comprehensive primary care for all ages with expert diagnosis and personalized treatment plans.",
    color: "bg-[oklch(0.94_0.06_195)]",
    iconColor: "text-health-teal",
  },
  {
    icon: Heart,
    title: "Cardiology",
    desc: "Expert heart care and diagnostics with state-of-the-art cardiac monitoring and treatment.",
    color: "bg-[oklch(0.96_0.05_32)]",
    iconColor: "text-health-coral",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    desc: "Specialized care for children from newborn to adolescence in a warm, child-friendly environment.",
    color: "bg-[oklch(0.94_0.06_145)]",
    iconColor: "text-[oklch(0.52_0.14_145)]",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    desc: "Bone and joint health specialists offering advanced surgical and non-surgical treatments.",
    color: "bg-[oklch(0.94_0.05_260)]",
    iconColor: "text-[oklch(0.48_0.14_260)]",
  },
  {
    icon: Smile,
    title: "Dentistry",
    desc: "Complete dental care and hygiene services from routine cleanings to cosmetic procedures.",
    color: "bg-[oklch(0.95_0.06_85)]",
    iconColor: "text-[oklch(0.52_0.16_85)]",
  },
  {
    icon: Brain,
    title: "Neurology",
    desc: "Brain and nervous system treatment with cutting-edge diagnostics and therapeutic care.",
    color: "bg-[oklch(0.95_0.05_310)]",
    iconColor: "text-[oklch(0.48_0.14_310)]",
  },
];

const SERVICE_ICON_CYCLE = [
  Stethoscope,
  Heart,
  Baby,
  Bone,
  Smile,
  Brain,
  Activity,
  Users,
];
const SERVICE_COLOR_CYCLE = [
  { color: "bg-[oklch(0.94_0.06_195)]", iconColor: "text-health-teal" },
  { color: "bg-[oklch(0.96_0.05_32)]", iconColor: "text-health-coral" },
  {
    color: "bg-[oklch(0.94_0.06_145)]",
    iconColor: "text-[oklch(0.52_0.14_145)]",
  },
  {
    color: "bg-[oklch(0.94_0.05_260)]",
    iconColor: "text-[oklch(0.48_0.14_260)]",
  },
  {
    color: "bg-[oklch(0.95_0.06_85)]",
    iconColor: "text-[oklch(0.52_0.16_85)]",
  },
  {
    color: "bg-[oklch(0.95_0.05_310)]",
    iconColor: "text-[oklch(0.48_0.14_310)]",
  },
];

function ServicesSection() {
  const { actor, isFetching } = useActor();

  const { data: backendServices, isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: () => actor?.getAllServices() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  // Use backend services if available, otherwise fallback
  const hasBackendServices = backendServices && backendServices.length > 0;
  const services = hasBackendServices
    ? backendServices.map((svc, i) => ({
        icon: SERVICE_ICON_CYCLE[i % SERVICE_ICON_CYCLE.length],
        title: svc.title,
        desc: svc.description,
        color: SERVICE_COLOR_CYCLE[i % SERVICE_COLOR_CYCLE.length].color,
        iconColor:
          SERVICE_COLOR_CYCLE[i % SERVICE_COLOR_CYCLE.length].iconColor,
      }))
    : FALLBACK_SERVICES;

  return (
    <section id="services" className="py-20 bg-health-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[oklch(0.94_0.06_195)] text-health-teal text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Our Services
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-health-navy mb-4">
            Comprehensive Medical Care
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We offer a wide range of specialized medical services to keep you
            and your family healthy.
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group cursor-default"
              >
                <div
                  className={`w-14 h-14 ${svc.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}
                >
                  <svc.icon className={`w-7 h-7 ${svc.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-xl text-health-navy mb-3">
                  {svc.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {svc.desc}
                </p>
                <div className="mt-5 flex items-center gap-1 text-health-teal text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Doctors (backend-driven) ----------
function DoctorsSection() {
  const { actor, isFetching } = useActor();

  const { data: backendDoctors, isLoading } = useQuery({
    queryKey: ["public-doctors"],
    queryFn: () => actor?.getAllDoctors() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const doctors = backendDoctors ?? [];

  return (
    <section id="doctors" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[oklch(0.94_0.06_195)] text-health-teal text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Our Team
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-health-navy mb-4">
            Meet Our Expert Doctors
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Highly qualified, compassionate doctors dedicated to your wellbeing.
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No doctors available yet</p>
            <p className="text-sm mt-2">
              Our team is being updated. Please check back soon.
            </p>
          </div>
        ) : (
          /* Cards */
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc, idx) => (
              <motion.div
                key={`${doc.name}-${doc.specialty}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Photo placeholder with gradient */}
                <div className="relative overflow-hidden h-52 bg-gradient-to-br from-[oklch(0.88_0.1_195)] to-[oklch(0.75_0.12_205)]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Stethoscope className="w-16 h-16 text-white/40" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white font-display font-bold text-lg leading-tight drop-shadow-sm">
                      {doc.name}
                    </p>
                    <p className="text-white/80 text-sm font-medium">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-3 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Number(doc.experience)} yrs exp.
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {doc.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    <Users className="w-3.5 h-3.5 inline mr-1" />
                    {Number(doc.patientsCount).toLocaleString()} patients
                    treated
                  </div>

                  <a
                    href="#appointment"
                    className="block text-center bg-health-surface hover:bg-[oklch(0.88_0.09_195)] text-health-teal text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
                  >
                    Book Appointment
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Appointment ----------
function AppointmentSection() {
  const { actor } = useActor();
  const { data: doctors } = useQuery({
    queryKey: ["public-doctors"],
    queryFn: () => actor?.getAllDoctors() ?? Promise.resolve([]),
    enabled: !!actor,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    date: "",
    reason: "",
  });
  const [state, setState] = useState<FormState>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.doctor ||
      !form.date
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!actor) {
      toast.error("Still connecting to backend. Please try again.");
      return;
    }
    setState({ status: "loading" });
    try {
      await actor.addAppointment({
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferredDoctor: form.doctor,
        appointmentDate: form.date,
        reasonForVisit: form.reason,
      });
      setState({ status: "success" });
      toast.success(
        "Appointment booked successfully! We'll contact you shortly.",
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        doctor: "",
        date: "",
        reason: "",
      });
    } catch {
      setState({ status: "error" });
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const isLoading = state.status === "loading";

  return (
    <section id="appointment" className="py-20 bg-health-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[oklch(0.94_0.06_195)] text-health-teal text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Appointments
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-health-navy mb-6">
              Book Your
              <br />
              <span className="text-health-teal">Appointment</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Schedule a visit with our expert doctors. Same-day appointments
              available. Your health is our first priority.
            </p>

            {/* Why choose us */}
            <div className="space-y-4">
              {[
                {
                  icon: Clock,
                  text: "Flexible scheduling — morning, afternoon, and evening slots",
                },
                {
                  icon: Users,
                  text: "50+ specialist doctors across all medical fields",
                },
                {
                  icon: Heart,
                  text: "Compassionate, patient-first care every visit",
                },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[oklch(0.94_0.06_195)] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-health-teal" />
                  </div>
                  <p className="text-foreground/75 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-3xl p-8 shadow-card-hover border border-border/50"
          >
            <h3 className="font-display font-bold text-2xl text-health-navy mb-6">
              Fill in Your Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="appt-name"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="appt-name"
                    data-ocid="appointment.name.input"
                    placeholder="Rahul Kumar"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    className="border-input focus:border-health-teal"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="appt-email"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="appt-email"
                    type="email"
                    data-ocid="appointment.email.input"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    className="border-input focus:border-health-teal"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="appt-phone"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="appt-phone"
                    type="tel"
                    data-ocid="appointment.phone.input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    required
                    className="border-input focus:border-health-teal"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="appt-date"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Appointment Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="appt-date"
                    type="date"
                    data-ocid="appointment.date.input"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                    required
                    className="border-input focus:border-health-teal"
                  />
                </div>
              </div>

              {/* Doctor Select */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">
                  Select Doctor <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.doctor}
                  onValueChange={(v) => setForm((p) => ({ ...p, doctor: v }))}
                >
                  <SelectTrigger
                    data-ocid="appointment.doctor.select"
                    className="border-input"
                  >
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors && doctors.length > 0 ? (
                      doctors.map((doc) => (
                        <SelectItem key={doc.name} value={doc.name}>
                          {doc.name} — {doc.specialty}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Dr. Rajesh Sharma">
                          Dr. Rajesh Sharma — Cardiologist
                        </SelectItem>
                        <SelectItem value="Dr. Priya Patel">
                          Dr. Priya Patel — Pediatrician
                        </SelectItem>
                        <SelectItem value="Dr. Arjun Mehta">
                          Dr. Arjun Mehta — Orthopedics
                        </SelectItem>
                        <SelectItem value="Dr. Sunita Rao">
                          Dr. Sunita Rao — Neurologist
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="appt-reason"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Reason for Visit
                </Label>
                <Textarea
                  id="appt-reason"
                  data-ocid="appointment.reason.textarea"
                  placeholder="Briefly describe your symptoms or reason..."
                  rows={3}
                  value={form.reason}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="border-input focus:border-health-teal resize-none"
                />
              </div>

              {/* Status feedback */}
              <AnimatePresence mode="wait">
                {state.status === "success" && (
                  <motion.div
                    key="success"
                    data-ocid="appointment.success_state"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-[oklch(0.94_0.08_145)] text-[oklch(0.38_0.14_145)] text-sm p-3 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Appointment booked! We'll confirm via email.
                  </motion.div>
                )}
                {state.status === "error" && (
                  <motion.div
                    key="error"
                    data-ocid="appointment.error_state"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-[oklch(0.95_0.06_27)] text-destructive text-sm p-3 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Something went wrong. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                data-ocid="appointment.submit_button"
                disabled={isLoading}
                className="w-full bg-health-teal hover:bg-health-teal-dark text-white font-semibold py-3 rounded-xl transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Contact ----------
function ContactSection() {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<FormState>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!actor) {
      toast.error("Still connecting to backend. Please try again.");
      return;
    }
    setState({ status: "loading" });
    try {
      await actor.addContactMessage({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setState({ status: "success" });
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState({ status: "error" });
      toast.error("Failed to send message. Please try again.");
    }
  };

  const isLoading = state.status === "loading";

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[oklch(0.94_0.06_195)] text-health-teal text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Contact Us
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-health-navy mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're here to help. Reach out anytime and our team will respond
            promptly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Map placeholder / decorative */}
            <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-[oklch(0.88_0.1_195)] to-[oklch(0.75_0.12_195)] flex items-center justify-center">
              <div className="text-center text-white">
                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-lg">Apna Health Care</p>
                <p className="text-sm opacity-80">Mumbai, India</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 space-y-5">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value:
                    "42, Health Avenue, Bandra West\nMumbai, Maharashtra 400050",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 22 1234 5678\n+91 98765 43210",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value:
                    "care@apnahealthcare.in\nappointments@apnahealthcare.in",
                },
                {
                  icon: Clock,
                  label: "Working Hours",
                  value:
                    "Mon – Sat: 8:00 AM – 8:00 PM\nSun: 10:00 AM – 4:00 PM",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 bg-health-surface rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-health-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-health-teal uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border/50"
          >
            <h3 className="font-display font-bold text-2xl text-health-navy mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-name"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-name"
                  data-ocid="contact.name.input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-email"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  data-ocid="contact.email.input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-message"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.message.textarea"
                  placeholder="How can we help you?"
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  className="resize-none"
                />
              </div>

              {/* Status feedback */}
              <AnimatePresence mode="wait">
                {state.status === "success" && (
                  <motion.div
                    key="success"
                    data-ocid="contact.success_state"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-[oklch(0.94_0.08_145)] text-[oklch(0.38_0.14_145)] text-sm p-3 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Message sent! We'll respond within 24 hours.
                  </motion.div>
                )}
                {state.status === "error" && (
                  <motion.div
                    key="error"
                    data-ocid="contact.error_state"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-[oklch(0.95_0.06_27)] text-destructive text-sm p-3 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Failed to send. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                data-ocid="contact.submit_button"
                disabled={isLoading}
                className="w-full bg-health-teal hover:bg-health-teal-dark text-white font-semibold py-3 rounded-xl transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-health-navy text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[oklch(0.62_0.12_195)] rounded-lg flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Apna Health Care
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Compassionate healthcare for every family. Expert doctors, modern
              facilities, and personalized care you can trust.
            </p>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="text-white/60 text-sm">Caring since 2010</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {["Home", "Services", "Doctors", "Appointment", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-[oklch(0.62_0.12_195)]" />
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-white mb-4 text-lg">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {[
                "General Consultation",
                "Cardiology",
                "Pediatrics",
                "Orthopedics",
                "Dentistry",
                "Neurology",
              ].map((svc) => (
                <li key={svc}>
                  <span className="text-white/60 text-sm flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[oklch(0.62_0.12_195)]" />
                    {svc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4 text-lg">
              Contact Info
            </h4>
            <div className="space-y-3">
              {[
                {
                  icon: MapPin,
                  label: "address",
                  text: "42 Health Avenue, Bandra West, Mumbai 400050",
                },
                { icon: Phone, label: "phone", text: "+91 22 1234 5678" },
                { icon: Mail, label: "email", text: "care@apnahealthcare.in" },
                { icon: Clock, label: "hours", text: "Mon–Sat: 8AM – 8PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-[oklch(0.62_0.12_195)] mt-0.5 shrink-0" />
                  <span className="text-white/60 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-sm text-center sm:text-left">
            © {year} Apna Health Care. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with{" "}
            <Heart className="w-3 h-3 inline text-red-400 fill-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------- Public Website ----------
function PublicWebsite({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <div className="min-h-screen">
      <Navbar onAdminClick={onAdminClick} />
      <main>
        <HeroSection />
        <StatsBar />
        <ServicesSection />
        <DoctorsSection />
        <AppointmentSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [route, setRoute] = useState<AppRoute>(getInitialRoute);
  const { isAuthenticated, logout } = useAuth();

  // Listen to hash changes for admin navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/admin") setRoute("admin-dashboard");
      else if (hash === "#/admin/login") setRoute("admin-login");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    if (isAuthenticated) {
      setRoute("admin-dashboard");
    } else {
      setRoute("admin-login");
    }
  };

  const handleLoginSuccess = () => {
    setRoute("admin-dashboard");
  };

  const handleLogout = () => {
    logout();
    setRoute("home");
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <AnimatePresence mode="wait">
        {route === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PublicWebsite onAdminClick={navigateToAdmin} />
          </motion.div>
        )}
        {route === "admin-login" && (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}
        {route === "admin-dashboard" && (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminDashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
