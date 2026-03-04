import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Type Definitions
  public type Appointment = {
    name : Text;
    email : Text;
    phone : Text;
    preferredDoctor : Text;
    appointmentDate : Text;
    reasonForVisit : Text;
  };

  public type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
  };

  public type Doctor = {
    name : Text;
    specialty : Text;
    experience : Nat;
    rating : Float;
    patientsCount : Nat;
  };

  public type Service = {
    title : Text;
    description : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let doctors = Map.empty<Nat, Doctor>();
  let services = Map.empty<Nat, Service>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextDoctorId = 0;
  var nextServiceId = 0;

  let appointments = List.empty<Appointment>();
  let contactMessages = List.empty<ContactMessage>();

  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Appointments
  public shared ({ caller }) func addAppointment(appointment : Appointment) : async () {
    appointments.add(appointment);
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    appointments.toArray();
  };

  // Contact Messages
  public shared ({ caller }) func addContactMessage(message : ContactMessage) : async () {
    contactMessages.add(message);
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    contactMessages.toArray();
  };

  // Doctors Management
  public shared ({ caller }) func addDoctor(doctor : Doctor) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    doctors.add(nextDoctorId, doctor);
    nextDoctorId += 1;
  };

  public shared ({ caller }) func updateDoctor(id : Nat, doctor : Doctor) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not doctors.containsKey(id)) {
      Runtime.trap("Doctor not found");
    };
    doctors.add(id, doctor);
  };

  public shared ({ caller }) func deleteDoctor(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not doctors.containsKey(id)) {
      Runtime.trap("Doctor not found");
    };
    doctors.remove(id);
  };

  public query ({ caller }) func getAllDoctors() : async [Doctor] {
    doctors.values().toArray();
  };

  // Services Management
  public shared ({ caller }) func addService(service : Service) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    services.add(nextServiceId, service);
    nextServiceId += 1;
  };

  public shared ({ caller }) func updateService(id : Nat, service : Service) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not services.containsKey(id)) {
      Runtime.trap("Service not found");
    };
    services.add(id, service);
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not services.containsKey(id)) {
      Runtime.trap("Service not found");
    };
    services.remove(id);
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray();
  };
};
