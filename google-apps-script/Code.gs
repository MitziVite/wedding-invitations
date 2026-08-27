/**
 * Google Apps Script backend for the wedding RSVP form.
 *
 * This file is NOT run by Next.js — it's reference/version-control for code
 * you paste into a separate Apps Script project bound to the RSVP Google
 * Sheet. See README.md in this folder for full setup steps.
 */

var RESPONSES_SHEET_NAME = "Responses";
var MAX_CHILDREN = 10;

/** No GET-based functionality — this just keeps direct browser hits to the
 *  /exec URL from erroring with "Script function not found: doGet". */
function doGet(e) {
  return jsonResponse({ ok: true, message: "RSVP backend is running." });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: "invalid_json" });
  }

  var expectedSecret = PropertiesService.getScriptProperties().getProperty("RSVP_SHARED_SECRET");
  if (!expectedSecret || body.secret !== expectedSecret) {
    return jsonResponse({ ok: false, error: "unauthorized" });
  }

  return handleSubmit(body);
}

function getSheet_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

/**
 * Guards against spreadsheet formula injection — Sheets treats a cell value
 * starting with =, +, -, or @ as a formula even when written from a script,
 * so a guest typing "=1+1" (or something worse) into a free-text field
 * could otherwise execute as a formula. Prefixing with a quote forces it to
 * stay plain text.
 */
function sanitizeCell_(value) {
  var s = String(value == null ? "" : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function handleSubmit(body) {
  var childrenCount = Number(body.childrenCount) || 0;
  if (childrenCount < 0 || childrenCount > MAX_CHILDREN) {
    return jsonResponse({ ok: false, error: "too_many_children" });
  }

  var responsesSheet = getSheet_(RESPONSES_SHEET_NAME);
  var now = new Date();
  responsesSheet.appendRow([
    sanitizeCell_(body.contactName),
    body.attending === "yes" ? "yes" : "no",
    sanitizeCell_(body.plusOneName),
    childrenCount,
    sanitizeCell_(body.message),
    sanitizeCell_(body.contactEmail),
    now,
  ]);

  return jsonResponse({ ok: true });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
