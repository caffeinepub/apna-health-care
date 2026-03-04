import type { Doctor, Service } from "@/backend.d";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Cross,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  Stethoscope,
  Trash2,
  type Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type AdminTab =
  | "dashboard"
  | "appointments"
  | "messages"
  | "doctors"
  | "services";

interface AdminDashboardProps {
  onLogout: () => void;
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS: {
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "services", label: "Services", icon: Activity },
];

function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  mobileOpen,
  onMobileClose,
}: {
  activeTab: AdminTab;
  onTabChange: (t: AdminTab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : undefined }}
        className={`
          fixed top-0 left-0 h-full w-64 bg-health-navy z-50 flex flex-col
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[oklch(0.62_0.12_195)] rounded-lg flex items-center justify-center">
            <Cross className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-tight">
              Apna Health
            </p>
            <p className="text-xs text-white/40 font-medium">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto lg:hidden text-white/50 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`admin.nav.${item.id}.link`}
                onClick={() => {
                  onTabChange(item.id);
                  onMobileClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[oklch(0.62_0.12_195)] text-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  }
                `}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            data-ocid="admin.nav.logout.button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/15 transition-all duration-200"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  ocid,
  loading,
}: {
  title: string;
  value: number | string;
  icon: typeof Users;
  color: string;
  ocid: string;
  loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid={ocid}
      className="bg-card rounded-2xl p-6 border border-border/60 shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-9 w-16 mb-1" />
      ) : (
        <div className="font-display font-bold text-3xl text-health-navy mb-1">
          {value}
        </div>
      )}
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
    </motion.div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const { actor, isFetching } = useActor();

  const { data: appointments = [], isLoading: loadingAppts } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => actor?.getAllAppointments() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const { data: messages = [], isLoading: loadingMsgs } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => actor?.getAllContactMessages() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const { data: doctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: () => actor?.getAllDoctors() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => actor?.getAllServices() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const statsLoading =
    loadingAppts || loadingMsgs || loadingDoctors || loadingServices;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-2xl text-health-navy mb-1">
          Overview
        </h2>
        <p className="text-muted-foreground text-sm">
          Real-time stats for Apna Health Care
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          ocid="admin.dashboard.card.1"
          title="Total Appointments"
          value={appointments.length}
          icon={CalendarDays}
          color="bg-health-teal"
          loading={statsLoading}
        />
        <StatCard
          ocid="admin.dashboard.card.2"
          title="Total Messages"
          value={messages.length}
          icon={MessageSquare}
          color="bg-[oklch(0.55_0.16_32)]"
          loading={statsLoading}
        />
        <StatCard
          ocid="admin.dashboard.card.3"
          title="Total Doctors"
          value={doctors.length}
          icon={Stethoscope}
          color="bg-[oklch(0.52_0.14_145)]"
          loading={statsLoading}
        />
        <StatCard
          ocid="admin.dashboard.card.4"
          title="Total Services"
          value={services.length}
          icon={Activity}
          color="bg-[oklch(0.48_0.14_260)]"
          loading={statsLoading}
        />
      </div>

      {/* Recent appointments preview */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display font-semibold text-health-navy">
            Recent Appointments
          </h3>
          <Badge
            variant="outline"
            className="text-xs text-health-teal border-health-teal/30"
          >
            {appointments.length} total
          </Badge>
        </div>
        {loadingAppts ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No appointments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                    Doctor
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appt) => (
                  <tr
                    key={`${appt.name}-${appt.appointmentDate}-${appt.email}`}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-health-navy">
                      {appt.name}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground hidden sm:table-cell">
                      {appt.preferredDoctor}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">
                      {appt.appointmentDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Appointments Tab ───────────────────────────────────────────────────────────
function AppointmentsTab() {
  const { actor, isFetching } = useActor();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => actor?.getAllAppointments() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-health-navy mb-1">
            Appointments
          </h2>
          <p className="text-muted-foreground text-sm">
            All patient appointment bookings
          </p>
        </div>
        <Badge className="bg-health-teal/10 text-health-teal border-health-teal/20">
          {appointments.length} total
        </Badge>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="admin.appointments.loading_state"
            className="p-8 space-y-3"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div
            data-ocid="admin.appointments.empty_state"
            className="py-16 text-center"
          >
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-semibold text-muted-foreground mb-1">
              No appointments yet
            </p>
            <p className="text-sm text-muted-foreground/70">
              Appointments will appear here once patients book them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="admin.appointments.table">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                    Doctor
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden xl:table-cell">
                    Reason
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt, i) => (
                  <TableRow
                    key={`${appt.email}-${appt.appointmentDate}`}
                    data-ocid={`admin.appointments.item.${i + 1}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-medium text-health-navy">
                      {appt.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {appt.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                      {appt.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                      {appt.preferredDoctor}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                      {appt.appointmentDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden xl:table-cell max-w-xs truncate">
                      {appt.reasonForVisit || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Messages Tab ───────────────────────────────────────────────────────────────
function MessagesTab() {
  const { actor, isFetching } = useActor();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => actor?.getAllContactMessages() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-health-navy mb-1">
            Contact Messages
          </h2>
          <p className="text-muted-foreground text-sm">
            Messages from the contact form
          </p>
        </div>
        <Badge className="bg-health-teal/10 text-health-teal border-health-teal/20">
          {messages.length} total
        </Badge>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="admin.messages.loading_state"
            className="p-8 space-y-3"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div
            data-ocid="admin.messages.empty_state"
            className="py-16 text-center"
          >
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-semibold text-muted-foreground mb-1">
              No messages yet
            </p>
            <p className="text-sm text-muted-foreground/70">
              Contact form submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="admin.messages.table">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Message
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg, i) => (
                  <TableRow
                    key={`${msg.email}-${msg.name}`}
                    data-ocid={`admin.messages.item.${i + 1}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-medium text-health-navy whitespace-nowrap">
                      {msg.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {msg.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-sm">
                      <p className="line-clamp-2">{msg.message}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Doctor Form ────────────────────────────────────────────────────────────────
interface DoctorFormData {
  name: string;
  specialty: string;
  experience: string;
  rating: string;
  patientsCount: string;
}

const EMPTY_DOCTOR: DoctorFormData = {
  name: "",
  specialty: "",
  experience: "",
  rating: "",
  patientsCount: "",
};

function DoctorFormFields({
  form,
  onChange,
}: {
  form: DoctorFormData;
  onChange: (key: keyof DoctorFormData, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="doc-name" className="text-sm font-semibold">
            Doctor Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="doc-name"
            data-ocid="admin.doctors.add.name.input"
            placeholder="Dr. Rajesh Sharma"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="doc-specialty" className="text-sm font-semibold">
            Specialty <span className="text-destructive">*</span>
          </Label>
          <Input
            id="doc-specialty"
            data-ocid="admin.doctors.add.specialty.input"
            placeholder="Cardiologist"
            value={form.specialty}
            onChange={(e) => onChange("specialty", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doc-exp" className="text-sm font-semibold">
            Experience (years) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="doc-exp"
            type="number"
            min="0"
            data-ocid="admin.doctors.add.experience.input"
            placeholder="12"
            value={form.experience}
            onChange={(e) => onChange("experience", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doc-patients" className="text-sm font-semibold">
            Patients Count <span className="text-destructive">*</span>
          </Label>
          <Input
            id="doc-patients"
            type="number"
            min="0"
            data-ocid="admin.doctors.add.patientscount.input"
            placeholder="2400"
            value={form.patientsCount}
            onChange={(e) => onChange("patientsCount", e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="doc-rating" className="text-sm font-semibold">
            Rating (0–5) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="doc-rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            data-ocid="admin.doctors.add.rating.input"
            placeholder="4.8"
            value={form.rating}
            onChange={(e) => onChange("rating", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Doctors Tab ────────────────────────────────────────────────────────────────
function DoctorsTab() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<DoctorFormData>(EMPTY_DOCTOR);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: () => actor?.getAllDoctors() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const validateForm = (f: DoctorFormData): string | null => {
    if (!f.name.trim()) return "Doctor name is required.";
    if (!f.specialty.trim()) return "Specialty is required.";
    if (!f.experience || Number.isNaN(Number(f.experience)))
      return "Valid experience is required.";
    if (
      !f.rating ||
      Number.isNaN(Number(f.rating)) ||
      Number(f.rating) < 0 ||
      Number(f.rating) > 5
    )
      return "Rating must be between 0 and 5.";
    if (!f.patientsCount || Number.isNaN(Number(f.patientsCount)))
      return "Patients count is required.";
    return null;
  };

  const buildDoctor = (f: DoctorFormData): Doctor => ({
    name: f.name.trim(),
    specialty: f.specialty.trim(),
    experience: BigInt(Math.floor(Number(f.experience))),
    rating: Number(f.rating),
    patientsCount: BigInt(Math.floor(Number(f.patientsCount))),
  });

  const addMutation = useMutation({
    mutationFn: async (doctor: Doctor) => {
      if (!actor) throw new Error("Not connected");
      await actor.addDoctor(doctor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["public-doctors"] });
      toast.success("Doctor added successfully!");
      setAddOpen(false);
      setForm(EMPTY_DOCTOR);
      setFormError(null);
    },
    onError: () => toast.error("Failed to add doctor. Please try again."),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, doctor }: { id: bigint; doctor: Doctor }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateDoctor(id, doctor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["public-doctors"] });
      toast.success("Doctor updated successfully!");
      setEditOpen(false);
      setForm(EMPTY_DOCTOR);
      setFormError(null);
    },
    onError: () => toast.error("Failed to update doctor. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteDoctor(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["public-doctors"] });
      toast.success("Doctor removed.");
    },
    onError: () => toast.error("Failed to delete doctor."),
  });

  const handleAddSubmit = () => {
    const err = validateForm(form);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    addMutation.mutate(buildDoctor(form));
  };

  const handleEditSubmit = () => {
    if (editIndex === null) return;
    const err = validateForm(form);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    updateMutation.mutate({ id: BigInt(editIndex), doctor: buildDoctor(form) });
  };

  const openEdit = (doc: Doctor, idx: number) => {
    setEditIndex(idx);
    setForm({
      name: doc.name,
      specialty: doc.specialty,
      experience: String(Number(doc.experience)),
      rating: String(doc.rating),
      patientsCount: String(Number(doc.patientsCount)),
    });
    setFormError(null);
    setEditOpen(true);
  };

  const updateFormField = useCallback(
    (key: keyof DoctorFormData, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-2xl text-health-navy mb-1">
            Doctors
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage the medical team
          </p>
        </div>

        {/* Add Doctor Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="admin.doctors.add.open_modal_button"
              className="bg-health-teal hover:bg-health-teal-dark text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="admin.doctors.add.dialog"
            className="sm:max-w-md"
          >
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-health-navy">
                Add New Doctor
              </DialogTitle>
            </DialogHeader>
            {formError && (
              <div className="flex items-start gap-2 bg-[oklch(0.95_0.06_27)] text-destructive text-sm p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {formError}
              </div>
            )}
            <DoctorFormFields form={form} onChange={updateFormField} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setAddOpen(false);
                  setForm(EMPTY_DOCTOR);
                  setFormError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="admin.doctors.add.submit_button"
                onClick={handleAddSubmit}
                disabled={addMutation.isPending}
                className="bg-health-teal hover:bg-health-teal-dark text-white"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Doctor"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Doctor Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-health-navy">
              Edit Doctor
            </DialogTitle>
          </DialogHeader>
          {formError && (
            <div className="flex items-start gap-2 bg-[oklch(0.95_0.06_27)] text-destructive text-sm p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {formError}
            </div>
          )}
          <DoctorFormFields form={form} onChange={updateFormField} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditOpen(false);
                setForm(EMPTY_DOCTOR);
                setFormError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.doctors.edit.submit_button"
              onClick={handleEditSubmit}
              disabled={updateMutation.isPending}
              className="bg-health-teal hover:bg-health-teal-dark text-white"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctors List */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div
          data-ocid="admin.doctors.empty_state"
          className="bg-card rounded-2xl border border-border/60 py-16 text-center"
        >
          <Stethoscope className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-semibold text-muted-foreground mb-1">
            No doctors added yet
          </p>
          <p className="text-sm text-muted-foreground/70">
            Click "Add Doctor" to get started.
          </p>
        </div>
      ) : (
        <div
          data-ocid="admin.doctors.list"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {doctors.map((doc, idx) => (
            <motion.div
              key={`${doc.name}-${doc.specialty}`}
              data-ocid={`admin.doctors.item.${idx + 1}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-card rounded-2xl border border-border/60 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[oklch(0.94_0.06_195)] rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-health-teal" />
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 text-sm font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {doc.rating.toFixed(1)}
                </div>
              </div>
              <h3 className="font-display font-bold text-health-navy text-base leading-tight mb-1">
                {doc.name}
              </h3>
              <p className="text-health-teal text-sm font-semibold mb-2">
                {doc.specialty}
              </p>
              <div className="text-xs text-muted-foreground space-y-0.5 mb-4">
                <p>{Number(doc.experience)} yrs experience</p>
                <p>{Number(doc.patientsCount).toLocaleString()} patients</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`admin.doctors.edit_button.${idx + 1}`}
                  onClick={() => openEdit(doc, idx)}
                  className="flex-1 h-8 text-xs hover:border-health-teal hover:text-health-teal"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.doctors.delete_button.${idx + 1}`}
                      className="flex-1 h-8 text-xs hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Doctor?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove{" "}
                        <strong>{doc.name}</strong>? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        data-ocid={`admin.doctors.delete.cancel_button.${idx + 1}`}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid={`admin.doctors.delete.confirm_button.${idx + 1}`}
                        onClick={() => deleteMutation.mutate(BigInt(idx))}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Services Tab ───────────────────────────────────────────────────────────────
interface ServiceFormData {
  title: string;
  description: string;
}

const EMPTY_SERVICE: ServiceFormData = { title: "", description: "" };

function ServicesTab() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceFormData>(EMPTY_SERVICE);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => actor?.getAllServices() ?? Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error("Not connected");
      await actor.addService(service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["public-services"] });
      toast.success("Service added successfully!");
      setAddOpen(false);
      setForm(EMPTY_SERVICE);
      setFormError(null);
    },
    onError: () => toast.error("Failed to add service."),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, service }: { id: bigint; service: Service }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateService(id, service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["public-services"] });
      toast.success("Service updated successfully!");
      setEditOpen(false);
      setForm(EMPTY_SERVICE);
      setFormError(null);
    },
    onError: () => toast.error("Failed to update service."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["public-services"] });
      toast.success("Service removed.");
    },
    onError: () => toast.error("Failed to delete service."),
  });

  const validateService = (f: ServiceFormData): string | null => {
    if (!f.title.trim()) return "Title is required.";
    if (!f.description.trim()) return "Description is required.";
    return null;
  };

  const handleAddSubmit = () => {
    const err = validateService(form);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    addMutation.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  const handleEditSubmit = () => {
    if (editIndex === null) return;
    const err = validateService(form);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    updateMutation.mutate({
      id: BigInt(editIndex),
      service: {
        title: form.title.trim(),
        description: form.description.trim(),
      },
    });
  };

  const openEdit = (svc: Service, idx: number) => {
    setEditIndex(idx);
    setForm({ title: svc.title, description: svc.description });
    setFormError(null);
    setEditOpen(true);
  };

  const ServiceFormFields = ({
    f,
    onUpdate,
  }: {
    f: ServiceFormData;
    onUpdate: (k: keyof ServiceFormData, v: string) => void;
  }) => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Service Title <span className="text-destructive">*</span>
        </Label>
        <Input
          data-ocid="admin.services.add.title.input"
          placeholder="General Consultation"
          value={f.title}
          onChange={(e) => onUpdate("title", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          data-ocid="admin.services.add.description.textarea"
          placeholder="Brief description of the service..."
          rows={3}
          value={f.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          className="resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-2xl text-health-navy mb-1">
            Services
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage medical services offered
          </p>
        </div>

        {/* Add Service Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="admin.services.add.open_modal_button"
              className="bg-health-teal hover:bg-health-teal-dark text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="admin.services.add.dialog"
            className="sm:max-w-md"
          >
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-health-navy">
                Add New Service
              </DialogTitle>
            </DialogHeader>
            {formError && (
              <div className="flex items-start gap-2 bg-[oklch(0.95_0.06_27)] text-destructive text-sm p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {formError}
              </div>
            )}
            <ServiceFormFields
              f={form}
              onUpdate={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setAddOpen(false);
                  setForm(EMPTY_SERVICE);
                  setFormError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="admin.services.submit_button"
                onClick={handleAddSubmit}
                disabled={addMutation.isPending}
                className="bg-health-teal hover:bg-health-teal-dark text-white"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Service"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-health-navy">
              Edit Service
            </DialogTitle>
          </DialogHeader>
          {formError && (
            <div className="flex items-start gap-2 bg-[oklch(0.95_0.06_27)] text-destructive text-sm p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {formError}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">
                Service Title <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="General Consultation"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Brief description of the service..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditOpen(false);
                setForm(EMPTY_SERVICE);
                setFormError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.services.edit.submit_button"
              onClick={handleEditSubmit}
              disabled={updateMutation.isPending}
              className="bg-health-teal hover:bg-health-teal-dark text-white"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Services List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div
          data-ocid="admin.services.empty_state"
          className="bg-card rounded-2xl border border-border/60 py-16 text-center"
        >
          <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-semibold text-muted-foreground mb-1">
            No services added yet
          </p>
          <p className="text-sm text-muted-foreground/70">
            Click "Add Service" to get started.
          </p>
        </div>
      ) : (
        <div
          data-ocid="admin.services.list"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((svc, idx) => (
            <motion.div
              key={svc.title}
              data-ocid={`admin.services.item.${idx + 1}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="bg-card rounded-2xl border border-border/60 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="w-10 h-10 bg-[oklch(0.94_0.05_260)] rounded-xl flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-[oklch(0.48_0.14_260)]" />
              </div>
              <h3 className="font-display font-bold text-health-navy text-base mb-2">
                {svc.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                {svc.description}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`admin.services.edit_button.${idx + 1}`}
                  onClick={() => openEdit(svc, idx)}
                  className="flex-1 h-8 text-xs hover:border-health-teal hover:text-health-teal"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.services.delete_button.${idx + 1}`}
                      className="flex-1 h-8 text-xs hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove{" "}
                        <strong>{svc.title}</strong>? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid={`admin.services.delete.confirm_button.${idx + 1}`}
                        onClick={() => deleteMutation.mutate(BigInt(idx))}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { principal } = useAuth();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-health-surface flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border/60 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-health-surface transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="font-display font-bold text-health-navy text-lg capitalize">
              {activeTab}
            </h1>
          </div>

          {principal && (
            <div className="hidden sm:flex items-center gap-2 bg-health-surface rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.14_145)]" />
              <span className="text-xs text-muted-foreground font-mono truncate max-w-32">
                {principal.slice(0, 12)}…
              </span>
            </div>
          )}

          <button
            type="button"
            data-ocid="admin.topbar.logout.button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "appointments" && <AppointmentsTab />}
              {activeTab === "messages" && <MessagesTab />}
              {activeTab === "doctors" && <DoctorsTab />}
              {activeTab === "services" && <ServicesTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
