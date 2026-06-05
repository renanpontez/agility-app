# Project notes & preferences

## ⚠️ Deletion policy (strict)
**Never delete any file or folder unless the user explicitly says "APPROVE DELETE".**
This applies to all delete operations (rm, mv-to-trash, file-delete tools, etc.).
If a deletion seems needed, ask and wait for the exact phrase "APPROVE DELETE" first.

## Blog bot
See `bot/README.md`. Daily PT-BR tech-article bot: Cowork scheduled task writes a ready
article to `bot/queue/`; a local launchd publisher (`bot/publish.mjs`) POSTs to the
Agility blog API and notifies Slack `#agility-creative`.
