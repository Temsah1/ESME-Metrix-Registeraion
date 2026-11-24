export interface Registrant {
  id: string;
  full_name: string;
  phone: string;
  email: string;
<<<<<<< HEAD
  national_id?: string | null;
  graduation_year?: string | null;
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  university: string;
  faculty: string;
  academic_year: string;
  city: string;
  job_title: string;
  company?: string | null;
  id_photo_url: string;
  karnet_photo_url: string;
<<<<<<< HEAD
  avatar_url?: string | null;
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
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
<<<<<<< HEAD
  nationalId?: string;
  graduationYear?: string;
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  city: string;
  university: string;
  faculty: string;
  academicYear: string;
  jobTitle: string;
  company?: string;
  idPhotoUrl: string;
  karnetPhotoUrl: string;
<<<<<<< HEAD
  avatarUrl?: string;
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  termsAccepted: boolean;
}

export interface QRPayload {
  id: string;
  registrant_id: string;
  event: string;
  hash: string;
}
