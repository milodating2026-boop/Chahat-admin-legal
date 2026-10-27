# Chahat legal-pages audit (28 October 2026)

Source of truth for app behaviour: `SoaibAkhtar321/Chahat--An-Online-Dating-App` @ b8e8eef (code, 56 migrations, 7 Edge Functions, docs).
Website audited: this repo @ d610b39. The Android app was not modified. The live Netlify site was not crawled.

## A. Verified technical facts (from code)
- No analytics, ads, crash-reporting or tracking SDKs in the app (`mobile/package.json`, source grep). Android permissions: INTERNET, READ_EXTERNAL_STORAGE, CAMERA, ACCESS_FINE/COARSE_LOCATION (foreground only), RECORD_AUDIO, VIBRATE, MODIFY_AUDIO_SETTINGS, BLUETOOTH_CONNECT.
- Data: profile (incl. DOB, gender, who you seek, intents, city, bio, work, education, interests, languages), photos, voice intro, optional verification selfie, messages/replies/reactions/photos (view-once)/voice, likes/blocks/reports, call records, coin ledger, push token, consent + Terms/Privacy acceptance records.
- Location: device location read in foreground; server snaps to ~1.1 km grid (migration 20260101002600); distance can be hidden; consent recorded (`consent_records`).
- Age: DB trigger rejects DOB under 18 (self-declared; no ID check).
- Processors: Supabase (DB/auth/storage/functions), Google Cloud Vision SafeSearch (profile photo bytes, `moderate-photo`), Google Sign-In, Agora (calls), Expo push relay `exp.host` + FCM, Google Play Billing + Android Publisher API (`verify-purchase`).
- Push: default lock-screen detail = sender name (matches/messages), preview only if user opts in; likes/calls never identify sender.
- Chat screens block screenshots/recording on Android (FLAG_SECURE) - chat only, not call screens.
- Deletion: `delete-account` function (same path used by website): purges DB rows + storage + auth user. Kept: reports (anonymised id, notes remain), subscription_orders (user_id NULL), one anonymised audit row. Deleted incl. acceptance/consent evidence and coin ledger.
- Website: no cookies set; localStorage `chahat_theme_mode` and Supabase session (only after sign-in on delete-account/admin); no third-party scripts, fonts or images; security headers present.

## B. Inaccurate / unsupported statements found and fixed
| Where | Statement | Problem |
|---|---|---|
| Cookies page | "Zero third-party advertising trackers", security/fraud cookies, tokens "expire upon logging out", cookies in "mobile application" | No such cookies exist; unsupported specifics |
| Terms | "Chahat Operations"; "video chat minute passes, VIP memberships"; "absolute right to ban"; forfeiture of all assets; "irrevocably terminated"; written-consent recording ban; only 6 clauses | Wrong entity name/products; one-sided; thin (no content licence, disclaimers, intermediary, safety, third parties) |
| Home, footer, features, about | "verified profiles/friends", human review of all photos/bios, "around the clock" review (also Safety), "blur preview", "anti-screenshot detection", "disappearing voice notes", "region-specific rooms", Hindi, "ticket resolution status", "explicit media strictly blocked", "queued requests", "compliant with DPDP/Google Play" | Not implemented or not provable; misleading-claim and Play deceptive-claims risk |
| Header | Play link `com.chahat.friendship` | App id is `com.chahat.dating` |
| Privacy | Missing: Google Sign-In, Expo/FCM, Android Publisher API, permissions, no-recording, cross-border note, backups caveat, orphaned chat media, DPDP transition, sensitive-context note, rights/response time | Incomplete disclosure |
| Missing page | Child Safety Standards (Google Play requires published CSAE standards + point of contact for Social/Dating apps) | Added `/child-safety` |

## C. Changes made (website only)
New: `lib/legal.ts` (single source for operator/contact/dates), `components/legal/LegalDoc.tsx` (same classes as before), `app/child-safety/page.tsx`, this file.
Rewritten: `/privacy-policy`, `/terms`, `/cookies`, `/community-guidelines`.
Edited: `/delete-account` (adds app id, deleted/kept lists, caveats), `/safety`, `/features`, `/about`, home FAQ/claims, footer (new link, claims), header (Play id).
No cookie banner added: only strictly-necessary local storage exists.

## D. Needs a decision or qualified legal review (nothing below is invented)
1. **Operator identity.** "Chahat Friendship App Operations" and the Kushinagar address are carried over from the old site and unverified; Terms formerly used a different name. Supply the real legal entity, registration and address (also needed for Play listing and IT Rules).
2. **Contacts.** One mailbox (`milodating2026@gmail.com`) serves support, privacy, grievance and child-safety roles. No Grievance Officer name is shown. Decide named officer and separate mailboxes; the IT Rules expect a named officer.
3. **Timelines.** 24h acknowledge / 15-day resolve are kept from the old site; confirm you can meet them. Privacy-request response time and retention periods for reports, payment records and deletion record are **not set** (stated honestly on the pages). DPDP rules need defined periods by 13 May 2027.
4. **DPDP.** Act/Rules notified 13 Nov 2025; consent-manager rules 13 Nov 2026; main duties 13 May 2027. Sources differ on whether SPDI Rules 2011 / s.43A apply until then: lawyer to confirm. Checklist for the app/back end: itemised notice, verifiable consent records (you currently delete acceptance/consent evidence on account deletion), retention periods, breach process, grievance for data principals.
5. **Deleting consent evidence and coin ledger** on account deletion (app decision, see `docs/ACCOUNT_DELETION.md`) vs. dispute/accounting needs.
6. **Report notes** may contain personal data and are retained.
7. **Cross-border processing.** Supabase region, Agora and Google processing locations unconfirmed.
8. **Backups.** Whether Supabase backups keep deleted data is unverified (disclosed as such).
9. **Orphaned chat media** after unmatch/block is not cleaned up automatically (disclosed). `cleanup-chat-media` deployment status unknown.
10. **Feature flags.** Billing, push, calls, voice messages, coin top-up are build-time flags (`EXPO_PUBLIC_FEATURE_*`); the Premium screen shows "Coming soon" when billing is off. Pages say "where available". Confirm what the release build enables, then tighten wording.
11. **Selfie handling.** Whether verification selfies are sent to Google Vision is not established; the page lists only profile photos.
12. **Refund and cancellation terms**, governing court/seat (currently "courts in India"), and limitation-of-liability wording need lawyer review. IT Rules also require periodic reminders of rules to users; no such process exists.
13. **Sexual-orientation inference** from "who you want to meet": confirm it is optional and treat as sensitive.
14. **Legal version drift.** The app records acceptance of Terms/Privacy version `2026-10-18`. If the new text is material, bump versions in a future app phase (new migration) so users re-accept. The in-app Privacy/Terms screens are shorter and should be aligned. Not done here (app untouched).
15. **Google Play Console tasks (outside the website):** Data safety form matching Privacy Policy; permissions declarations (microphone, camera, location); Child Safety Standards declaration with URL `/child-safety` and the point of contact; account-deletion URL `/delete-account`; target audience 18+; dating-app category rules; paid-features disclosures.
16. **Live-site check** of Netlify cookies/headers and the build served from the repo's `main` branch was not possible.
