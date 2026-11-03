/**
 * Commonplace Stationery: event sign-ups
 *
 * Lives inside the "Commonplace Event Sign-ups" Google Sheet on the
 * commonplace.stationery@gmail.com account (Extensions > Apps Script).
 * Works with a blank sheet: the column headings are added automatically. The website sends each sign-up here, and this
 * script adds it as a new row. It also tells the website how many spots are left.
 *
 * To change how many spots an event has, edit CAPACITY below, then
 * Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy.
 * Events not listed here have no limit.
 */
const CAPACITY = {
  'junk-journal-social-2027-01-14': 12,
};

const SHEET_NAME = ''; // blank = first tab of the spreadsheet

const HEADERS = ['Signed up at', 'Event', 'Event ID', 'Date', 'Name', 'Email', 'Seats'];

// The sign-up tab. Adds the column headings if the sheet is still blank.
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

// Seats already taken for each event ID, read from the sheet.
function seatsTaken_() {
  const rows = sheet_().getDataRange().getValues().slice(1); // skip header
  const taken = {};
  rows.forEach(function (r) {
    const id = String(r[2] || '');
    const seats = Number(r[6]) || 0;
    if (id) taken[id] = (taken[id] || 0) + seats;
  });
  return taken;
}

function spotsLeft_(taken) {
  const left = {};
  Object.keys(CAPACITY).forEach(function (id) {
    left[id] = Math.max(0, CAPACITY[id] - (taken[id] || 0));
  });
  return left;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET: spots left for every event with a limit, e.g. {"junk-journal-social-2027-01-14": 9}
function doGet() {
  return json_({ ok: true, spotsLeft: spotsLeft_(seatsTaken_()) });
}

// POST: add one sign-up. Body is JSON: {eventId, event, date, name, email, seats}
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // one sign-up at a time, so an event can't be overbooked
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const name = String(d.name || '').trim().slice(0, 120);
    const email = String(d.email || '').trim().slice(0, 200);
    const eventId = String(d.eventId || '').trim().slice(0, 120);
    const seats = Math.max(1, Math.min(4, parseInt(d.seats, 10) || 1));

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !eventId) {
      return json_({ ok: false, error: 'invalid' });
    }

    const taken = seatsTaken_();
    if (eventId in CAPACITY) {
      const left = CAPACITY[eventId] - (taken[eventId] || 0);
      if (left <= 0) return json_({ ok: false, error: 'full', spotsLeft: 0 });
      if (seats > left) return json_({ ok: false, error: 'not_enough', spotsLeft: left });
    }

    sheet_().appendRow([
      new Date(),
      String(d.event || '').slice(0, 120),
      eventId,
      String(d.date || '').slice(0, 120),
      name,
      email,
      seats,
    ]);

    taken[eventId] = (taken[eventId] || 0) + seats;
    const left = eventId in CAPACITY ? CAPACITY[eventId] - taken[eventId] : null;
    return json_({ ok: true, spotsLeft: left });
  } finally {
    lock.releaseLock();
  }
}
