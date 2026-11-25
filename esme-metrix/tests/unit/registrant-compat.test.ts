import { describe, it, expect } from "vitest";
import {
  adaptInsertRowForSchemaError,
  buildLegacyFacultyValue,
  extractMissingColumnName,
  isMissingColumnError,
} from "@/lib/supabase/registrant-compat";

describe("Registrant Supabase schema compatibility helpers", () => {
  it("packs faculty, department, and ESME details cleanly for pre-0006 DBs", () => {
    expect(
      buildLegacyFacultyValue({
        faculty: "Engineering (الهندسة)",
        department: "Materials & Metallurgical Engineering",
        isEsmeMember: false,
      })
    ).toBe("Engineering (الهندسة) — Materials & Metallurgical Engineering");

    expect(
      buildLegacyFacultyValue({
        faculty: "Engineering (الهندسة)",
        department: "Chemical Engineering",
        isEsmeMember: true,
        committee: "IT",
        role: "Head",
      })
    ).toBe("Engineering (الهندسة) — Chemical Engineering [ESME: IT / Head]");
  });

  it("extracts missing column names from PostgREST and Postgres errors", () => {
    expect(
      isMissingColumnError({
        code: "PGRST204",
        message: "Could not find the 'committee' column of 'registrants' in the schema cache",
      })
    ).toBe(true);

    expect(
      extractMissingColumnName({
        code: "PGRST204",
        message: "Could not find the 'committee' column of 'registrants' in the schema cache",
      })
    ).toBe("committee");

    expect(
      extractMissingColumnName({
        code: "42703",
        message: "column registrants.department does not exist",
      })
    ).toBe("department");
  });

  it("adapts insert row cleanly across unapplied 0006 columns and karnet_photo_url constraint", () => {
    const baseRow = {
      id: "uuid-1",
      university: "Cairo University",
      faculty: "Engineering (الهندسة)",
      department: "Materials & Metallurgical Engineering",
      is_esme_member: true,
      committee: "IT",
      role: "Member",
      id_photo_url: "https://proj.supabase.co/storage/v1/object/public/photos/id.jpg",
    };

    const ctx = {
      idPhotoUrl: baseRow.id_photo_url,
      legacyFaculty:
        "Engineering (الهندسة) — Materials & Metallurgical Engineering [ESME: IT / Member]",
    };

    const step1 = adaptInsertRowForSchemaError(
      baseRow,
      {
        code: "PGRST204",
        message: "Could not find the 'committee' column of 'registrants' in the schema cache",
      },
      ctx
    );

    expect(step1).toEqual({
      id: "uuid-1",
      university: "Cairo University",
      faculty: ctx.legacyFaculty,
      id_photo_url: baseRow.id_photo_url,
    });

    const step2 = adaptInsertRowForSchemaError(
      step1!,
      {
        code: "23502",
        message:
          'null value in column "karnet_photo_url" of relation "registrants" violates not-null constraint',
      },
      ctx
    );

    expect(step2).toEqual({
      id: "uuid-1",
      university: "Cairo University",
      faculty: ctx.legacyFaculty,
      id_photo_url: baseRow.id_photo_url,
      karnet_photo_url: baseRow.id_photo_url,
    });

    // Does not loop once applied
    expect(
      adaptInsertRowForSchemaError(
        step2!,
        {
          code: "23502",
          message:
            'null value in column "karnet_photo_url" of relation "registrants" violates not-null constraint',
        },
        ctx
      )
    ).toBe(null);

    // Unrelated DB errors return null
    expect(
      adaptInsertRowForSchemaError(
        baseRow,
        { code: "23505", message: "duplicate key value" },
        ctx
      )
    ).toBe(null);
  });
});
