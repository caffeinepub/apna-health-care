import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type PatientDetail = {
    name : Text;
    email : Text;
    phoneNumber : Text;
    preferredDoctor : Text;
    appointmentDate : Text;
    reasonForVisit : Text;
  };

  type Appointment = {
    name : Text;
    email : Text;
    phone : Text;
    preferredDoctor : Text;
    appointmentDate : Text;
    reasonForVisit : Text;
  };

  type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
  };

  type Doctor = {
    name : Text;
    specialty : Text;
    experience : Nat;
    rating : Float;
    patientsCount : Nat;
  };

  type Service = {
    title : Text;
    description : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    patientDetails : List.List<PatientDetail>;
    contactMessages : List.List<ContactMessage>;
  };

  type NewActor = {
    appointments : List.List<Appointment>;
    contactMessages : List.List<ContactMessage>;
    doctors : Map.Map<Nat, Doctor>;
    services : Map.Map<Nat, Service>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextDoctorId : Nat;
    nextServiceId : Nat;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    let appointments = old.patientDetails.map<PatientDetail, Appointment>(
      func(patient) { { patient with phone = patient.phoneNumber } }
    );
    {
      appointments;
      contactMessages = old.contactMessages;
      doctors = Map.empty<Nat, Doctor>();
      services = Map.empty<Nat, Service>();
      userProfiles = Map.empty<Principal, UserProfile>();
      nextDoctorId = 0;
      nextServiceId = 0;
      accessControlState = AccessControl.initState();
    };
  };
};
