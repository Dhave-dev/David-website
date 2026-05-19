# SecureGate — Reflection & Engineering Analysis
**Name:** David Ironali
**Cohort:** Design to MVP Bootcamp
**Live URL:** [Your Vercel deployment link]
**GitHub Repo:** [Your repo URL]
---
## Part 1 — What I Built
Securegate is a security authentication app. I built this by creating the context files, which involved creating the skills and agents based on the doc.
## Part 2 — What Surprised Me
i had an error during my deployment and got confused.
## Part 3 — Engineering Laws Quiz
### Q1 — Murphy's Law
The rate limit we have i our document, iof not inforced it would allow unlimited amount of password combination
Token expiry: without it user can use same token after days of getting it. We set 15min for email and 1 hour for password.
**Code reference:** `src/app/api/auth/forgot-password/route.ts` lines 34-48
**My Answer:** where expires: new Date(Date.now() + 60 * 60 * 1000) sets the 1-hour expiry.
**What goes wrong if ignored:** without rate limiting an attacker can enter any account, and without token expiry a stolen link works forever.


### Q2 — Law of Leaky Abstractions
All non-trivial abstractions, to some degree, are leaky
## Part 4 — One Thing I Would Refactor
The send verification and reset email password are both alike and the repeated pattern is a technical debt. They resend client is activated twice.
## Part 5 — How This Changes How I Build
Verification code expires after 15 minutes. And including the rate limit to avoid spams
