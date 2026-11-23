# ESME Metrix — QA Test Plan

Date: 2026-11-23 · Framework: Vitest 3 (unit) + browser-use MCP (manual/automated browser) · Stack: Next.js 16.4.6, React 19.3, Supabase, Resend

## Environment constraints (user-confirmed)

- `.env.local` holds **production credentials only**. No isolated Supabase test project exists.
- Therefore: **no test may write to the production database, upload real files, or send real emails.**
- All DB-dependent integration tests are marked **BLOCKED** with the exact blocker. Offline tests (validation, QR generation/decoding, signature logic, build, typecheck, lint, browser rendering without submission) execute for real.
- Test evidence is stored in `docs/qa/artifacts/`.

## Status vocabulary

`PASS` / `FAIL` / `BLOCKED` / `NOT TESTED` — every result in TEST-RESULTS.md carries evidence (command output, file:line, or screenshot). A test that was not executed is never marked PASS.

## 1. Registration (unit + browser)

| ID | Case | Method | Env |
|---|---|---|---|
| REG-01 | Valid Egyptian phone `01[0125]XXXXXXXX` accepted | unit (Zod) | offline |
| REG-02 | Invalid phones rejected (02X, 011 short, letters, +20 prefix) | unit | offline |
| REG-03 | Invalid email rejected; email lowercased | unit | offline |
| REG-04 | Missing required fields rejected per step | unit | offline |
| REG-05 | Academic year enum enforced | unit | offline |
| REG-06 | Terms must be true | unit | offline |
| REG-07 | Photo URL must be Supabase storage URL (reject base64/arbitrary) | unit (after fix) | offline |
| REG-08 | Duplicate phone/email → 409 (DB unique) | code review + DB test | BLOCKED (prod-only) |
| REG-09 | Wizard step navigation preserves data | browser | offline (no submit) |
| REG-10 | Client validation blocks Next on invalid step | browser | offline |
| REG-11 | Double-submit protection | code review | offline |
| REG-12 | Full submit → DB row → success page | E2E | BLOCKED (prod-only) |
| REG-13 | Oversized/invalid file rejected client-side | browser + code review | offline |
| REG-14 | Upload failure surfaces error (no silent base64 fallback) | code review + unit | offline (after fix) |

## 2. QR generation & decoding (highest priority)

| ID | Case | Method | Env |
|---|---|---|---|
| QR-01 | QR generated server-side after insert succeeds | code review | offline |
| QR-02 | QR image decodes independently (jsqr) to exact payload | unit round-trip | offline |
| QR-03 | Payload contains id / registrant_id / event / hash | unit | offline |
| QR-04 | Registration ID format `MX8-XXXXXX`, unambiguous charset | unit | offline |
| QR-05 | QR settings: EC level H, margin 2, 400px, black/white | unit/code | offline |
| QR-06 | QR displayed on success page from API response | browser (sessionStorage fixture) | offline |
| QR-07 | QR in email as CID attachment (not data URI) | unit (template) | offline (after fix) |
| QR-08 | Email QR payload identical to success-page QR | unit | offline |

## 3. QR security & verification

| ID | Case | Method | Env |
|---|---|---|---|
| QRS-01 | Valid signed payload accepted | unit | offline |
| QRS-02 | Tampered payload rejected (HMAC mismatch) | unit | offline |
| QRS-03 | Missing hash rejected | unit | offline |
| QRS-04 | Wrong event identifier rejected | unit | offline |
| QRS-05 | Malformed JSON / non-object rejected | unit | offline |
| QRS-06 | Missing fields rejected | unit | offline |
| QRS-07 | Signing secret never in client bundle | grep + build review | offline |
| QRS-08 | Legacy unkeyed SHA-256 rejected by default | unit | offline |
| QRS-09 | Forgery without secret impossible | unit (attempt forge) | offline |
| QRS-10 | Replay → ALREADY_SCANNED, no duplicate row | DB test | BLOCKED (prod-only); UNIQUE constraint verified in schema |
| QRS-11 | Concurrent scans → single row | DB test | BLOCKED (prod-only); UNIQUE constraint verified in schema |
| QRS-12 | Unknown UUID → INVALID | unit + code review | offline |

## 4. Scanner & attendance

| ID | Case | Method | Env |
|---|---|---|---|
| SCN-01 | Camera init / permission denied handling | code review + browser (no camera) | partial |
| SCN-02 | Physical camera scan on mobile | — | NOT TESTED (no device) |
| SCN-03 | Result states SUCCESS/ALREADY_SCANNED/INVALID render | browser + code review | offline |
| SCN-04 | Auto-reset after result | code review | offline |
| SCN-05 | `/api/scan` rejects unauthenticated requests | unit (handler w/ mocked auth) + code | offline (after fix) |
| SCN-06 | Manual check-in uses authorized server path, checks response | code review | offline (after fix) |
| SCN-07 | Attendance insert atomic (UNIQUE registrant_id) | schema review | offline |
| SCN-08 | Conflict returns real previous timestamp | unit/code | offline (after fix) |

