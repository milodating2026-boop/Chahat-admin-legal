// Single source for facts repeated across the legal pages.
// Nothing here is invented: every value is either carried over from the pre-existing site (flagged below)
// or is a deliberate "not yet decided" statement. Change a value here and every legal page follows.
import { SUPPORT_EMAIL } from './contact';

export const LEGAL_LAST_UPDATED = '29 October 2026';

// Shown as a badge on the legal pages. Set to '' once a qualified lawyer has reviewed the documents.
export const LEGAL_REVIEW_STATUS = 'Draft for legal review';

export const APP_NAME = 'Chahat — Online Friendship App';

export const OPERATOR = {
  // Carried over from the previous Privacy Policy. NOT verified: confirm the real legal entity
  // (company / LLP / partnership / proprietorship), its registration details and registered address.
  name: 'Chahat Friendship App Operations',
  address:
    'Bodhi Chhapra A.D.O Tola, Gaithihaw Mus. Ghithihaw Aht., PO: Gethihawa, Dist: Kushinagar, Uttar Pradesh, 274802, India',
  email: SUPPORT_EMAIL,
  // The same mailbox is used for every role until the operator designates separate ones.
  grievanceOfficerDesignation: 'Grievance Redressal Officer',
  grievanceOfficerName: null as string | null, // not provided: no name is shown rather than inventing one
  // Carried over from the previous site (the IT Rules 2021 timelines: acknowledge within 24 hours, resolve within 15 days).
  // The operator must confirm it can actually meet these.
  grievanceAcknowledge: 'within 24 hours',
  grievanceResolve: 'within 15 days',
  childSafetyContactEmail: SUPPORT_EMAIL,
};
