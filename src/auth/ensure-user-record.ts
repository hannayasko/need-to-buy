"use client";

import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const candidateTables = ["profiles", "app_users", "users"] as const;
const candidatePayloads = (user: User) => [
  { email: user.email ?? null, id: user.id },
  { id: user.id },
];
const retryDelayMs = 250;

function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function isMissingTableError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("relation") &&
    normalizedMessage.includes("does not exist")
  );
}

function logEnsureUserRecordError(error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error("Unable to ensure app user record.", error);
}

export async function ensureUserRecord(user: User) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const errors: Error[] = [];

    for (const tableName of candidateTables) {
      for (const payload of candidatePayloads(user)) {
        const { error } = await supabase
          .from(tableName)
          .upsert(payload, { onConflict: "id" });

        if (!error) {
          return true;
        }

        if (isMissingTableError(error.message)) {
          break;
        }

        errors.push(error);
      }
    }

    if (errors.length > 0) {
      logEnsureUserRecordError(errors[0]);
    }

    if (attempt === 0) {
      await wait(retryDelayMs);
    }
  }

  return false;
}
