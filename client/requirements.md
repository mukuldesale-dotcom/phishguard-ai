## Packages
framer-motion | Page transitions and interactive animations for gamified elements
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes without style conflicts

## Notes
Assumes the `api` object and `buildUrl` are correctly exported from `@shared/routes`.
Assumes user authentication is session/cookie-based, so `credentials: "include"` is used in all requests.
Requires `api.scan.history.path` and `api.game.history.path` to return empty arrays if no history exists.
