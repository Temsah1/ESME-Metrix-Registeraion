"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
import {
  completeRegistrationSchema,
  step1Schema,
  step2Schema,
  step3Schema,
<<<<<<< HEAD
  CAIRO_ENG_DEPARTMENTS,
  CompleteRegistrationInput,
} from "@/lib/validations/registration";
import PhotoUpload from "@/components/PhotoUpload";
import AnimatedField from "@/components/motion/AnimatedField";
import {
  stepVariants,
  containerStagger,
  buttonTapMotion,
} from "@/components/motion/MotionTokens";
=======
  CompleteRegistrationInput,
} from "@/lib/validations/registration";
import PhotoUpload from "@/components/PhotoUpload";
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
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
<<<<<<< HEAD
  CreditCard,
  Calendar,
  Award,
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
} from "lucide-react";

const STEPS = [
  { id: 1, name: "Personal", icon: User },
  { id: 2, name: "Academic", icon: GraduationCap },
  { id: 3, name: "Documents", icon: FileCheck2 },
  { id: 4, name: "Review", icon: Send },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
<<<<<<< HEAD
  const [direction, setDirection] = useState(1);
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CompleteRegistrationInput>({
    resolver: zodResolver(completeRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
<<<<<<< HEAD
      nationalId: "",
      phone: "",
      email: "",
      city: "Cairo",
      university: "Cairo University",
      faculty: CAIRO_ENG_DEPARTMENTS[0],
      academicYear: "3rd",
      graduationYear: "2026",
=======
      phone: "",
      email: "",
      city: "Cairo",
      university: "",
      faculty: "",
      academicYear: "3rd",
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      jobTitle: "Student",
      company: "",
      idPhotoUrl: "",
      karnetPhotoUrl: "",
      avatarUrl: "",
      termsAccepted: false,
    },
  });

  const formData = watch();

  const handleNext = async () => {
    setServerError(null);

    if (currentStep === 1) {
      const step1Result = step1Schema.safeParse({
        fullName: getValues("fullName"),
<<<<<<< HEAD
        nationalId: getValues("nationalId"),
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        phone: getValues("phone"),
        email: getValues("email"),
        city: getValues("city"),
      });

      if (!step1Result.success) {
        step1Result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CompleteRegistrationInput;
          setError(field, { type: "manual", message: issue.message });
        });
        setServerError(
          step1Result.error.issues[0]?.message ||
<<<<<<< HEAD
            "Please complete all required personal details including National ID."
=======
            "Please complete all required personal details before continuing."
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        );
        return;
      }

<<<<<<< HEAD
      clearErrors(["fullName", "nationalId", "phone", "email", "city"]);
      setDirection(1);
=======
      clearErrors(["fullName", "phone", "email", "city"]);
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 2) {
      const step2Result = step2Schema.safeParse({
        university: getValues("university"),
        faculty: getValues("faculty"),
        academicYear: getValues("academicYear"),
<<<<<<< HEAD
        graduationYear: getValues("graduationYear"),
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        jobTitle: getValues("jobTitle"),
        company: getValues("company") || undefined,
      });

      if (!step2Result.success) {
        step2Result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CompleteRegistrationInput;
          setError(field, { type: "manual", message: issue.message });
        });
        setServerError(
          step2Result.error.issues[0]?.message ||
            "Please complete all required academic fields before continuing."
        );
        return;
      }

<<<<<<< HEAD
      clearErrors(["university", "faculty", "academicYear", "graduationYear", "jobTitle", "company"]);
      setDirection(1);
=======
      clearErrors(["university", "faculty", "academicYear", "jobTitle", "company"]);
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 3) {
      const step3Result = step3Schema.safeParse({
        idPhotoUrl: getValues("idPhotoUrl"),
        karnetPhotoUrl: getValues("karnetPhotoUrl"),
        avatarUrl: getValues("avatarUrl") || undefined,
      });

      if (!step3Result.success) {
        step3Result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CompleteRegistrationInput;
          setError(field, { type: "manual", message: issue.message });
        });
        setServerError(
          step3Result.error.issues[0]?.message ||
            "Please upload both required verification documents before continuing."
        );
        return;
      }

      clearErrors(["idPhotoUrl", "karnetPhotoUrl", "avatarUrl"]);
