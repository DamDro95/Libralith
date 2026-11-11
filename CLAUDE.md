# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Libralith** is an open source, self-hosted multimedia library server, in the spirit of Jellyfin and Plex. Users point it at folders on their own storage; Libralith scans them, builds a browsable library with metadata and artwork, and streams the media to clients, at home or remotely.

Supported media types:

- Music (audio): **built first**
- Photos
- Videos (movies, TV shows, home video)
- Ebooks
- Comics
- Podcasts
- Games (planned, not yet in scope)

Project status: early. The Laravel app is scaffolded but has no features yet. When something below is marked **TBD**, ask before committing to a direction.

## Repository layout

```
server/           Laravel app: API, web client (Livewire), scanning, streaming
  .ddev/          Local dev environment
design-system/    Libralith design system: brand book, tokens, component guidelines
clients/
  app/            React Native app: phones, Android-based TVs, Apple TV, LG, Samsung (not created yet)
  roku/           Roku app (later, not created yet)
```

## Architecture

- **Server** (`server/`): a Laravel application. It owns library scanning, metadata, the database, user accounts, transcoding and streaming. It exposes a versioned HTTP API (`/api/v1/...`) that every client uses.
- **Clients**:
  - **Web**: built with Livewire inside the Laravel app.
  - **App** (`clients/app/`): one React Native + Expo codebase in TypeScript that builds for:
    - iOS and Android phones
    - Android TV, Google TV, Fire TV and Apple TV, via the React Native TV fork (`react-native-tvos`)
    - LG webOS and Samsung Tizen, via React Native for Web, packaged for each TV

    Share API, data and player logic across platforms, with separate layouts for phone, TV and web where needed. TVs are driven by remote arrow keys, so the web TV build needs a spatial navigation library. Keep the web TV UI lean for older smart TVs.
  - **Roku** (`clients/roku/`): Roku runs only BrightScript, so it is a separate app, built last and optional.

  **Timing**: do not scaffold `clients/app/` until the server's music API can list and stream tracks. Then create it with the latest Expo and a matching `react-native-tvos` version, starting with a mobile music player. TV builds come after video support exists.

Principles:

- **Media files stay where the user put them by default.** Libralith reads library folders in place, like Jellyfin and Plex do. During normal scanning it does not copy, move, rename or edit the user's files, and it does not write embedded tags back into them. Metadata edits are stored in the database. Generated data (thumbnails, transcodes, caches) goes in Libralith's own storage directory. Libraries must work when mounted read-only. The one exception is the opt-in file organizer (see Domain notes).
- **The API is the contract.** Business logic lives in services or actions, not in Livewire components or controllers, so the web UI and the API share it. Anything the web client can do should be possible through the API.
- **Heavy work runs on queues.** Scanning, metadata fetching, thumbnail generation and transcoding are queued jobs. Requests never wait on them.
- **Each media type is a module.** Shared concepts (libraries, items, artwork, playback progress, users) are common. Type-specific scanning, metadata and playback logic sits behind a common interface, so adding a type such as games means adding a module, not changing the core.
- **Pluggable providers.** External metadata sources and transcoding backends sit behind interfaces, each can be enabled or disabled by the admin, and the app must work fully offline with all of them off.
- **Admin-controlled features, user preferences.** Many features (reading mode, offline downloads, providers) are enabled server-wide by an admin. Where the admin allows more than one option, each user can pick their preference.

## Tech stack

- PHP 8.5, Laravel 13, Livewire 4
- SQLite database
- Laravel's `database` queue, cache and session drivers. No Redis for now; keep it simple.
- FFmpeg / FFprobe for probing media, thumbnails and transcoding
- Pest for tests, Pint for formatting
- Vite only to bundle the app's own CSS and JS

### Frontend rules

