# CORO

The best clothing brand ever

# Dependencies

- Iconify Design (`@iconify/svelte`) for icons
- Drizzle (`drizzle-kit [drizzle-orm postgres]`) for database related mappings
- Superforms + Zod (`sveltekit-superforms zod`) for validating forms
- Supabase (`[@supabase/ssr @supabase/supabase-js]`) for auth, storage and realtime
- Melt-Ui (`@melt-ui/svelte @melt-ui/pp`) for ui components


# Environment Variable

All the environment variables that has to be set can be found in [`env.example`](.env.example) file

- `PUBLIC_SUPABSE_ANON_KEY` : The public anonymous key given by supabse
- `PUBLIC_SUPABSE_URL` : The url for the supabase project
- `DATABASE_URL` : The postgres database url

# Run Locally

## Download and install dependencies

```bash
git clone <add link here>
cd coro
pnpm install
```

## Setup config

Setup the environment variables specified above.

```bash
pnpm run generate
pnpm run migrate
```

## Running code
```bash
pnpm run dev --open
```

# Auth integration with supabase setup

## hooks.server.ts 
- This file gives a supabase server-side client, session data to the entire event
    - The client created is specific to this server request
- And has a authGuard that gives a session and a user to the entire event and redirects
    - auth -> account : When the user is logged in
    - account -> auth : When user is not logged in 

## +layout.server.ts
- Gives passes the session local and cookies as data 

#### Why is the session object passed when it is going to be overlapped by the session object in `+layout.ts`?

> This is basically for server side rendering purposes (Still not clear though)

## +layout.ts 
- Checks whether the code is running on client or server, and creates a supabase client respectively
- Also creates a new session and user object and passes that to the data

#### Why a new server side client create instead of just using the one passed in by the handle hook?

> The new client can be used throughout the files for realtime and storage related stuff too, wherease the hooks' client is for validation for auth purposes only (Can get a better explaination) 

## +layout.svelte 
- On any change in authentication state checks whether the user is logged in or not
- Therefore invalidating `+layout.ts` auth data when needed

# Routing

```
- / 
    - collections
    - collection/
        - [id]
    - product/
        - [id]
    - info/
        - terms-and-conditions
        - privicy-policy
        - about-us
        - refund-policy
    - account/
        - profile
    - auth/
        - login
        - signup
```