<<<<<<< HEAD
      setDirection(1);
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  const handleBack = () => {
    setServerError(null);
<<<<<<< HEAD
    setDirection(-1);
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

<<<<<<< HEAD
=======
      // Store registration data in sessionStorage for the Success Page
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      sessionStorage.setItem("esme_metrix_registration", JSON.stringify(result));
      router.push("/success");
    } catch {
      setServerError("Network error. Please verify your connection.");
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  // Real-time valid flags for micro-checkmarks
  const isFullNameValid = (formData.fullName || "").trim().length >= 3;
  const isNationalIdValid = /^[23][0-9]{13}$/.test(formData.nationalId || "");
  const isPhoneValid = /^01[0125][0-9]{8}$/.test(formData.phone || "");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "");

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Official Certificate Announcement Card with Shimmer & Spring */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#D97706]/20 via-[#F59E0B]/15 to-[#10B981]/20 border border-[#D97706]/40 backdrop-blur-md flex items-center gap-3.5 shadow-lg relative overflow-hidden"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white font-mono tracking-wide uppercase">
              Official Certificate of Attendance
            </span>
            <span className="text-[10px] bg-[#10B981]/30 text-[#10B981] px-2 py-0.5 rounded-full font-bold">
              معتمد
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            يحصل كل حاضر على <strong>شهادة حضور رسمية معتمدة وموثقة برقم تسجيلك</strong> من الجمعية تسلم في مقر الفعالية.
          </p>
        </div>
      </motion.div>

      {/* Stepper Progress System with Animated Line */}
      <div className="mb-8">
