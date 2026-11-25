"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  EGYPTIAN_NATIONAL_ID_REGEX,
  EGYPTIAN_PHONE_REGEX,
  createRegistrationSchemas,
  getDepartmentsForFaculty,
  isOtherFaculty,
  requiresCustomMajor,
  resolveDepartment,
  CompleteRegistrationInput,
  CompleteRegistrationParsed,
} from "@/lib/validations/registration";
import { OTHER_DEPARTMENT_GENERIC } from "@/config/registration";
import type { FormFieldConfig, RegistrationFormConfig } from "@/lib/cms/types";
import PhotoUpload from "@/components/PhotoUpload";
import AnimatedField from "@/components/motion/AnimatedField";
import { containerStagger, buttonTapMotion } from "@/components/motion/MotionTokens";
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
  CreditCard,
  Calendar,
  Award,
  Users,
} from "lucide-react";

const registrationStepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 32 : -32,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  }),
};

interface RegisterFormClientProps {
  formConfig: RegistrationFormConfig;
}

export default function RegisterFormClient({ formConfig }: RegisterFormClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const schemas = useMemo(
    () =>
      createRegistrationSchemas({
        fields: formConfig.fields,
        faculties: formConfig.faculties,
        academicYears: formConfig.academicYears,
        esmeCommittees: formConfig.esmeCommittees,
        esmeRoles: formConfig.esmeRoles,
      }),
    [formConfig]
  );

  const stepsMeta = useMemo(
    () => [
      { id: 1, name: formConfig.steps.step1.navLabel, icon: User },
      { id: 2, name: formConfig.steps.step2.navLabel, icon: GraduationCap },
      { id: 3, name: formConfig.steps.step3.navLabel, icon: FileCheck2 },
      { id: 4, name: formConfig.steps.step4.navLabel, icon: Send },
    ],
    [formConfig.steps]
  );

  const defaultCity = formConfig.cities[0] || "Cairo";
  const defaultAcademicYear =
    formConfig.academicYears.find((y) => y.value === "3rd")?.value ||
    formConfig.academicYears[0]?.value ||
    "3rd";
  const defaultGradYear =
    formConfig.graduationYears.find((y) => y.value === "2026")?.value ||
    formConfig.graduationYears[0]?.value ||
    "2026";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CompleteRegistrationInput, unknown, CompleteRegistrationParsed>({
    resolver: zodResolver(schemas.completeRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      nationalId: "",
      phone: "",
      email: "",
      city: defaultCity,
      university: "Cairo University",
      faculty: "",
      department: "",
      customMajor: "",
      academicYear: defaultAcademicYear,
      graduationYear: defaultGradYear,
      jobTitle: "Student",
      company: "",
      isEsmeMember: undefined,
      committee: "",
      role: "",
      idPhotoUrl: "",
      avatarUrl: "",
      termsAccepted: false,
    },
  });

  const f = formConfig.fields;
  const formData = watch();
  const availableDepartments = getDepartmentsForFaculty(formData.faculty, formConfig.faculties);
  const showCustomMajorInput = requiresCustomMajor(formData.faculty, formData.department);
  const resolvedMajorDisplay = resolveDepartment({
    faculty: formData.faculty,
    department: formData.department,
    customMajor: formData.customMajor,
  });

  const handleFacultyChange = (selectedFaculty: string) => {
    setServerError(null);
    setValue("faculty", selectedFaculty, { shouldValidate: true });
    clearErrors(["faculty", "department", "customMajor"]);
    if (isOtherFaculty(selectedFaculty)) {
      const otherDepts = getDepartmentsForFaculty(selectedFaculty, formConfig.faculties);
      setValue("department", otherDepts[0] || OTHER_DEPARTMENT_GENERIC, { shouldValidate: true });
    } else {
      setValue("department", "", { shouldValidate: false });
      setValue("customMajor", "", { shouldValidate: false });
    }
  };

  const handleDepartmentChange = (selectedDepartment: string) => {
    setServerError(null);
    setValue("department", selectedDepartment, { shouldValidate: true });
    clearErrors(["department", "customMajor"]);
    if (!requiresCustomMajor(getValues("faculty"), selectedDepartment)) {
      setValue("customMajor", "", { shouldValidate: false });
    }
  };

  const handleEsmeMembershipSelect = (isMember: boolean) => {
    setServerError(null);
    setValue("isEsmeMember", isMember, { shouldValidate: true });
    clearErrors(["isEsmeMember", "committee", "role"]);
    if (!isMember) {
      setValue("committee", "", { shouldValidate: false });
      setValue("role", "", { shouldValidate: false });
    }
  };

  const handleNext = async () => {
    setServerError(null);

    if (currentStep === 1) {
      const step1Result = schemas.step1Schema.safeParse({
        fullName: getValues("fullName"),
        nationalId: getValues("nationalId"),
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
            "Please complete all required personal details."
        );
        return;
      }

      clearErrors(["fullName", "nationalId", "phone", "email", "city"]);
      setDirection(1);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 2) {
      const step2Result = schemas.step2Schema.safeParse({
        university: getValues("university"),
        faculty: getValues("faculty"),
        department: getValues("department"),
        customMajor: getValues("customMajor"),
        academicYear: getValues("academicYear"),
        graduationYear: getValues("graduationYear"),
        jobTitle: getValues("jobTitle"),
        company: getValues("company") || undefined,
        isEsmeMember: getValues("isEsmeMember"),
        committee: getValues("committee"),
        role: getValues("role"),
      });

      if (!step2Result.success) {
        step2Result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CompleteRegistrationInput;
          setError(field, { type: "manual", message: issue.message });
        });
        setServerError(
          step2Result.error.issues[0]?.message ||
            "Please complete all required academic details before continuing."
        );
        return;
      }

      clearErrors([
        "university",
        "faculty",
        "department",
        "customMajor",
        "academicYear",
        "graduationYear",
        "jobTitle",
        "company",
        "isEsmeMember",
        "committee",
        "role",
      ]);
      setDirection(1);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 3) {
      const step3Result = schemas.step3Schema.safeParse({
        idPhotoUrl: getValues("idPhotoUrl"),
        avatarUrl: getValues("avatarUrl") || undefined,
      });

      if (!step3Result.success) {
        step3Result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CompleteRegistrationInput;
          setError(field, { type: "manual", message: issue.message });
        });
        setServerError(
          step3Result.error.issues[0]?.message ||
            "Please complete your verification documents before continuing."
        );
        return;
      }

      clearErrors(["idPhotoUrl", "avatarUrl"]);
      setDirection(1);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setServerError(null);
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: CompleteRegistrationParsed) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...data,
        department: data.department || "",
        customMajor: data.customMajor || "",
        committee: data.isEsmeMember ? data.committee || "" : "",
        role: data.isEsmeMember ? data.role || "" : "",
        avatarUrl: data.avatarUrl || undefined,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Registration could not be completed.");
        setSubmitting(false);
        return;
      }

      const serialized = JSON.stringify(result);
      sessionStorage.setItem("esme_metrix_registration", serialized);
      localStorage.setItem("esme_metrix_registration", serialized);
      router.push(`/dashboard?id=${encodeURIComponent(result.registration_id)}`);
    } catch {
      setServerError("Network error. Please verify your connection and try again.");
      setSubmitting(false);
    }
  };

  const isFullNameValid = (formData.fullName || "").trim().length >= 3;
  const isNationalIdValid = EGYPTIAN_NATIONAL_ID_REGEX.test(formData.nationalId || "");
  const isPhoneValid = EGYPTIAN_PHONE_REGEX.test(formData.phone || "");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "");

  const fieldLabelWithOptional = (cfg: FormFieldConfig) =>
    cfg.required ? cfg.label : `${cfg.label} (Optional)`;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Official Certificate Announcement Banner */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#D97706]/20 via-[#F59E0B]/15 to-[#10B981]/20 border border-[#D97706]/40 backdrop-blur-md flex items-center gap-3.5 shadow-lg relative overflow-hidden"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white font-mono tracking-wide uppercase">
              {formConfig.bannerTitle}
            </span>
            <span className="text-[10px] bg-[#10B981]/30 text-[#10B981] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {formConfig.bannerBadge}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            {formConfig.bannerDescription}
          </p>
        </div>
      </motion.div>

      {/* Stepper Progress Indicator */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2 relative">
          {stepsMeta.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.button
                  whileTap={step.id < currentStep ? buttonTapMotion : undefined}
                  type="button"
                  disabled={step.id > currentStep}
                  onClick={() => {
                    if (step.id < currentStep) {
                      setServerError(null);
                      setDirection(-1);
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    step.id < currentStep ? "cursor-pointer" : "cursor-default"
                  } ${
                    isCompleted
                      ? "bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : isActive
                      ? "bg-[#0F243A] text-[#D97706] border-2 border-[#D97706] shadow-[0_0_15px_rgba(217,119,6,0.35)]"
                      : "bg-[#0F243A] text-slate-500 border border-slate-800"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </motion.button>
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

        <div className="w-full h-1.5 bg-[#0F243A] rounded-full mt-4 overflow-hidden border border-[#D97706]/15 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#10B981]"
            initial={false}
            animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main Wizard Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentStep < 4) {
            e.preventDefault();
            handleNext();
          }
        }}
        className="rounded-2xl border border-[#D97706]/20 bg-[#0F243A]/95 p-5 sm:p-8 backdrop-blur-md shadow-2xl relative"
      >
        <input type="hidden" {...register("idPhotoUrl")} />
        <input type="hidden" {...register("avatarUrl")} />

        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2.5"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{serverError}</span>
          </motion.div>
        )}

        <AnimatePresence custom={direction} mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={registrationStepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D97706]" /> {formConfig.steps.step1.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{formConfig.steps.step1.subtitle}</p>
              </div>

              <motion.div variants={containerStagger} initial="hidden" animate="visible" className="flex flex-col gap-5">
                <AnimatedField
                  label={fieldLabelWithOptional(f.fullName)}
                  required={f.fullName.required}
                  error={errors.fullName?.message}
                  isValid={isFullNameValid}
                  helperText={f.fullName.helperText}
                >
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder={f.fullName.placeholder}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                  />
                </AnimatedField>

                <AnimatedField
                  label={fieldLabelWithOptional(f.nationalId)}
                  icon={<CreditCard className="w-3.5 h-3.5 text-[#D97706]" />}
                  required={f.nationalId.required}
                  error={errors.nationalId?.message}
                  isValid={isNationalIdValid}
                  helperText={f.nationalId.helperText}
                >
                  <input
                    {...register("nationalId")}
                    type="text"
                    maxLength={14}
                    placeholder={f.nationalId.placeholder}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm font-mono tracking-wider transition-colors"
                  />
                </AnimatedField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label={fieldLabelWithOptional(f.phone)}
                    icon={<Phone className="w-3.5 h-3.5 text-[#D97706]" />}
                    required={f.phone.required}
                    error={errors.phone?.message}
                    isValid={isPhoneValid}
                    helperText={f.phone.helperText}
                  >
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder={f.phone.placeholder}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm font-mono transition-colors"
                    />
                  </AnimatedField>

                  <AnimatedField
                    label={fieldLabelWithOptional(f.email)}
                    icon={<Mail className="w-3.5 h-3.5 text-[#D97706]" />}
                    required={f.email.required}
                    error={errors.email?.message}
                    isValid={isEmailValid}
                    helperText={f.email.helperText}
                  >
                    <input
                      {...register("email")}
                      type="email"
                      placeholder={f.email.placeholder}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>
                </div>

                <AnimatedField
                  label={fieldLabelWithOptional(f.city)}
                  icon={<MapPin className="w-3.5 h-3.5 text-[#D97706]" />}
                  required={f.city.required}
                  error={errors.city?.message}
                >
                  <select
                    {...register("city")}
                    className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-sm transition-colors"
                  >
                    {formConfig.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </AnimatedField>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={registrationStepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#D97706]" /> {formConfig.steps.step2.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{formConfig.steps.step2.subtitle}</p>
              </div>

              <motion.div variants={containerStagger} initial="hidden" animate="visible" className="flex flex-col gap-5">
                <AnimatedField
                  label={fieldLabelWithOptional(f.university)}
                  icon={<Building className="w-3.5 h-3.5 text-[#D97706]" />}
                  required={f.university.required}
                  error={errors.university?.message}
                >
                  <input
                    {...register("university")}
                    type="text"
                    placeholder={f.university.placeholder}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                  />
                </AnimatedField>

                {/* Cascading Faculty -> Department Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label={fieldLabelWithOptional(f.faculty)}
                    required={f.faculty.required}
                    error={errors.faculty?.message}
                  >
                    <select
                      value={formData.faculty || ""}
                      onChange={(e) => handleFacultyChange(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-xs sm:text-sm transition-colors"
                    >
                      <option value="">{f.faculty.placeholder || "Select Faculty / Major Category..."}</option>
                      {formConfig.faculties.map((fac) => (
                        <option key={fac.name} value={fac.name}>
                          {fac.name}
                        </option>
                      ))}
                    </select>
                  </AnimatedField>

                  <AnimatedField
                    label={fieldLabelWithOptional(f.department)}
                    required={f.department.required}
                    error={errors.department?.message}
                  >
                    <select
                      value={formData.department || ""}
                      disabled={!formData.faculty}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.faculty
                          ? f.department.placeholder || "Select Department / Specialization..."
                          : "Select Faculty First..."}
                      </option>
                      {availableDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </AnimatedField>
                </div>

                {/* Conditional Custom Major Input */}
                <AnimatePresence>
                  {showCustomMajorInput && (
                    <motion.div
                      key="custom-major-field"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      <AnimatedField
                        standalone
                        label={fieldLabelWithOptional(f.customMajor)}
                        required={f.customMajor.required}
                        error={errors.customMajor?.message}
                      >
                        <input
                          {...register("customMajor")}
                          type="text"
                          placeholder={f.customMajor.placeholder}
                          className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/50 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                        />
                      </AnimatedField>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label={fieldLabelWithOptional(f.academicYear)}
                    required={f.academicYear.required}
                    error={errors.academicYear?.message}
                  >
                    <select
                      {...register("academicYear")}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-sm transition-colors"
                    >
                      {formConfig.academicYears.map((yr) => (
                        <option key={yr.value} value={yr.value}>
                          {yr.label}
                        </option>
                      ))}
                    </select>
                  </AnimatedField>

                  <AnimatedField
                    label={fieldLabelWithOptional(f.graduationYear)}
                    icon={<Calendar className="w-3.5 h-3.5 text-[#D97706]" />}
                    required={f.graduationYear.required}
                    error={errors.graduationYear?.message}
                  >
                    <select
                      {...register("graduationYear")}
                      className="w-full h-11 px-3 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-sm transition-colors"
                    >
                      {formConfig.graduationYears.map((yr) => (
                        <option key={yr.value} value={yr.value}>
                          {yr.label}
                        </option>
                      ))}
                    </select>
                  </AnimatedField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedField
                    label={fieldLabelWithOptional(f.jobTitle)}
                    icon={<Briefcase className="w-3.5 h-3.5 text-[#D97706]" />}
                    required={f.jobTitle.required}
                    error={errors.jobTitle?.message}
                  >
                    <input
                      {...register("jobTitle")}
                      type="text"
                      placeholder={f.jobTitle.placeholder}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>

                  <AnimatedField
                    label={fieldLabelWithOptional(f.company)}
                    required={f.company.required}
                    error={errors.company?.message}
                  >
                    <input
                      {...register("company")}
                      type="text"
                      placeholder={f.company.placeholder}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#15304B] border border-[#D97706]/40 focus:border-[#D97706] text-white placeholder:text-gray-500 focus:outline-none text-sm transition-colors"
                    />
                  </AnimatedField>
                </div>

                {/* Conditional ESME Chapter Membership */}
                <div className="p-4 rounded-xl bg-[#15304B]/70 border border-[#D97706]/30 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{f.isEsmeMember.label}</span>
                      {f.isEsmeMember.required && <span className="text-[#D97706] font-bold">*</span>}
                    </label>
                    <div
                      role="radiogroup"
                      aria-label={f.isEsmeMember.label}
                      className="grid grid-cols-2 gap-3"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={formData.isEsmeMember === true}
                        onClick={() => handleEsmeMembershipSelect(true)}
                        className={`h-11 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          formData.isEsmeMember === true
                            ? "bg-[#D97706]/20 border-[#F59E0B] text-white shadow-[0_0_12px_rgba(217,119,6,0.25)]"
                            : "bg-[#0F243A] border-slate-700 text-slate-300 hover:border-[#D97706]/50"
                        }`}
                      >
                        {f.isEsmeMember.yesLabel}
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={formData.isEsmeMember === false}
                        onClick={() => handleEsmeMembershipSelect(false)}
                        className={`h-11 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          formData.isEsmeMember === false
                            ? "bg-[#10B981]/15 border-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : "bg-[#0F243A] border-slate-700 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        {f.isEsmeMember.noLabel}
                      </button>
                    </div>
                    {errors.isEsmeMember?.message && (
                      <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                        {errors.isEsmeMember.message}
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {formData.isEsmeMember === true && (
                      <motion.div
                        key="esme-member-details"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80"
                      >
                        <AnimatedField
                          standalone
                          label={fieldLabelWithOptional(f.committee)}
                          required={f.committee.required}
                          error={errors.committee?.message}
                        >
                          <select
                            value={formData.committee || ""}
                            onChange={(e) => {
                              setValue("committee", e.target.value, { shouldValidate: true });
                              clearErrors("committee");
                              setServerError(null);
                            }}
                            className="w-full h-11 px-3 rounded-xl bg-[#0F243A] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-xs sm:text-sm transition-colors"
                          >
                            <option value="">{f.committee.placeholder || "Select Committee..."}</option>
                            {formConfig.esmeCommittees.map((comm) => (
                              <option key={comm} value={comm}>
                                {comm}
                              </option>
                            ))}
                          </select>
                        </AnimatedField>

                        <AnimatedField
                          standalone
                          label={fieldLabelWithOptional(f.role)}
                          required={f.role.required}
                          error={errors.role?.message}
                        >
                          <select
                            value={formData.role || ""}
                            onChange={(e) => {
                              setValue("role", e.target.value, { shouldValidate: true });
                              clearErrors("role");
                              setServerError(null);
                            }}
                            className="w-full h-11 px-3 rounded-xl bg-[#0F243A] border border-[#D97706]/40 focus:border-[#D97706] text-white focus:outline-none text-xs sm:text-sm transition-colors"
                          >
                            <option value="">{f.role.placeholder || "Select Role / Position..."}</option>
                            {formConfig.esmeRoles.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </AnimatedField>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={registrationStepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#D97706]" /> {formConfig.steps.step3.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{formConfig.steps.step3.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PhotoUpload
                  label={f.idPhotoUrl.label}
                  required={f.idPhotoUrl.required}
                  value={formData.idPhotoUrl || ""}
                  onChange={(url) => setValue("idPhotoUrl", url, { shouldValidate: true })}
                  error={errors.idPhotoUrl?.message}
                  description={f.idPhotoUrl.helperText}
                />

                <PhotoUpload
                  label={f.avatarUrl.label}
                  required={f.avatarUrl.required}
                  value={formData.avatarUrl || ""}
                  onChange={(url) => setValue("avatarUrl", url, { shouldValidate: true })}
                  error={errors.avatarUrl?.message}
                  description={f.avatarUrl.helperText}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={registrationStepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="border-b border-slate-800 pb-3 mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#D97706]" /> {formConfig.steps.step4.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{formConfig.steps.step4.subtitle}</p>
              </div>

              <div className="rounded-xl bg-[#15304B] p-4 sm:p-5 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-slate-500">Name:</span>{" "}
                    <strong className="text-white">{formData.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">National ID:</span>{" "}
                    <strong className="text-amber-400">{formData.nationalId || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>{" "}
                    <strong className="text-white">{formData.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>{" "}
                    <strong className="text-white">{formData.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">City:</span>{" "}
                    <strong className="text-white">{formData.city}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-slate-500">University:</span>{" "}
                    <strong className="text-white">{formData.university}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Faculty:</span>{" "}
                    <strong className="text-white">{formData.faculty}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Department / Major:</span>{" "}
                    <strong className="text-[#F59E0B]">{resolvedMajorDisplay}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Academic Year:</span>{" "}
                    <strong className="text-white">{formData.academicYear}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Graduation Year:</span>{" "}
                    <strong className="text-emerald-400">{formData.graduationYear}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Role / Title:</span>{" "}
                    <strong className="text-white">{formData.jobTitle}</strong>
                  </div>
                  {formData.company && (
                    <div>
                      <span className="text-slate-500">Company:</span>{" "}
                      <strong className="text-white">{formData.company}</strong>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-slate-500">ESME Chapter Member:</span>{" "}
                    <strong className={formData.isEsmeMember ? "text-[#F59E0B]" : "text-slate-200"}>
                      {formData.isEsmeMember ? "Yes" : "No"}
                    </strong>
                  </div>
                  {formData.isEsmeMember && (
                    <>
                      <div>
                        <span className="text-slate-500">Committee:</span>{" "}
                        <strong className="text-white">{formData.committee}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Role / Position:</span>{" "}
                        <strong className="text-white">{formData.role}</strong>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {formData.idPhotoUrl ? "National ID uploaded" : "No ID uploaded"}
                    {formData.avatarUrl
                      ? " + badge portrait loaded"
                      : " (default badge silhouette will be used)"}{" "}
                    — ready for QR signing.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <input
                  {...register("termsAccepted")}
                  type="checkbox"
                  id="termsAccepted"
                  className="w-4 h-4 mt-0.5 rounded border-slate-700 text-[#D97706] focus:ring-[#D97706] cursor-pointer"
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none"
                >
                  {formConfig.termsLabel}
                </label>
              </div>
              {errors.termsAccepted && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  {errors.termsAccepted.message}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <motion.button
              whileTap={buttonTapMotion}
              type="button"
              onClick={handleBack}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:border-slate-500 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <motion.button
              whileTap={buttonTapMotion}
              type="button"
              onClick={handleNext}
              className="liquid-btn px-7 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs hover:brightness-110 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={buttonTapMotion}
              type="submit"
              disabled={submitting}
              className="liquid-btn px-9 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] via-[#D97706] to-[#F59E0B] text-white font-extrabold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all flex items-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> GENERATING CREDENTIALS...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> {formConfig.submitButtonLabel}
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}
