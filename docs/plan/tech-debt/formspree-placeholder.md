---
type: tech-debt
status: open
priority: high
created: 2026-06-11
---

# Replace Formspree Placeholder Endpoint

## Summary

`src/pages/Contact.tsx:3` has `PLACEHOLDER_ENDPOINT = 'https://formspree.io/f/placeholder'`.
The contact form will silently fail until this is replaced with a real Formspree form ID.

## Steps

1. Sign up at formspree.io
2. Create a new form → copy the form endpoint URL
3. Replace `PLACEHOLDER_ENDPOINT` in `src/pages/Contact.tsx`
4. Test the form locally (Formspree accepts submissions from localhost)

## Acceptance Criteria

- Submitting the contact form sends an email to shereef.elias@gmail.com
- Success state is shown to the user after submission
- Form resets after successful submission