=======
  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-3 py-1 rounded-full border border-[#D97706]/35 bg-[#0F243A] text-[#D97706] font-mono text-xs mb-3 font-semibold">
          ATTENDEE ONBOARDING WIZARD
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Event Registration & Digital Credential
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-2">
          Complete the four steps below to secure your verified badge for ESME Metrix 2026.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10">
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        <div className="grid grid-cols-4 gap-2 relative">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
<<<<<<< HEAD
                <motion.button
                  whileTap={step.id < currentStep ? buttonTapMotion : undefined}
=======
                <button
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
                  type="button"
                  disabled={step.id > currentStep}
                  onClick={() => {
                    if (step.id < currentStep) {
                      setServerError(null);
<<<<<<< HEAD
                      setDirection(step.id < currentStep ? -1 : 1);
=======
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
<<<<<<< HEAD
                    step.id < currentStep ? "cursor-pointer" : "cursor-default"
                  } ${
                    isCompleted
                      ? "bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
=======
                    step.id < currentStep ? "cursor-pointer hover:border-[#D97706]" : "cursor-default"
                  } ${
                    isCompleted
                      ? "bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]"
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
                      : isActive
                      ? "bg-[#0F243A] text-[#D97706] border-2 border-[#D97706] shadow-[0_0_15px_rgba(217,119,6,0.35)]"
                      : "bg-[#0F243A] text-slate-500 border border-slate-800"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
<<<<<<< HEAD
                </motion.button>
=======
                </button>
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
                <span
                  className={`text-[11px] font-medium mt-2 hidden sm:block ${
                    isActive ? "text-[#D97706] font-semibold" : isCompleted ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

<<<<<<< HEAD
        {/* Dynamic Animated Track Bar */}
        <div className="w-full h-1.5 bg-[#0F243A] rounded-full mt-4 overflow-hidden border border-[#D97706]/15 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#10B981]"
            initial={false}
            animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
=======
        {/* Dynamic Track Bar */}
        <div className="w-full h-1.5 bg-[#0F243A] rounded-full mt-4 overflow-hidden border border-[#D97706]/15">
          <div
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
          />
        </div>
      </div>

<<<<<<< HEAD
      {/* Main Wizard Form Container */}
=======
      {/* Wizard Form Container */}
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentStep < 4) {
            e.preventDefault();
            handleNext();
          }
        }}
<<<<<<< HEAD
        className="rounded-2xl border border-[#D97706]/20 bg-[#0F243A]/95 p-5 sm:p-8 backdrop-blur-md shadow-2xl relative"
      >
=======
        className="rounded-2xl border border-[#D97706]/20 bg-[#0F243A]/95 p-6 sm:p-8 backdrop-blur-md shadow-2xl"
      >
        {/* Hidden inputs to ensure React Hook Form tracks document photo URLs */}
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
        <input type="hidden" {...register("idPhotoUrl")} />
        <input type="hidden" {...register("karnetPhotoUrl")} />

        {serverError && (
<<<<<<< HEAD
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2.5"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{serverError}</span>
          </motion.div>
        )}

        {/* Direction-Aware Step Switcher */}
        <AnimatePresence custom={direction} mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D97706]" /> Personal Details (البيانات الشخصية)
                </h2>
                <p className="text-xs text-slate-400 mt-1">Provide your legal name, national ID, and contact details.</p>
              </div>

              <motion.div variants={containerStagger} initial="hidden" animate="visible" className="flex flex-col gap-5">
                {/* Full Name Field */}
                <AnimatedField
                  label="Full Name (الاسم ثلاثي أو رباعي)"
                  required
                  error={errors.fullName?.message}
                  isValid={isFullNameValid}
                >
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="e.g. عمر أحمد حسن"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                  />
                </AnimatedField>

                {/* National ID Field */}
                <AnimatedField
                  label="National ID (الرقم القومي - 14 رقم)"
                  icon={<CreditCard className="w-3.5 h-3.5 text-[#D97706]" />}
                  required
                  error={errors.nationalId?.message}
                  isValid={isNationalIdValid}
                  helperText="14 رقم كما هو مدون في بطاقة الرقم القومي المصرية"
                >
                  <input
                    {...register("nationalId")}
                    type="text"
                    maxLength={14}
                    placeholder="29912010101234"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm font-mono tracking-wider transition-colors"
                  />
                </AnimatedField>

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label="Phone Number"
                    icon={<Phone className="w-3.5 h-3.5 text-[#D97706]" />}
                    required
                    error={errors.phone?.message}
                    isValid={isPhoneValid}
                    helperText="010, 011, 012, 015"
                  >
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="01012345678"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm font-mono transition-colors"
                    />
                  </AnimatedField>

                  <AnimatedField
                    label="Email Address"
                    icon={<Mail className="w-3.5 h-3.5 text-[#D97706]" />}
                    required
                    error={errors.email?.message}
                    isValid={isEmailValid}
                  >
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="student@eng.cu.edu.eg"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>
                </div>

                {/* City Selection */}
                <AnimatedField
                  label="City of Residence (المحافظة)"
                  icon={<MapPin className="w-3.5 h-3.5 text-[#D97706]" />}
                  required
                >
                  <select
                    {...register("city")}
                    className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-sm transition-colors"
                  >
                    <option value="Cairo">Cairo (القاهرة)</option>
                    <option value="Giza">Giza (الجيزة)</option>
                    <option value="Alexandria">Alexandria (الإسكندرية)</option>
                    <option value="Qalyubia">Qalyubia (القليوبية)</option>
                    <option value="Sharqia">Sharqia (الشرقية)</option>
                    <option value="Dakahlia">Dakahlia (الدقهلية)</option>
                    <option value="Gharbia">Gharbia (الغربية)</option>
                    <option value="Monufia">Monufia (المنوفية)</option>
                    <option value="Beheira">Beheira (البحيرة)</option>
                    <option value="Kafr El Sheikh">Kafr El Sheikh (كفر الشيخ)</option>
                    <option value="Damietta">Damietta (دمياط)</option>
                    <option value="Port Said">Port Said (بورسعيد)</option>
                    <option value="Ismailia">Ismailia (الإسماعيلية)</option>
                    <option value="Suez">Suez (السويس)</option>
                    <option value="Fayoum">Fayoum (الفيوم)</option>
                    <option value="Beni Suef">Beni Suef (بني سويف)</option>
                    <option value="Minya">Minya (المنيا)</option>
                    <option value="Assiut">Assiut (أسيوط)</option>
                    <option value="Sohag">Sohag (سوهاج)</option>
                    <option value="Qena">Qena (قنا)</option>
                    <option value="Luxor">Luxor (الأقصر)</option>
                    <option value="Aswan">Aswan (أسوان)</option>
                    <option value="Other">Other Governorate (محافظة أخرى)</option>
                  </select>
                </AnimatedField>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#D97706]" /> Academic & Department Info
                </h2>
                <p className="text-xs text-slate-400 mt-1">Specify your university, engineering department, and graduation year.</p>
              </div>

              <motion.div variants={containerStagger} initial="hidden" animate="visible" className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label="University"
                    icon={<Building className="w-3.5 h-3.5 text-[#D97706]" />}
                    required
                    error={errors.university?.message}
                  >
                    <input
                      {...register("university")}
                      type="text"
                      placeholder="e.g. Cairo University"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>

                  {/* Department with Chemical, Mechanical, Civil prominent */}
                  <AnimatedField
                    label="Engineering Department (القسم الهندسي)"
                    required
                    error={errors.faculty?.message}
                  >
                    <select
                      {...register("faculty")}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-xs sm:text-sm transition-colors"
                    >
                      {CAIRO_ENG_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </AnimatedField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField label="Academic Year (السنة الدراسية)" required>
                    <select
                      {...register("academicYear")}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-sm transition-colors"
                    >
                      <option value="1st">1st Year (الفرقة الأولى)</option>
                      <option value="2nd">2nd Year (الفرقة الثانية)</option>
                      <option value="3rd">3rd Year (الفرقة الثالثة)</option>
                      <option value="4th">4th Year (الفرقة الرابعة / التخرج)</option>
                      <option value="Graduate">Graduate (دراسات عليا / ماجستير)</option>
                      <option value="Alumni">Alumni (خريج)</option>
                    </select>
                  </AnimatedField>

                  <AnimatedField
                    label="Graduation Year (سنة التخرج المتوقعة)"
                    icon={<Calendar className="w-3.5 h-3.5 text-[#D97706]" />}
                    required
                  >
                    <select
                      {...register("graduationYear")}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-sm transition-colors"
                    >
                      <option value="2024">2024 (خريج سابق)</option>
                      <option value="2025">2025 (دفعة 2025)</option>
                      <option value="2026">2026 (دفعة 2026)</option>
                      <option value="2027">2027 (دفعة 2027)</option>
                      <option value="2028">2028 (دفعة 2028)</option>
                      <option value="2029">2029 (دفعة 2029)</option>
                      <option value="2030">2030+</option>
                    </select>
                  </AnimatedField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label="Job Title"
                    icon={<Briefcase className="w-3.5 h-3.5 text-[#D97706]" />}
                    required
                  >
                    <input
                      {...register("jobTitle")}
                      type="text"
                      placeholder="Student or Engineer"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>

                  <AnimatedField label="Company / Organization (Optional)">
                    <input
                      {...register("company")}
                      type="text"
                      placeholder="Company Name (if applicable)"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#D97706]" /> Verification Documents
                </h2>
                <p className="text-xs text-slate-400 mt-1">Upload official documents for identity verification and admission scanning.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PhotoUpload
                  label="National ID Card (Front)"
                  required
                  value={formData.idPhotoUrl}
                  onChange={(url) => setValue("idPhotoUrl", url, { shouldValidate: true })}
                  error={errors.idPhotoUrl?.message}
                  description="Clear image of your official Egyptian National ID card front."
                />

                <PhotoUpload
                  label="Student Karnet / Academic Card"
                  required
                  value={formData.karnetPhotoUrl}
                  onChange={(url) => setValue("karnetPhotoUrl", url, { shouldValidate: true })}
                  error={errors.karnetPhotoUrl?.message}
                  description="Valid university ID card or registration certificate."
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <PhotoUpload
                  label="Profile Photo (For Event Badge)"
                  value={formData.avatarUrl || ""}
                  onChange={(url) => setValue("avatarUrl", url, { shouldValidate: true })}
                  description="Optional: Appears directly on your personalized attendance badge."
                />
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#D97706]" /> Final Review & Submission
                </h2>
                <p className="text-xs text-slate-400 mt-1">Please confirm all information before submitting your registration.</p>
              </div>

              <div className="rounded-xl bg-[#15304B] p-4 sm:p-5 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 border-b border-slate-800">
                  <div><span className="text-slate-500">Name:</span> <strong className="text-white">{formData.fullName}</strong></div>
                  <div><span className="text-slate-500">National ID:</span> <strong className="text-amber-400">{formData.nationalId}</strong></div>
                  <div><span className="text-slate-500">Phone:</span> <strong className="text-white">{formData.phone}</strong></div>
                  <div><span className="text-slate-500">Email:</span> <strong className="text-white">{formData.email}</strong></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 border-b border-slate-800">
                  <div><span className="text-slate-500">University:</span> <strong className="text-white">{formData.university}</strong></div>
                  <div><span className="text-slate-500">Department:</span> <strong className="text-white">{formData.faculty}</strong></div>
                  <div><span className="text-slate-500">Year:</span> <strong className="text-white">{formData.academicYear}</strong></div>
                  <div><span className="text-slate-500">Graduation Year:</span> <strong className="text-emerald-400">{formData.graduationYear}</strong></div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Documents attached & ready for cryptographic signing.</span>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <input
                  {...register("termsAccepted")}
                  type="checkbox"
                  id="termsAccepted"
                  className="w-4 h-4 mt-0.5 rounded border-slate-700 text-[#D97706] focus:ring-[#D97706] cursor-pointer"
                />
                <label htmlFor="termsAccepted" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                  I hereby confirm that all submitted details and uploaded documents are authentic. I agree to comply with the code of conduct of ESME Cairo University.
                </label>
              </div>
              {errors.termsAccepted && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
=======
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#D97706]" /> Personal Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">Provide your legal name and contact credentials.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Name <span className="text-[#D97706]">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="e.g. Omar Hassan El-Sayed"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#15304B] border ${
                    errors.fullName ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white placeholder:text-gray-400 focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                />
              </div>
              {errors.fullName && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#D97706]" /> Phone Number <span className="text-[#D97706]">*</span>
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="01012345678"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#15304B] border ${
                    errors.phone ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white placeholder:text-gray-400 focus:outline-none text-sm font-mono transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                />
                <span className="text-[10px] text-slate-400 font-mono">Egyptian format: 010, 011, 012, 015</span>
                {errors.phone && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D97706]" /> Email Address <span className="text-[#D97706]">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="omar.sayed@gmail.com"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#15304B] border ${
                    errors.email ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white placeholder:text-gray-400 focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                />
                {errors.email && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" /> City of Residence <span className="text-[#D97706]">*</span>
              </label>
              <select
                {...register("city")}
                className={`w-full h-11 px-3 rounded-xl bg-[#15304B] border ${
                  errors.city ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                } text-white focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
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
              {errors.city && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  {errors.city.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: ACADEMIC & PROFESSIONAL */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#D97706]" /> Academic & Professional Info
              </h2>
              <p className="text-xs text-slate-400 mt-1">Specify your current university and engineering specialization.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#D97706]" /> University <span className="text-[#D97706]">*</span>
                </label>
                <input
                  {...register("university")}
                  type="text"
                  placeholder="e.g. Cairo University"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#15304B] border ${
                    errors.university ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white placeholder:text-gray-400 focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                />
                {errors.university && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    {errors.university.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Faculty / Department <span className="text-[#D97706]">*</span>
                </label>
                <input
                  {...register("faculty")}
                  type="text"
                  placeholder="e.g. Faculty of Engineering - Mechanical"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#15304B] border ${
                    errors.faculty ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white placeholder:text-gray-400 focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                />
                {errors.faculty && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    {errors.faculty.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Academic Year <span className="text-[#D97706]">*</span>
                </label>
                <select
                  {...register("academicYear")}
                  className={`w-full h-11 px-3 rounded-xl bg-[#15304B] border ${
                    errors.academicYear ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                >
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Alumni">Alumni</option>
                </select>
                {errors.academicYear && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    {errors.academicYear.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#D97706]" /> Job Title <span className="text-[#D97706]">*</span>
                </label>
                <input
                  {...register("jobTitle")}
                  type="text"
                  placeholder="Student or Quality Inspection Eng."
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#15304B] border ${
                    errors.jobTitle ? "border-red-500/80 focus:border-red-400" : "border-[#D97706]/40 focus:border-[#D97706]"
                  } text-white placeholder:text-gray-400 focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]`}
                />
                {errors.jobTitle && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    {errors.jobTitle.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Company / Organization <span className="text-slate-400 font-normal">(Optional for students)</span>
              </label>
              <input
                {...register("company")}
                type="text"
                placeholder="Company Name (if applicable)"
                className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-400 focus:outline-none text-sm transition-colors autofill:shadow-[inset_0_0_0px_1000px_#15304B] autofill:[-webkit-text-fill-color:#FFFFFF]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOADS */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#D97706]" /> Identity Verification Documents
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
                onChange={(url) => {
                  setValue("idPhotoUrl", url, { shouldValidate: true });
                  if (url) clearErrors("idPhotoUrl");
                }}
                error={errors.idPhotoUrl?.message}
              />

              <PhotoUpload
                label="Student Karnet / Academic Card"
                sublabel="Proof of active enrollment or university affiliation"
                value={formData.karnetPhotoUrl}
                onChange={(url) => {
                  setValue("karnetPhotoUrl", url, { shouldValidate: true });
                  if (url) clearErrors("karnetPhotoUrl");
                }}
                error={errors.karnetPhotoUrl?.message}
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <PhotoUpload
                label="Badge & Social Share Portrait"
                sublabel="Upload a headshot for your personalized 'I'm Attending' social card & event badge"
                value={formData.avatarUrl || ""}
                onChange={(url) => {
                  setValue("avatarUrl", url, { shouldValidate: true });
                  if (url) clearErrors("avatarUrl");
                }}
                error={errors.avatarUrl?.message}
                required={false}
              />
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-5">
            <div className="border-b border-slate-800 pb-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-[#D97706]" /> Review & Finalize Submission
              </h2>
              <p className="text-xs text-slate-400 mt-1">Carefully verify your details before generating your Metrix QR code.</p>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-xl bg-[#15304B] border border-[#D97706]/30 text-xs sm:text-sm flex flex-col gap-3 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                <div>
                  <span className="text-slate-400">Full Name:</span> {formData.fullName || "—"}
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span> {formData.phone || "—"}
                </div>
                <div>
                  <span className="text-slate-400">Email:</span> {formData.email || "—"}
                </div>
                <div>
                  <span className="text-slate-400">City:</span> {formData.city || "—"}
                </div>
                <div>
                  <span className="text-slate-400">University:</span> {formData.university || "—"}
                </div>
                <div>
                  <span className="text-slate-400">Faculty:</span> {formData.faculty || "—"}
                </div>
                <div>
                  <span className="text-slate-400">Year:</span> {formData.academicYear || "—"}
                </div>
                <div>
                  <span className="text-slate-400">Job Title:</span> {formData.jobTitle || "—"}
                </div>
                {formData.company && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Company:</span> {formData.company}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center gap-4">
                <span className="text-slate-400">Documents Attached:</span>
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    formData.idPhotoUrl ? "text-[#10B981]" : "text-amber-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> National ID {formData.idPhotoUrl ? "Attached" : "Missing"}
                </span>
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    formData.karnetPhotoUrl ? "text-[#10B981]" : "text-amber-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Student Karnet {formData.karnetPhotoUrl ? "Attached" : "Missing"}
                </span>
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    formData.avatarUrl ? "text-[#10B981]" : "text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Badge Photo {formData.avatarUrl ? "Attached" : "Default"}
                </span>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-start gap-3">
                <input
                  {...register("termsAccepted")}
                  id="termsAccepted"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-[#15304B] text-[#D97706] focus:ring-[#D97706] cursor-pointer"
                />
                <label htmlFor="termsAccepted" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                  I hereby declare that all submitted personal & academic information is accurate and authentic.
                  I agree to adhere to ESME Cairo University Chapter event protocols and consent to identity scanning on event day.
                </label>
              </div>
              {errors.termsAccepted && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-1">
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  {errors.termsAccepted.message}
                </span>
              )}
<<<<<<< HEAD
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons with Snap Springs */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <motion.button
              whileTap={buttonTapMotion}
              type="button"
              onClick={handleBack}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:border-slate-500 font-bold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
          ) : <div />}

          {currentStep < 4 ? (
            <motion.button
              whileTap={buttonTapMotion}
              type="button"
              onClick={handleNext}
              className="liquid-btn px-7 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs hover:brightness-110 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={buttonTapMotion}
              type="submit"
              disabled={submitting}
              className="liquid-btn px-9 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#D97706] to-[#F59E0B] text-white font-extrabold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> GENERATING CREDENTIALS...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> COMPLETE REGISTRATION
                </>
              )}
            </motion.button>
=======
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] hover:brightness-110 cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white hover:brightness-110 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(217,119,6,0.4)] disabled:opacity-50 cursor-pointer"
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
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
          )}
        </div>
      </form>
    </div>
  );
}
