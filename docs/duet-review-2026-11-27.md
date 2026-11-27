# Review of Duet's work (thread 42, 2026-11-27)

Report only. Quotes were checked by script against the saved texts in JacobOwl/phoenician-punic-world (read-only): every passage in double quotes was searched for, punctuation ignored.

**Verdict: good, and worth pushing harder.** The research is careful and honest about its gaps, the art matches the game's style, and the playtest bot found real bugs. The weak spots are small.

| PR | Job | Verdict | Notes |
|---|---|---|---|
| #86 | Rising cast of Dionysius I | Good, merge as a draft | All quotes from saved texts found. Two exceptions, both marked in the file: Diodorus 15.7 is Duet's own rendering of the Greek, and Plutarch *Timoleon* 6 was read online (not saved). One date comes from Wikipedia, marked. |
| #96 | Briefs for the six tyrant campaigns | Very good, merge as a draft | 98 quotes, all found (one has a footnote number inside it in the saved text, as the file says). All 8 coin links match the saved coin catalogues. Its "To fetch" references are from memory and marked unchecked. |
| #95 | Mosaic portraits, Carthage's council and three more | Usable | Same coin form and tiles as the 24. Carthage's five faces look alike at small size, and Bomilcar's dark face is hard to read. Drawn without a browser, so tiles differ a little from the editor's; resaving from the editor fixes that. It lists four existing looks that jar (Dionysius in Carthage's purple, and others): Jacob's call. |
| #97 | Playtest bot, 23,520 games | Strong | Found two real bugs, not yet fixed: a dead man keeps his council seat while you are in exile, and a dead man started a plot. Also content that never shows (no petition for land, "Men for the walls"). It edits package.json, handoff and decisions, so it needs main merged in before it lands. |
| #89 | Art library | Fixed and merged by thread 40 | Flat medallions, not mosaics; a stray cache file; about 18 MB. Thread 40 fixed and merged it on 2026-11-27; not reviewed again here. |
| #84 | Twenty petitions (on main) | Good | One quote is unverified: "had sold into slavery the Naxians and Catanians" (Diodorus 14.40.1). Diodorus 14.40 is not among the saved texts, so it can't be checked. Not shown to be wrong. |
