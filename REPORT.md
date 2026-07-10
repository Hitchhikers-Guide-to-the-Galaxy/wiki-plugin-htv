# REPORT — read this before touching the wiring

**Audience: any AI (codex, Claude, …) or human working on this plugin.**
This plugin took down the private wiki farm repeatedly on 2026-07-07/08.
The plugin's *code* was never the problem — the *wiring* was.

## What happened

1. This plugin was created (by codex, following the public
   `fedwiki-createplugin-skill` docs) and added to the **plugmatic roster**
   on the localhost wiki's "Local Plugins" page.
2. **The roster implies npm.** `~/bin/wiki-start` reads the roster and
   `npm install`s anything missing. `wiki-plugin-htv` was never published
   (npm 404 — there wasn't even a git repo), so the install failed — but the
   script still wrote `"wiki-plugin-htv": "*"` into the wiki install's
   `package.json` dependencies.
3. **A dep entry with no module crashes wiki-server >= 0.40.** Its pagehandler
   factory runs `require.resolve('<plugin>/package')` for every
   `wiki-plugin-*` dependency with no try/catch
   (`wiki-server/lib/page.js`), and `wiki/farm.js` attaches no `.catch` to
   site startup. `MODULE_NOT_FOUND` → unhandled rejection → **the whole farm
   process died on the first request to any not-yet-started `*.localhost`
   site**. Restart, next visit, dead again — hence "repeatedly crashing".

A second confusion: `command -v wiki` resolves to **different nvm installs in
login vs agent tool shells** (v21 vs v24 at the time), so fixes applied to one
install didn't help the farm running from the other.

## How it is wired now (2026-07-10)

- **Dev-symlink mode, unpublished.** `wiki-plugin-mode dev wiki-plugin-htv`
  symlinks this repo into the farm's wiki install and adds the dep. It stays
  on the Local Plugins roster; `wiki-start` leaves dev symlinks in place.
- `~/bin/wiki-start` was hardened: npm-install failure now falls back to a
  `~/Code/wiki-plugins/<plugin>` symlink, a dep is only written when the
  module actually exists, and a preflight sweep removes any dep whose module
  is missing before the farm starts.

## Rules (do not repeat the mistake)

- **Never add an unpublished plugin to the Local Plugins roster without its
  dev symlink** (`wiki-plugin-mode dev <plugin>` first, then roster).
- **Never hand-edit a `wiki-plugin-*` dependency into wiki's `package.json`.**
  If the module isn't in `node_modules`, the farm dies on wiki-server >= 0.40.
- **Check which wiki install you're wiring** (`command -v wiki`, then confirm
  it matches the running farm's node path in `ps`).
- **Verify on port 4243 / `http://<site>.localhost`**, and always hit one
  fresh subdomain after wiring — first-visit site spin-up is the code path
  that crashes when wiring is wrong.
- If this plugin is ever to be published, use the `publish-plugin-update`
  skill (GitHub: Hitchhikers-Guide-to-the-Galaxy org, npm: `fortyfoxes`) —
  publishing is a gated action, ask David first.

## Note on the plugin itself

The client, `factory.json`, `pages/about-htv-plugin`, and the root
`"type": "module"` all follow the house template correctly. No server
component exists (client-only), so the CJS-server rule doesn't apply here —
but if a `server/server.js` is ever added it MUST be CommonJS with a
`server/package.json` `{"type":"commonjs"}`.
