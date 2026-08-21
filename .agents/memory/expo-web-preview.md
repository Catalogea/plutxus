---
name: Expo web preview
description: Replit preview behavior for Expo web when the app includes native filesystem, database, and llama modules
---

Native Expo modules that are valid on Android can still execute during Expo web startup if they are imported through a barrel or route. Provide `.web.ts` implementations at the resolved module level for filesystem, SQLite, downloads, and local LLM services.

**Why:** The Replit preview runs from a proxied HTTPS origin rather than localhost. Expo's sourcemap CORS middleware rejects that origin unless the project config exposes the current Replit development domain.

**How to apply:** Add the current `REPLIT_DEV_DOMAIN` with the preview port to `extra.router.origin` and `headOrigin` through a dynamic Expo config, while keeping Android behavior in the native implementations. A missing system `libglib` for React Native DevTools is non-blocking; do not treat it as an app runtime failure.