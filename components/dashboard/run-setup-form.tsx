"use client";

import { startTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface FormState {
  error?: string;
}

const initialState: FormState = {};

function buildPayload(formData: FormData) {
  return {
    location: String(formData.get("location") ?? "").trim(),
    industry: String(formData.get("industry") ?? "").trim(),
    businessCount: Number(formData.get("businessCount") ?? 25),
    minimumRating: formData.get("minimumRating") ? Number(formData.get("minimumRating")) : undefined,
    includeWithoutWebsites: formData.get("includeWithoutWebsites") === "on",
    generateColdEmails: formData.get("generateColdEmails") === "on",
    exportReadyMode: formData.get("exportReadyMode") === "on"
  };
}

async function submitRun(_: FormState, formData: FormData): Promise<FormState> {
  const payload = buildPayload(formData);

  if (!payload.location || !payload.industry) {
    return { error: "Every run must start with both a location and an industry." };
  }

  const response = await fetch("/api/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const json = (await response.json()) as { error?: string };
    return { error: json.error ?? "Unable to create run." };
  }

  const json = (await response.json()) as { id: string };
  window.location.href = `/runs/${json.id}`;
  return {};
}

export function RunSetupForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitRun, initialState);

  return (
    <form
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
      className="panel form-panel"
    >
      <div className="section-header">
        <p className="eyebrow">New Research Run</p>
        <h2>Which location and industry do you want to target?</h2>
        <p className="muted">
          This step is required before every run. The backend validates it too, so a run cannot start without both fields.
        </p>
        <p className="muted">
          If you only need an Excel-ready file, use the direct CSV export option below. It skips saved-run persistence and downloads the sheet immediately.
        </p>
      </div>

      <div className="form-grid">
        <label>
          <span>Target location</span>
          <input name="location" placeholder="Houston, Texas" required />
        </label>

        <label>
          <span>Target industry</span>
          <input name="industry" placeholder="Med Spa" required />
        </label>

        <label>
          <span>Businesses to collect</span>
          <input name="businessCount" type="number" min="5" max="250" defaultValue="25" required />
        </label>

        <label>
          <span>Minimum rating</span>
          <input name="minimumRating" type="number" min="1" max="5" step="0.1" placeholder="4.2" />
        </label>
      </div>

      <div className="checkbox-grid">
        <label className="checkbox">
          <input name="includeWithoutWebsites" type="checkbox" defaultChecked />
          <span>Include businesses without websites</span>
        </label>
        <label className="checkbox">
          <input name="generateColdEmails" type="checkbox" defaultChecked />
          <span>Generate cold emails</span>
        </label>
        <label className="checkbox">
          <input name="exportReadyMode" type="checkbox" />
          <span>Export-ready mode</span>
        </label>
      </div>

      {state.error ? <p className="error-text">{state.error}</p> : null}

      <div className="actions">
        <Button type="submit" disabled={pending}>
          {pending ? "Starting run..." : "Start research run"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={async (event) => {
            const form = event.currentTarget.form;

            if (!form) {
              return;
            }

            const formData = new FormData(form);
            const payload = buildPayload(formData);

            if (!payload.location || !payload.industry) {
              return;
            }

            const response = await fetch("/api/export-csv", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            });

            if (!response.ok) {
              const json = (await response.json()) as { error?: string };
              alert(json.error ?? "Unable to export CSV.");
              return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${payload.location}-${payload.industry}-lead-export.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
          }}
        >
          Run and export CSV
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            router.refresh();
          }}
        >
          Reset form
        </Button>
      </div>
    </form>
  );
}