## 5. Auth & authorization

| ID | Case | Method | Env |
|---|---|---|---|
| AUTH-01 | Unauthenticated /admin/* → redirect /admin | browser | offline |
| AUTH-02 | Login with invalid credentials shows error, no bypass | browser + code review | offline (after fix) |
| AUTH-03 | Login catch-block backdoor removed | code review | offline (after fix) |
| AUTH-04 | Proxy fail-closed when env missing | code review | offline (after fix) |
| AUTH-05 | Valid admin login + session persistence | — | BLOCKED (no test account; prod-only) |
| AUTH-06 | Logout clears session | code review | offline |
| AUTH-07 | RLS: anon cannot SELECT registrants | DB test | BLOCKED; policy reviewed statically |
| AUTH-08 | Service-role key never client-exposed | grep NEXT_PUBLIC + code | offline |

## 6. Storage

| ID | Case | Method | Env |
|---|---|---|---|
| STO-01 | ID/karnet documents private (no public URL) | schema review | FAIL→fix pending authorization (migration prepared, not executed) |
| STO-02 | Upload type/size limits client-side | browser/code | offline |
| STO-03 | Server-side file validation | code review | offline (after fix: URL allowlist) |
| STO-04 | Signed URL admin preview | — | BLOCKED (requires private-bucket migration) |

## 7. Email (Resend)

| ID | Case | Method | Env |
|---|---|---|---|
| EML-01 | Send scheduled via `after()` (survives serverless response) | code review | offline (after fix) |
| EML-02 | Registration success independent of email failure | code review | offline |
| EML-03 | Template contains name/ID/QR-cid, no data-URI img | unit | offline (after fix) |
| EML-04 | No false "email sent" claim in UI | browser/code | offline (after fix) |
| EML-05 | Real delivery to controlled recipient | — | BLOCKED (no test recipient/domain verification; prod key only) |
| EML-06 | Rate limit / invalid key behavior | — | BLOCKED (same) |

## 8. LinkedIn & card

| ID | Case | Method | Env |
|---|---|---|---|
| LI-01 | Canvas card renders correct name/ID/branding | browser (fixture) | offline |
| LI-02 | Download produces full 1200×630 PNG incl. QR | browser/code | offline (after fix) |
| LI-03 | Share marks DB only on explicit click + successful response | code review | offline (after fix) |
| LI-04 | No claim of verified LinkedIn publication | code review | offline |
| LI-05 | `/api/linkedin-shared` validates registration exists | unit/code | offline (after fix) |

## 9. Admin dashboard & data integrity

| ID | Case | Method | Env |
|---|---|---|---|
| ADM-01 | No mock/seed stats anywhere | grep + browser | offline (after fix) |
| ADM-02 | KPIs computed from real Supabase counts | code review | offline; live values BLOCKED |
| ADM-03 | Attendance % = attended/registered×100 | unit | offline |
| ADM-04 | Charts from real data, empty state when none | browser/code | offline (after fix) |
| ADM-05 | Registrants search/filter | browser + code | offline (empty state); live BLOCKED |
| ADM-06 | Search input cannot break PostgREST `.or()` | unit (sanitizer) | offline (after fix) |
| ADM-07 | Pagination 50/page | — | NOT IMPLEMENTED (defect, P2) |
| ADM-08 | Excel export of real rows | code review | offline; live BLOCKED |
| ADM-09 | Realtime attendance subscription + cleanup | code review | offline; live BLOCKED |

## 10. Frontend / responsive / security

| ID | Case | Method | Env |
|---|---|---|---|
| FE-01 | Pages render at 360/390/768/1024/1440, no horizontal overflow | browser | offline |
| FE-02 | No console errors on public pages | browser | offline |
| FE-03 | No public admin entry point | browser + grep | offline (after fix) |
| FE-04 | Reduced motion respected | code review | partial (HeroParticles only — defect) |
| SEC-01 | No secrets in client bundle / repo docs | grep | offline |
| SEC-02 | API error responses leak no internals | code review | offline |
| SEC-03 | IDOR on scan/linkedin endpoints | unit/code | offline (after fix) |

## 11. Build & regression

| ID | Case | Command |
|---|---|---|
| BLD-01 | TypeScript | `npm run typecheck` |
| BLD-02 | ESLint | `npm run lint` |
| BLD-03 | Production build | `npm run build` |
| BLD-04 | Unit suite | `npm test` |

After every defect fix: re-run focused tests → full unit suite → typecheck/lint/build. Results recorded in TEST-RESULTS.md; defects in BUG-REPORT.md.

## Blockers summary

1. No isolated Supabase test project → all live DB/auth/storage/realtime tests BLOCKED.
2. No Resend test recipient or verified domain access → delivery tests BLOCKED.
3. No physical mobile camera → scanner hardware tests NOT TESTED.
4. No admin test account → authenticated admin flows BLOCKED (unauthenticated behavior still testable).
5. Production schema changes (private bucket, email_logs, realtime publication for registrants) require explicit authorization → migration prepared, not executed.