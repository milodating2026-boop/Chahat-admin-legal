import test from "node:test";
import assert from "node:assert/strict";
import { friendlySendCodeError, friendlyVerifyError, friendlyRequestError, successMessage, friendlyOAuthReturnError } from "../lib/accountErrors.ts";

test("messages never leak raw provider text", () => {
  for (const m of [
    friendlySendCodeError({ message: "AuthApiError: email rate limit exceeded", status: 429 }),
    friendlyVerifyError({ message: "Token has expired or is invalid", code: "otp_expired" }),
    friendlyRequestError({ message: "boom", context: { status: 500 } }, 500),
    friendlyOAuthReturnError("server_error&secret=abc"),
  ]) assert.doesNotMatch(m, /AuthApiError|Token|boom|secret|otp_expired|500/);
});
test("network, rate-limit and expired-session cases are distinguished", () => {
  assert.match(friendlySendCodeError(new Error("Failed to fetch")), /internet connection/);
  assert.match(friendlySendCodeError({ status: 429 }), /Too many/);
  assert.match(friendlyRequestError(null, 401), /session has expired/);
  assert.match(friendlyVerifyError({ status: 400 }), /incorrect or has expired/);
});
test("success wording depends on outcome", () => {
  assert.match(successMessage({ status: "completed" }).title, /has been deleted/);
  assert.match(successMessage({ status: "queued" }).title, /received/);
  assert.match(successMessage({ status: "queued", duplicate: true }).title, /already in progress/);
});
