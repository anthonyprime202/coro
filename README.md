# How authentication with supabase has been setup

## hooks.server.ts 
- This file gives a supabase server-side client, session data to the entire event
    - The client created is specific to this server request
- And has a authGuard that gives a session and a user to the entire event and redirects
    - auth -> account : When the user is logged in
    - account -> auth : When user is not logged in 

## layout.server.ts
- Gives passes the session local and cookies as data 

### Why is the session object passed when it is going to be overlapped by the session object in `layout.ts`?

> This is basically for server side rendering purposes (Still not clear though)


## layout.ts 
- Checks whether the code is running on client or server, and creates a supabase client respectively
- Also creates a new session and user object and passes that to the data

### Why a new server side client create instead of just using the one passed in by the handle hook?

> The new client can be used throughout the files for realtime and storage related stuff too, wherease the hooks' client is for validation for auth purposes only (Can get a better explaination) 

## layout.svelte 
- On any change in authentication state checks whether the user is logged in or not
- Therefore invalidating `layout.ts` auth data when needed
