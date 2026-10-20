# Launch checklist

A privacy page does not make a site legally compliant. Every item below must be done (and signed off by the right person) before public launch.

## Legal and privacy
- [ ] Children's privacy lawyer reviews COPPA obligations (verifiable parental consent method, direct notice to parents, data retention and deletion policy).
- [ ] GDPR / UK GDPR and Age Appropriate Design Code review if serving EU/UK users (lawful basis, DPIA, data processing records).
- [ ] Privacy notice and Terms finalised by counsel; publish the contact address (`NEXT_PUBLIC_CONTACT_EMAIL`).
- [ ] Hosting and database providers' data processing agreements signed; data region chosen.
- [ ] Confirm no third-party scripts, analytics or fonts load from other domains at runtime (fonts are self-hosted by next/font).

## Content and theology
- [ ] A qualified Christian educator or theologian reviews every lesson in `/admin` against its cited passages and approves it.
- [ ] Review sensitive lessons (flood, Jericho, David and Goliath, the cross) for age-appropriateness.
- [ ] Confirm the doctrinal note in `data/jesus.ts` matches the organisation's statement of faith.
- [ ] Confirm all artwork is original or licensed and all audio is properly licensed.

## Security
- [ ] Switch to Postgres and run `prisma migrate deploy`.
- [ ] Back rate limiting with a shared store if running more than one instance.
- [ ] Add a Content-Security-Policy header after confirming every resource is same-origin.
- [ ] Penetration test: authorization (cross-family access), CSRF, XSS, session handling.
- [ ] Back up the database and test restoring it.
- [ ] Create the admin account with a strong unique password; keep admin accounts to a minimum.

## Quality
- [ ] `npm run typecheck && npm run lint && npm test && npm run test:e2e` all pass on the production build.
- [ ] Manual accessibility pass with a screen reader (NVDA/VoiceOver), keyboard only, 200% zoom and high-contrast mode.
- [ ] Test on real iPad, Android tablet, iPhone and Android phone.
- [ ] Lighthouse performance check on a mid-range phone.

## Operations
- [ ] Set `NEXT_PUBLIC_SITE_URL`, then submit the sitemap to search engines.
- [ ] Decide on optional donations (`DONATION_URL`, parent area only) and confirm nothing in child areas asks for money.
