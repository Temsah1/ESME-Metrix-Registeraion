export interface Registrant {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  national_id?: string | null;
  graduation_year?: string | null;
  university: string;
  faculty: string;
  department?: string | null;
  academic_year: string;
  city: string;
  job_title: string;
  company?: string | null;
  is_esme_member?: boolean;
  committee?: string | null;
  role?: string | null;
  id_photo_url: string;
  karnet_photo_url?: string | null;
  avatar_url?: string | null;
  qr_code: string;
  registration_id: string;
  linkedin_shared: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  registrant_id: string;
  scanned_by: string;
  scanned_at: string;
  notes?: string | null;
  registrant?: Registrant;
}

export interface RegistrationFormData {
  fullName: string;
  phone: string;
  email: string;
  nationalId: string;
  graduationYear: string;
  city: string;
  university: string;
  faculty: string;
  department: string;
  customMajor?: string;
  academicYear: string;
  jobTitle: string;
  company?: string;
  isEsmeMember: boolean;
  committee?: string;
  role?: string;
  idPhotoUrl: string;
  avatarUrl?: string;
  termsAccepted: boolean;
}

export interface QRPayload {
  id: string;
  registrant_id: string;
  event: string;
  hash: string;
}
