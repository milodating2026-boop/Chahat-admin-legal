import test from "node:test";
import assert from "node:assert/strict";
import {
  deletionFailureMessage,
  SESSION_GONE_MESSAGE,
  DELETION_INCOMPLETE_MESSAGE,
} from "../lib/deletionErrors.ts";

test("401 from delete-account explains the session/already-deleted case", () => {
  assert.equal(deletionFailureMessage({ context: { status: 401 } }), SESSION_GONE_MESSAGE);
  assert.match(SESSION_GONE_MESSAGE, /sign-in fails the deletion is complete/);
});

test("500 and other failures keep the retry message", () => {
  assert.equal(deletionFailureMessage({ context: { status: 500 } }), DELETION_INCOMPLETE_MESSAGE);
  assert.equal(deletionFailureMessage({ context: { status: 403 } }), DELETION_INCOMPLETE_MESSAGE);
});

test("network errors, missing context and null never throw and keep the retry message", () => {
  assert.equal(deletionFailureMessage(new Error("fetch failed")), DELETION_INCOMPLETE_MESSAGE);
  assert.equal(deletionFailureMessage(null), DELETION_INCOMPLETE_MESSAGE);
  assert.equal(deletionFailureMessage(undefined), DELETION_INCOMPLETE_MESSAGE);
  assert.equal(deletionFailureMessage({ context: {} }), DELETION_INCOMPLETE_MESSAGE);
});
