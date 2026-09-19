"use server";

import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { api } from "./api";
import type { ApplicantStatus } from "./types";

const STATUSES: ApplicantStatus[] = ["school", "unemployed", "other"];

export type ApplyField = "name" | "phone" | "course" | "status";

export type ApplyState =
  | { status: "idle" }
  | { status: "success"; id: string }
  | { status: "error"; fields: ApplyField[]; server?: boolean; values: { name: string; phone: string; status: string } };

/** Accepts "+998 90 123 45 67", "998901234567" or "901234567"; returns "+998901234567" or null. */
function normalizeUzPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("998") ? digits.slice(3) : digits;
  return /^\d{9}$/.test(local) ? `+998${local}` : null;
}

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const name = String(formData.get("name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const courseId = String(formData.get("courseId") ?? "");
  const branchId = String(formData.get("branchId") ?? "") || undefined;
  const statusRaw = String(formData.get("status") ?? "");
  const status = STATUSES.find((s) => s === statusRaw);
  const localeRaw = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, localeRaw) ? localeRaw : routing.defaultLocale;

  // Honeypot: real people never see or fill this field
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", id: "ok" };
  }

  const courses = await api.courses(locale);
  const course = courses.find((c) => c.id === courseId);
  const phone = normalizeUzPhone(phoneRaw);

  const fields: ApplyField[] = [];
  if (name.length < 2 || name.length > 80) fields.push("name");
  if (!phone) fields.push("phone");
  if (!course) fields.push("course");
  if (!status) fields.push("status");
  if (fields.length || !phone || !course || !status) {
    return { status: "error", fields, values: { name, phone: phoneRaw, status: statusRaw } };
  }

  const validBranch = branchId && course.branchIds.includes(branchId) ? branchId : undefined;

  try {
    const { id } = await api.submitApplication({ name, phone, courseId, branchId: validBranch, status, locale });
    return { status: "success", id };
  } catch (error) {
    console.error("[apply] submit failed", error);
    return { status: "error", fields: [], server: true, values: { name, phone: phoneRaw, status: statusRaw } };
  }
}
