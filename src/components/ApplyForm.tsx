"use client";

import * as m from "framer-motion/m";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useId, useState } from "react";
import { submitApplication, type ApplyState } from "@/lib/actions";
import type { Branch } from "@/lib/types";

export interface ApplyCourseOption {
  id: string;
  title: string;
  branchIds: string[];
}

interface ApplyFormProps {
  courses: ApplyCourseOption[];
  branches: Branch[];
  defaultCourseId?: string;
}

const initial: ApplyState = { status: "idle" };

export function ApplyForm({ courses, branches, defaultCourseId }: ApplyFormProps) {
  const t = useTranslations("Apply");
  const locale = useLocale();
  const uid = useId();
  const [state, action, pending] = useActionState(submitApplication, initial);
  const [courseId, setCourseId] = useState(defaultCourseId ?? courses[0]?.id ?? "");
  const [formKey, setFormKey] = useState(0);

  const course = courses.find((c) => c.id === courseId);
  const courseBranches = branches.filter((b) => course?.branchIds.includes(b.id));
  const errors = state.status === "error" ? state.fields : [];
  const values = state.status === "error" ? state.values : { name: "", phone: "", status: "" };

  const field =
    "mt-2 w-full rounded-2xl border bg-ink px-4 py-3.5 text-chalk placeholder:text-chalk/35 transition-colors focus:border-majolica focus:outline-none";
  const border = (bad: boolean) => (bad ? "border-[#ff8a9a]" : "border-chalk/15");

  return (
    <div className="relative">
        {state.status === "success" && formKey === 0 ? (
          <m.div
            key="done"
            role="status"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center"
          >
            <m.svg
              viewBox="0 0 52 52"
              className="mx-auto size-16 text-majolica"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden
            >
              <circle cx="26" cy="26" r="24" opacity="0.3" />
              <m.path
                d="M15 27l7 7 15-16"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              />
            </m.svg>
            <h3 className="mt-5 font-display text-2xl font-bold">{t("successTitle")}</h3>
            <p className="mx-auto mt-3 max-w-sm text-chalk/70">{t("successText", { id: state.id })}</p>
            <button
              type="button"
              onClick={() => setFormKey((k) => k + 1)}
              className="mt-6 text-sm font-semibold text-amber hover:underline"
            >
              {t("again")}
            </button>
          </m.div>
        ) : (
          <m.form
            key={`form-${formKey}`}
            action={(fd) => {
              setFormKey(0);
              return action(fd);
            }}
            noValidate
            initial={false}
            className="grid gap-5"
          >
            <input type="hidden" name="locale" value={locale} />
            {/* Honeypot, hidden from people and screen readers */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="block text-sm font-medium text-chalk/80">
              {t("name")}
              <input
                name="name"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                defaultValue={values.name}
                placeholder={t("namePlaceholder")}
                aria-invalid={errors.includes("name")}
                aria-describedby={errors.includes("name") ? `${uid}-name-err` : undefined}
                className={`${field} ${border(errors.includes("name"))}`}
              />
              {errors.includes("name") && (
                <span id={`${uid}-name-err`} className="mt-2 block text-sm text-[#ff8a9a]">
                  {t("errors.name")}
                </span>
              )}
            </label>

            <label className="block text-sm font-medium text-chalk/80">
              {t("phone")}
              <input
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                defaultValue={values.phone}
                placeholder="+998 90 123 45 67"
                aria-invalid={errors.includes("phone")}
                aria-describedby={`${uid}-phone-hint${errors.includes("phone") ? ` ${uid}-phone-err` : ""}`}
                className={`${field} ${border(errors.includes("phone"))} tabular-nums`}
              />
              <span id={`${uid}-phone-hint`} className="mt-2 block text-xs text-chalk/45">
                {t("phoneHint")}
              </span>
              {errors.includes("phone") && (
                <span id={`${uid}-phone-err`} className="mt-1 block text-sm text-[#ff8a9a]">
                  {t("errors.phone")}
                </span>
              )}
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-chalk/80">{t("status")}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(["school", "unemployed", "other"] as const).map((st) => (
                  <label
                    key={st}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-colors has-[:checked]:border-amber has-[:checked]:bg-amber/10 ${
                      errors.includes("status") ? "border-[#ff8a9a]" : "border-chalk/15 hover:border-chalk/35"
                    }`}
                  >
                    <input type="radio" name="status" value={st} defaultChecked={values.status === st} className="size-4 accent-[var(--amber)]" />
                    {t(`statuses.${st}`)}
                  </label>
                ))}
              </div>
              {errors.includes("status") && <span className="mt-2 block text-sm text-[#ff8a9a]">{t("errors.status")}</span>}
            </fieldset>

            <div className={`grid gap-5 ${branches.length > 1 ? "sm:grid-cols-2" : ""}`}>
              <label className="block text-sm font-medium text-chalk/80">
                {t("course")}
                <select
                  name="courseId"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  aria-invalid={errors.includes("course")}
                  className={`${field} ${border(errors.includes("course"))}`}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {errors.includes("course") && (
                  <span className="mt-2 block text-sm text-[#ff8a9a]">{t("errors.course")}</span>
                )}
              </label>

              {branches.length > 1 ? (
              <label className="block text-sm font-medium text-chalk/80">
                  {t("branch")}
                  <select name="branchId" defaultValue="" className={`${field} ${border(false)}`}>
                    <option value="">{t("branchAny")}</option>
                    {courseBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <input type="hidden" name="branchId" value={branches[0]?.id ?? ""} />
              )}
            </div>

            {state.status === "error" && state.server && (
              <p role="alert" className="rounded-2xl bg-[#ff8a9a]/15 px-4 py-3 text-sm text-[#ffc2cb]">
                {t("errors.server")}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="relative mt-1 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-amber px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
            >
              {pending && (
                <span
                  aria-hidden
                  className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
                />
              )}
              {pending ? t("submitting") : t("submit")}
            </button>
            <p className="text-center text-xs text-chalk/45">{t("privacy")}</p>
          </m.form>
        )}
    </div>
  );
}