- **No CSS frameworks or UI component kits.** No Tailwind, Bootstrap or similar. Write plain CSS using flexbox and grid.
- Claude writes all styles, following the Libralith design system (the "Monolith" style). **Read `design-system/README.md` before building any UI**, plus the component guidelines in `design-system/components/` for the component you're building.
- **Dark only.** There is no light theme.
- Use the tokens as CSS custom properties (`var(--seam)`, `var(--space-5)`, `var(--chamfer-m)`, `var(--type-body-size)`). Never hard-code a color, spacing or type value that has a token.
- Each media type is a vault with its own colour (`vault-music`, `vault-podcasts`, `vault-video`, `vault-photos`, `vault-books`, `vault-comics`, `vault-games`). Screens inside a vault use that colour for seams, labels and progress.
- `design-system/tokens.json` is the source of truth for tokens. `server/resources/css/tokens.css` is generated from it: never edit it by hand; change `tokens.json` and run `node design-system/build-tokens.mjs`. The React Native app will use the same `tokens.json`.
- The design system is also kept on claude.ai (https://claude.ai/artifact/HiCUXsZV5dQjMvmVp3DXUZ), where the user designs. When the design changes on either side, update the other and say so.
- Alpine.js (bundled with Livewire) is fine for small interactions.
- Load no assets from external CDNs or font services. Everything is served by the server itself. Fonts come from Fontsource npm packages bundled by Vite.

### Third-party libraries

Use well-maintained third-party libraries (Composer or npm) where they solve a hard problem better than custom code, for example hls.js for HLS playback, epub.js and pdf.js for readers, and a tag-reading library for audio metadata. Before adding one, check its license is compatible with the project, and mention the new dependency to the user.

## Domain notes

- **Streaming**: serve original files with HTTP range requests when the client can play them directly. Transcode (e.g. to HLS) only when needed.
- **Transcoding**: start with software FFmpeg. Hardware acceleration (Intel QSV / VAAPI, then NVIDIA NVENC, AMD) comes later behind a transcoder interface that the admin configures.
- **Progress**: track per-user playback and reading position (timestamp for audio/video, page for ebooks/comics) so users can resume on any client.
- **Comics**: CBZ/CBR/CB7 archives and image folders. **Ebooks**: EPUB first, then PDF.
- **Reading mode**: the admin enables in-browser reading, file download, or both. Users choose their preference among the enabled modes. OPDS is not planned for now, but keep the book/comic catalog behind the service layer so an OPDS feed can be added later.
- **Offline downloads**: mobile clients can download media for offline use when an admin allows it.
- **Podcasts**: unlike the other types, these come from RSS feeds rather than local folders. The server subscribes to feeds and downloads episodes.
- **Music scanning**: read tags with getID3 (`james-heinrich/getid3`) and build the library from embedded tags, not folder names, so any folder layout works. Folder and file names are only a fallback when tags are missing.
- **File organizer (opt-in)**: users can define a naming template, e.g. `{artist}/{album}/{track} - {title}.{ext}`, and have Libralith move and rename files to match. Rules:
  - Off by default. An admin enables it per library, and the library must be writable.
  - Always show a preview of every planned move before applying it.
  - Log every move so it can be undone.
  - Never overwrite an existing file. Report conflicts instead.
  - Run moves as queued jobs, and update database paths in the same step so nothing loses its metadata or play history.
- **Metadata**: read embedded tags first (ID3/Vorbis/FLAC tags, EXIF, EPUB OPF, ComicInfo.xml, NFO files). Then enrich from external providers, each optional:
  - Music: MusicBrainz, Cover Art Archive
  - Video: TMDB, TVDB
  - Books: Open Library
  - Comics: Comic Vine

  Respect each provider's rate limits and terms (MusicBrainz allows about 1 request/second and needs a descriptive User-Agent). Some providers need an API key that the admin supplies; never commit keys.
- **Future features** (planned, not yet in scope): subtitles (including online subtitle search), live TV / DVR, watch-together, Chromecast and DLNA casting.

## Users and security

- **First-run setup**: a fresh install starts in setup mode. The first visit to the web UI runs a setup wizard where the first admin account is created. To stop someone else claiming a server that is exposed to the internet, the wizard requires a one-time setup code printed in the server logs.
- Admins can create more users and promote other users to admin.
- **Per-library access**: each user can be given access to specific libraries.
- **Parental controls**: use content ratings from metadata providers (e.g. TMDB certifications, explicit flags on music) to limit what a user can see.
- **Remote access** is supported. Assume the server is reachable from the internet: rate-limit authentication, and use secure cookies behind HTTPS (typically a reverse proxy).
- **API auth**: Laravel Sanctum tokens. TV and mobile apps sign in with a device pairing flow: the device shows a short code, and the user approves it from a signed-in web or mobile session.

## Deployment

- Production installs use a Docker image (Dockerfile **TBD**). Users mount their media folders, read-only if they want, plus a data volume for the database, config and generated files.
- No required external services and no telemetry.

## Development

All commands run through ddev from `server/`:

```bash
ddev start                      # start the environment (https://libralith.ddev.site)
ddev composer install
ddev npm install
ddev npm run dev                # Vite dev server
ddev npm run build              # production asset build
ddev artisan migrate
ddev artisan queue:work         # run queued jobs
ddev exec vendor/bin/pest       # run tests
ddev exec vendor/bin/pint       # format code
```

After changing `design-system/tokens.json`, regenerate the CSS from the repo root (on the host, since ddev only mounts `server/`):

```bash
node design-system/build-tokens.mjs
```

The ddev web container includes FFmpeg. There is no database container; the app uses SQLite at `database/database.sqlite`.

## Conventions

- Follow standard Laravel conventions and directory structure.
- Run Pint before committing.
- Write Pest tests for scanners, metadata parsers and API endpoints.
- Keep the API documented as it grows.
- No CI or contribution guidelines for now.

## License and business model

- Libralith is licensed under **AGPL-3.0-only** (see `LICENSE`). Every feature in this repo is free and open source. Never add license checks, paywalls or locked features to the app.
- The project plans to fund itself through:
  - **A paid remote-access service** (later): an optional subscription that gives a server an address like `name.libralith.app`, automatic HTTPS, and an encrypted relay for when a direct connection isn't possible. The relay is a separate, private project. It stores no media and only passes encrypted traffic along.
  - **Paid app-store builds** of the clients.
  - **An optional supporter license** that unlocks nothing.
  - **Commercial licenses** for companies that want to bundle Libralith without AGPL terms.
- **Design for the relay**: remote access must also work without it, through port forwarding, a reverse proxy, Tailscale or Cloudflare Tunnel, and Libralith should document those options. Keep how clients discover and connect to a server behind an abstraction, so a relay connector can be added later without reworking clients.
- **CLA reminder**: the project owner currently owns all code, which is what makes paid apps and commercial licenses possible. Before merging the first outside contribution, set up a Contributor License Agreement (e.g. with CLA Assistant). If an outside pull request appears and no CLA is in place, flag it to the user instead of merging.
