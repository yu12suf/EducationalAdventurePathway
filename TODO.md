# TODO: Fix TypeScript Errors

## Files to Edit

### backend/src/controllers/auth.controller.ts

- Add return type `Promise<void>` to all async functions (register, login, verifyEmail, forgotPassword, resetPassword, getMe)
- Change `req: any` to `req: AuthRequest` in getMe function
- Add optional chaining for `profile?.profileCompletionPercentage` in getMe

### backend/src/models/StudentProfile.ts

- Investigate line 139 error: "This expression is not callable. Type 'SaveOptions' has no call signatures."
- The export line seems fine; perhaps check for duplicate model definitions or incorrect usage elsewhere

### backend/src/utils/email.ts

- Change `nodemailer.createTransporter` to `nodemailer.createTransport`

### backend/src/utils/token.ts

- Use bracket notation for process.env: `process.env['JWT_SECRET']`, `process.env['JWT_VERIFY_SECRET']`, etc.
- Ensure expiresIn is properly typed (string is fine)

### backend/src/middlewares/auth.middleware.ts

- Add return type `Promise<void>` to protect function
- Add return type `void` to authorize function (it's not async)

### backend/src/middlewares/validation.middleware.ts

- Add return type `Promise<void>` to validate function (though it's not async, but to match)

## Followup Steps

- Run TypeScript compilation to verify all errors are fixed
- Test the application to ensure functionality is intact
