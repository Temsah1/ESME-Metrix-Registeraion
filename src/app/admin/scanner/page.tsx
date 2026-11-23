"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Camera, ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";
import Image from "next/image";
import type { Html5Qrcode } from "html5-qrcode";

type ScanState = "SCANNING" | "SUCCESS" | "ALREADY_SCANNED" | "INVALID" | "ERROR";

interface ScanResponse {
  status: string;
  registrant?: {
    full_name: string;
    university: string;
    faculty: string;
    academic_year: string;
    registration_id: string;
    id_photo_url: string;
  };
  scanned_at?: string | null;
  scanned_by?: string | null;
  error?: string;
}

function formatTime(iso?: string | null): string {
  if (!iso) return "unknown time";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleTimeString();
}

export default function QRScannerPage() {
  const [scanState, setScanState] = useState<ScanState>("SCANNING");
  const [scannedResult, setScannedResult] = useState<ScanResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQRCodeScanned = useCallback(async (qrText: string) => {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_payload: qrText }),
      });

      const res: ScanResponse = await response.json();

      if (res.status === "SUCCESS") {
        setScanState("SUCCESS");
        setScannedResult(res);
      } else if (res.status === "ALREADY_SCANNED") {
        setScanState("ALREADY_SCANNED");
        setScannedResult(res);
      } else if (res.status === "UNAUTHORIZED") {
        setScanState("ERROR");
        setScannedResult(res);
      } else if (res.status === "ERROR") {
        setScanState("ERROR");
        setScannedResult(res);
      } else {
        setScanState("INVALID");
        setScannedResult(res);
      }
    } catch {
      setScanState("ERROR");
      setScannedResult({ status: "ERROR", error: "Network error. Check connection and retry." });
    } finally {
      resetTimerRef.current = setTimeout(() => {
        setScanState("SCANNING");
        setScannedResult(null);
        busyRef.current = false;
      }, 3500);
    }
  }, []);

  useEffect(() => {
    let disposed = false;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (disposed) return;

        const scanner = new Html5Qrcode("metrix-qr-reader");
        scannerInstanceRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 260, height: 260 }, aspectRatio: 1.0 },
          (decodedText: string) => {
            handleQRCodeScanned(decodedText);
          },
          () => {}
        );

        if (disposed) {
          scanner.stop().catch(() => {});
        }
      } catch (err) {
        console.warn("Camera initialisation issue:", err);
        if (!disposed) {
          setErrorMessage("Camera access denied or unavailable on this device.");
        }
      }
    }

    startScanner();

    return () => {
      disposed = true;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      const scanner = scannerInstanceRef.current;
      if (scanner) {
        try {
          scanner.stop().catch(() => {});
        } catch {}
      }
    };
  }, [handleQRCodeScanned]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <Camera className="w-6 h-6 text-[#D97706]" /> Live Admission QR Scanner
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Rear-camera priority. Point lens at attendee&apos;s mobile screen or printed badge.
        </p>
      </div>

      {/* Operator Identity Note */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F243A] border border-slate-800 text-xs">
        <span className="text-slate-400 font-mono">Check-ins are recorded under your signed-in admin account.</span>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
        </div>
      )}

      {/* Camera Viewport Container */}
      <div className="relative rounded-2xl border-2 border-[#D97706]/40 bg-[#15304B] overflow-hidden shadow-2xl min-h-[380px] flex items-center justify-center">
        {/* html5-qrcode DOM Target */}
        <div id="metrix-qr-reader" className="w-full h-full" />

        {/* Animated Corner Brackets & Laser Scan Line (when in scanning state) */}
        {scanState === "SCANNING" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Viewport Frame */}
            <div className="relative w-64 h-64 border border-[#D97706]/35 rounded-xl overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#D97706]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#D97706]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#D97706]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#D97706]" />

              {/* Sweeping Laser Line (Secondary Orange Highlight) */}
              <div
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_12px_#F59E0B]"
                style={{
                  animation: "scanLaser 2s linear infinite",
                }}
              />
            </div>
          </div>
        )}

        {/* GREEN FEEDBACK OVERLAY (SUCCESS) */}
        {scanState === "SUCCESS" && (
          <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
              VERIFIED & ADMITTED
            </div>
            {scannedResult?.registrant?.id_photo_url && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400/50 mt-2">
                <Image
                  src={scannedResult.registrant.id_photo_url}
                  alt="Attendee ID photo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <h2 className="text-2xl font-black text-white mt-1">
              Welcome, {scannedResult?.registrant?.full_name}!
            </h2>
            <div className="text-xs font-mono text-emerald-300 mt-1">
              ID: {scannedResult?.registrant?.registration_id} | {scannedResult?.registrant?.university}
            </div>
            <div className="text-[11px] text-slate-300 mt-2 font-mono">
              Scanned at {formatTime(scannedResult?.scanned_at)}
            </div>
          </div>
        )}

        {/* ORANGE FEEDBACK OVERLAY (ALREADY SCANNED) */}
        {scanState === "ALREADY_SCANNED" && (
          <div className="absolute inset-0 bg-amber-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-3 animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
              DUPLICATE SCAN DETECTED
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Already Checked In!
            </h2>
            <div className="text-xs font-mono text-amber-300 mt-1">
              {scannedResult?.registrant?.full_name} ({scannedResult?.registrant?.registration_id})
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Previously scanned at {formatTime(scannedResult?.scanned_at)} by {scannedResult?.scanned_by ?? "unknown"}
            </div>
          </div>
        )}

        {/* RED FEEDBACK OVERLAY (INVALID) */}
        {scanState === "INVALID" && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-400 text-red-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="text-xs font-mono text-red-400 uppercase font-bold tracking-wider">
              INVALID QR CREDENTIAL
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              QR Code Not Recognized
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-xs">
              Signature mismatch or fake barcode. Refer attendee to manual registration search desk.
            </p>
          </div>
        )}

        {/* RED FEEDBACK OVERLAY (ERROR / UNAUTHORIZED) */}
        {scanState === "ERROR" && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-400 text-red-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="text-xs font-mono text-red-400 uppercase font-bold tracking-wider">
              {scannedResult?.status === "UNAUTHORIZED" ? "SESSION EXPIRED" : "CHECK-IN ERROR"}
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {scannedResult?.status === "UNAUTHORIZED" ? "Sign In Again" : "Could Not Record Attendance"}
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-xs">
              {scannedResult?.error ?? "Unexpected error. Please retry the scan."}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scanLaser {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(256px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
