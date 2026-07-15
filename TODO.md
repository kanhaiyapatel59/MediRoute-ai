# TODO - Mediroute AI fixes

- [ ] Fix `registerUser` to safely handle missing `req.body` (return 400 instead of crashing)
- [ ] Fix mongoose `userSchema.pre('save')` middleware to avoid `next is not a function` by using `(next)` signature
- [ ] Make AI recommendations fall back when no `isActiveEmergencyHub: true` hospitals exist
- [ ] Extend `seedAdmin.js` to seed a sample hospital (and hospital hub flag) when none exist
- [ ] Restart backend and verify: registration + recommendation endpoint work

