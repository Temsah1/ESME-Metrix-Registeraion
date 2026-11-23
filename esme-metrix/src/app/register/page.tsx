"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  completeRegistrationSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  CompleteRegistrationInput,
} from "@/lib/validations/registration";
import PhotoUpload from "@/components/PhotoUpload";
import {
  User,
  GraduationCap,
  FileCheck2,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Phone,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react";

const STEPS = [
  { id: 1, name: "Personal", icon: User },
  { id: 2, name: "Academic", icon: GraduationCap },
  { id: 3, name: "Documents", icon: FileCheck2 },
  { id: 4, name: "Review", icon: Send },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CompleteRegistrationInput>({
    resolver: zodResolver(completeRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "Cairo",
      university: "",
      faculty: "",
      academicYear: "3rd",
      jobTitle: "Student",
      company: "",
      idPhotoUrl: "",
      karnetPhotoUrl: "",
      termsAccepted: false,
    },
  });

  const formData = watch();

  const handleNextStep = useCallback(async () => {
    setServerError(null);
    let stepValid = false;

    if (currentStep === 1) {
      stepValid = await trigger(["fullName", "phone", "email", "city"]);
    } else if (currentStep === 2) {
      stepValid = await trigger(["university", "faculty", "academicYear", "jobTitle", "company"]);
    } else if (currentStep === 3) {
      stepValid = await trigger(["idPhotoUrl", "karnetPhotoUrl"]);
    }

    if (stepValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  }, [currentStep, trigger]);

  const handlePrevStep = useCallback(() => {
    setServerError(null);
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const onSubmit = async (data: CompleteRegistrationInput) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Registration could not be completed.");
        setSubmitting(false);
        return;
      }

      // Store registration data in sessionStorage for the Success Page
      sessionStorage.setItem("esme_metrix_registration", JSON.stringify(result));
      router.push("/success");
    } catch {
      setServerError("Network error. Please verify your connection.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-3 py-1 rounded-full border border-[#00C9A7]/30 bg-[#111820] text-[#00C9A7] font-mono text-xs mb-3">
          ATTENDEE ONBOARDING WIZARD
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Event Registration & Digital Credential
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          Complete the four steps below to secure your verified badge for ESME Metrix 2026.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10">
        <div className="grid grid-cols-4 gap-2 relative">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-[#00C9A7] text-[#0A0F14]"
                      : isActive
                      ? "bg-[#111820] text-[#00C9A7] border-2 border-[#00C9A7] shadow-[0_0_15px_rgba(0,201,167,0.3)]"
                      : "bg-[#111820] text-slate-500 border border-slate-800"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] font-medium mt-2 hidden sm:block ${
                    isActive ? "text-[#00C9A7]" : isCompleted ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Track Bar */}
        <div className="w-full h-1 bg-[#111820] rounded-full mt-4 overflow-hidden border border-[#00C9A7]/10">
          <div
            className="h-full bg-gradient-to-r from-[#00C9A7] to-[#2DD4BF] transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-[#00C9A7]/20 bg-[#111820]/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl"
      >
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Animated Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-5"
          >
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#00C9A7]" /> Personal Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">Provide your legal name and contact credentials.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Name <span className="text-[#00C9A7]">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="e.g. Omar Hassan El-Sayed"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
                />
              </div>
              {errors.fullName && (
                <span className="text-xs text-red-400">{errors.fullName.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#00C9A7]" /> Phone Number <span className="text-[#00C9A7]">*</span>
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="01012345678"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm font-mono transition-colors"
                />
                <span className="text-[10px] text-slate-500 font-mono">Egyptian format: 010, 011, 012, 015</span>
                {errors.phone && <span className="text-xs text-red-400">{errors.phone.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#00C9A7]" /> Email Address <span className="text-[#00C9A7]">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="omar.sayed@gmail.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
                />
                {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00C9A7]" /> City of Residence <span className="text-[#00C9A7]">*</span>
              </label>
              <select
                {...register("city")}
                className="w-full h-11 px-3 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
              >
                <option value="Cairo">Cairo</option>
                <option value="Giza">Giza</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Mansoura">Mansoura</option>
                <option value="Zagazig">Zagazig</option>
                <option value="Tanta">Tanta</option>
                <option value="Assiut">Assiut</option>
                <option value="Suez">Suez</option>
                <option value="Ismailia">Ismailia</option>
                <option value="Port Said">Port Said</option>
                <option value="Other">Other Governorate</option>
              </select>
              {errors.city && <span className="text-xs text-red-400">{errors.city.message}</span>}
            </div>
          </motion.div>
        )}

        {/* STEP 2: ACADEMIC & PROFESSIONAL */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-5"
          >
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00C9A7]" /> Academic & Professional Info
              </h2>
              <p className="text-xs text-slate-400 mt-1">Specify your current university and engineering specialization.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#00C9A7]" /> University <span className="text-[#00C9A7]">*</span>
                </label>
                <input
                  {...register("university")}
                  type="text"
                  placeholder="e.g. Cairo University"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
                />
                {errors.university && <span className="text-xs text-red-400">{errors.university.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Faculty / Department <span className="text-[#00C9A7]">*</span>
                </label>
                <input
                  {...register("faculty")}
                  type="text"
                  placeholder="e.g. Faculty of Engineering - Mechanical"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
                />
                {errors.faculty && <span className="text-xs text-red-400">{errors.faculty.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Academic Year <span className="text-[#00C9A7]">*</span>
                </label>
                <select
                  {...register("academicYear")}
                  className="w-full h-11 px-3 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
                >
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Alumni">Alumni</option>
                </select>
                {errors.academicYear && <span className="text-xs text-red-400">{errors.academicYear.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00C9A7]" /> Job Title <span className="text-[#00C9A7]">*</span>
                </label>
                <input
                  {...register("jobTitle")}
                  type="text"
                  placeholder="Student or Quality Inspection Eng."
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
                />
                {errors.jobTitle && <span className="text-xs text-red-400">{errors.jobTitle.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Company / Organization <span className="text-slate-500 font-normal">(Optional for students)</span>
              </label>
              <input
                {...register("company")}
                type="text"
                placeholder="Company Name (if applicable)"
                className="w-full h-11 px-3.5 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-white placeholder-slate-600 focus:outline-none focus:border-[#00C9A7] text-sm transition-colors"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 3: DOCUMENT UPLOADS */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-6"
          >
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#00C9A7]" /> Identity Verification Documents
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload clear front-facing photos of your National ID and Student Karnet for verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PhotoUpload
                label="National ID Card (Front)"
                sublabel="Front side with legible name & national number"
                value={formData.idPhotoUrl}
                onChange={(url) => setValue("idPhotoUrl", url, { shouldValidate: true })}
                error={errors.idPhotoUrl?.message}
              />

              <PhotoUpload
                label="Student Karnet / Academic Card"
                sublabel="Proof of active enrollment or university affiliation"
                value={formData.karnetPhotoUrl}
                onChange={(url) => setValue("karnetPhotoUrl", url, { shouldValidate: true })}
                error={errors.karnetPhotoUrl?.message}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-5"
          >
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-[#00C9A7]" /> Review & Finalize Submission
              </h2>
              <p className="text-xs text-slate-400 mt-1">Carefully verify your details before generating your Metrix QR code.</p>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-xl bg-[#0A0F14] border border-[#00C9A7]/20 text-xs sm:text-sm flex flex-col gap-3 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500">Full Name:</span> {formData.fullName}
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span> {formData.phone}
                </div>
                <div>
                  <span className="text-slate-500">Email:</span> {formData.email}
                </div>
                <div>
                  <span className="text-slate-500">City:</span> {formData.city}
                </div>
                <div>
                  <span className="text-slate-500">University:</span> {formData.university}
                </div>
                <div>
                  <span className="text-slate-500">Faculty:</span> {formData.faculty}
                </div>
                <div>
                  <span className="text-slate-500">Year:</span> {formData.academicYear}
                </div>
                <div>
                  <span className="text-slate-500">Job Title:</span> {formData.jobTitle}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center gap-4">
                <span className="text-slate-500">Documents Attached:</span>
                <span className="text-[#00C9A7] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> National ID
                </span>
                <span className="text-[#00C9A7] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Student Karnet
                </span>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <input
                {...register("termsAccepted")}
                id="termsAccepted"
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-[#0A0F14] text-[#00C9A7] focus:ring-[#00C9A7]"
              />
              <label htmlFor="termsAccepted" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                I hereby declare that all submitted personal & academic information is accurate and authentic.
                I agree to adhere to ESME Cairo University Chapter event protocols and consent to identity scanning on event day.
              </label>
            </div>
            {errors.termsAccepted && (
              <span className="text-xs text-red-400">{errors.termsAccepted.message}</span>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#00C9A7] text-[#0A0F14] hover:bg-[#2DD4BF] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,201,167,0.25)]"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#00C9A7] to-[#007A65] text-[#0A0F14] hover:brightness-110 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,201,167,0.35)] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> SUBMIT REGISTRATION
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
