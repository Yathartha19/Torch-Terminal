<div align="center">
  <img src="public/logo.png" width="144" height="144" alt="Terax" />
  <h1>Torch</h1>

  <p><strong>Personal fork of <a href="https://github.com/crynta/terax-ai">Terax</a> — lightweight terminal-first dev workspace.</strong></p>

  <p>
    <img src="https://img.shields.io/github/v/release/RiotBeard/termax?label=version&color=blue" alt="version" />
    <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="license" />
    <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey" alt="platform" />
  </p>

  <p>
    <a href="https://terax.app">Website</a>
    ·
    <a href="https://terax.app/docs">Docs</a>
    ·
    <a href="https://github.com/crynta/Terax-website">Website's source code</a>
  </p>
</div>

---

Torch is a personal fork of [Terax](https://github.com/crynta/terax-ai). Functionality and credit for the upstream design and code go to [@crynta](https://github.com/crynta). This fork changes branding, distribution, adds and removes features ( removes auto-updater and ai features, adds draggable tabs, UI and keybind changes ).

If you want the official cross-platform builds (macOS Intel, Linux, Windows), get them from [crynta/terax-ai](https://github.com/crynta/terax-ai) — this fork is for personal use.

## What it is (from upstream)

A lightweight open-source terminal built on Tauri 2 + Rust and React 19. Native PTY backend with a WebGL renderer, agentic AI side-panel that runs against your own keys or fully local models, plus code editor, file explorer, source control with git graph, and a web preview pane. About 7-8 MB on disk. No telemetry. No account.

For the full feature list, screenshots, and roadmap, see the [upstream README](https://github.com/crynta/terax-ai#readme).

## Build from source

**Prerequisites**
- Rust ≥ 1.85 stable (`rustup update stable`)
- Node 20+ and [pnpm](https://pnpm.io)

**Run**
```sh
pnpm install
npm run tauri dev                                # development
```

**Checks**
```sh
pnpm exec tsc --noEmit                                            # frontend type-check
pnpm test                                                         # frontend tests
cd src-tauri && cargo clippy --all-targets --locked -D warnings   # Rust lint
cd src-tauri && cargo test --locked                               # Rust tests
```

## Attribution

Torch is derived from [crynta/terax-ai](https://github.com/crynta/terax-ai), licensed under Apache 2.0. See [NOTICE](NOTICE) for the list of modifications and [LICENSE](LICENSE) for the original Apache 2.0 license, both preserved unchanged.

## License

Apache-2.0. See [LICENSE](LICENSE).
