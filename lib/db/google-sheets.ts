import { google } from "googleapis";
import type { ResearchRunRecord } from "@/types";

const RUNS_TAB = "runs";
const RUNS_HEADER = ["run_id", "created_at", "location_targeted", "industry_targeted", "payload_json"];

function getSheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return null;
  }

  return { spreadsheetId, clientEmail, privateKey };
}

export function isGoogleSheetsConfigured() {
  return Boolean(getSheetsConfig());
}

async function getSheetsClient() {
  const config = getSheetsConfig();

  if (!config) {
    throw new Error(
      "Google Sheets persistence requires GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SHEETS_CLIENT_EMAIL, and GOOGLE_SHEETS_PRIVATE_KEY."
    );
  }

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return {
    spreadsheetId: config.spreadsheetId,
    sheets: google.sheets({ version: "v4", auth })
  };
}

async function ensureRunsSheet() {
  const { sheets, spreadsheetId } = await getSheetsClient();
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === RUNS_TAB);

  if (!existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: RUNS_TAB } } }]
      }
    });
  }

  const header = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${RUNS_TAB}!A1:E1`
  });

  if (!header.data.values || header.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${RUNS_TAB}!A1:E1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [RUNS_HEADER]
      }
    });
  }
}

export async function saveRunToGoogleSheets(run: ResearchRunRecord) {
  await ensureRunsSheet();
  const { sheets, spreadsheetId } = await getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${RUNS_TAB}!A:E`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[run.id, run.started_at, run.location_targeted, run.industry_targeted, JSON.stringify(run)]]
    }
  });
}

export async function getRunFromGoogleSheets(runId: string): Promise<ResearchRunRecord | null> {
  await ensureRunsSheet();
  const { sheets, spreadsheetId } = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${RUNS_TAB}!A:E`
  });

  const rows = response.data.values ?? [];

  for (let index = rows.length - 1; index >= 1; index -= 1) {
    const row = rows[index];
    if (row[0] === runId && row[4]) {
      return JSON.parse(row[4]) as ResearchRunRecord;
    }
  }

  return null;
}
