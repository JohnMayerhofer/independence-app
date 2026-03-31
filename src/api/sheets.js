import { GOOGLE_CLIENT_ID, SHEET_ID, SCOPES, SHEET_NAMES, DATA_START_ROW } from '../config';
import { parseGoalRow } from '../utils/helpers';

let tokenClient = null;
let accessToken = null;
let currentUser = null;
let canEditTeam = false;

function gapi() {
  return window.gapi;
}

function google() {
  return window.google;
}

export async function initGapi() {
  return new Promise((resolve) => {
    gapi().load('client', async () => {
      await gapi().client.init({
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      });
      resolve();
    });
  });
}

export function initTokenClient(onSuccess, onError) {
  tokenClient = google().accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: async (response) => {
      if (response.error) {
        onError(response);
        return;
      }
      accessToken = response.access_token;
      gapi().client.setToken({ access_token: accessToken });

      // Get user info
      try {
        const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const info = await resp.json();
        currentUser = { email: info.email, name: info.name, picture: info.picture };
      } catch {
        currentUser = null;
      }

      // Detect support team edit permission by attempting a harmless write
      canEditTeam = await detectEditPermission();

      onSuccess({ user: currentUser, canEditTeam });
    },
  });
  return tokenClient;
}

async function detectEditPermission() {
  try {
    // Read the first data cell to get its current value, then write it back
    const range = `'${SHEET_NAMES.PORTFOLIO}'!P${DATA_START_ROW}`;
    const res = await gapi().client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });
    const current = (res.result.values?.[0]?.[0]) || '';
    await gapi().client.sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      resource: { values: [[current]] },
    });
    return true;
  } catch {
    return false;
  }
}

export function requestToken() {
  if (tokenClient) tokenClient.requestAccessToken({ prompt: '' });
}

export function signOut() {
  if (accessToken) {
    google().accounts.oauth2.revoke(accessToken);
    accessToken = null;
    currentUser = null;
    canEditTeam = false;
    gapi().client.setToken(null);
  }
}

export function getCurrentUser() {
  return currentUser;
}

export function getCanEditTeam() {
  return canEditTeam;
}

export async function loadGoals() {
  const res = await gapi().client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${SHEET_NAMES.PORTFOLIO}'!A${DATA_START_ROW}:R`,
  });
  const rows = res.result.values || [];
  return rows
    .map((row, i) => parseGoalRow(row, DATA_START_ROW + i - 1))
    .filter((g) => g.category && g.goal);
}

export async function updateSelfEval(rowNumber, status, comments) {
  const range = `'${SHEET_NAMES.PORTFOLIO}'!L${rowNumber}:N${rowNumber}`;
  await gapi().client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    resource: {
      values: [[status, comments, new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })]],
    },
  });
}

export async function updateTeamEval(rowNumber, status, comments) {
  const range = `'${SHEET_NAMES.PORTFOLIO}'!P${rowNumber}:R${rowNumber}`;
  await gapi().client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    resource: {
      values: [[status, comments, new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })]],
    },
  });
}
