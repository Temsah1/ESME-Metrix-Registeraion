export interface Registrant {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  university: string;
  faculty: string;
  academic_year: string;
  city: string;
  job_title: string;
  company?: string | null;
  avatar_url?: string | null;
  id_photo_url: string;
  karnet_photo_url: string;
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
  city: string;
  university: string;
  faculty: string;
  academicYear: string;
  jobTitle: string;
  company?: string;
  avatarUrl?: string;
  idPhotoUrl: string;
  karnetPhotoUrl: string;
  termsAccepted: boolean;
}

export interface QRPayload {
  id: string;
  registrant_id: string;
  event: string;
  hash: string;
}

export interface SiteContent {
  key: string;
  value: string;
  label: string;
  category: string;
  field_type: string;
  updated_at: string;
}
