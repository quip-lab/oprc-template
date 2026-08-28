# Validation package

`@repo/validators` owns client-safe Zod schemas shared by applications. Keep
schemas here when they describe data supplied by more than one client; do not
import database or server-only modules into this package.

The auth schemas validate the web and mobile React Hook Form flows. Add a
schema here first when a new shared form is introduced, then use it through
`zodResolver` in each app.
