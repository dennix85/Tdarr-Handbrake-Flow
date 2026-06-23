# DeNiX's Workflow v2 / v3

## Support

This flow is maintained in my spare time, mostly late at night after the day job. If it's saving you re-encodes or headaches, a coffee goes a long way:

- [PayPal](https://www.paypal.com/paypalme/denixbug)
- [Buy Me a Coffee](https://www.buymeacoffee.com/denix)
- [Liberapay](https://liberapay.com/denixer)

Discord: [Help & Support channel](https://discord.com/channels/623392507828371476/1353809945568612526)

A single Tdarr flow: HandBrake transcode (CPU/QSV/NVENC/VCE, HEVC or AV1, 10-bit) → MKV remux/cleanup → subtitle/audio language filtering → stream reordering → Plex/Jellyfin/Emby-friendly renaming → health check → Radarr/Sonarr unmonitor + Discord notification.

Built for my own library. The defaults below (languages, IPs, encoder choice) are mine — change them before you import.

## What this flow does, in order

<img width="757" height="725" alt="image" src="https://github.com/user-attachments/assets/93d30a0c-24be-4cb6-844f-7a4ed68b4592" />


The screenshot above is the actual graph from the Tdarr UI, including the `failFlow` error branches on the right-hand side. Simplified to just the success path:

```
inputFile
   └─ startInformercial (info card, no-op)
       └─ checkFileNameIncludes  [TDARR] tag present?
            ├─ yes → setOriginalFile → exit (already processed, skip)
            └─ no  → checkNodeOS (routes by platform)
                       └─ HDRVideoCodecMediainfoDumper (HEVC/AV1/HDR10+/DV detection)
                            └─ Remuxer (MKV cleanup: strip data/image/attachment streams, reorder, fix timestamps)
                                 └─ MKVPropEditor (apply prop edits)
                                      ├─ DeNiXHandbrakeManagerHDRDV  (HDR10+/DV sources)
                                      └─ DeNiXHandbrakeManager      (everything else)
                                           └─ SizeDurationChecker (reject if output > input by threshold)
                                                └─ SubtitleCleaner (drop commentary/signs-songs/SDH, language filter)
                                                     └─ AudioProcessor (language filter, drop commentary/lower-quality dupes)
                                                          └─ Reordering (stream order + default audio/subtitle track)
                                                               └─ Renamer (codec/resolution/HDR tag, [TDARR] suffix)
                                                                    └─ MKVPropEditor → replaceOriginalFile
                                                                         └─ HealthChecker → MediaInfoComparator
                                                                              └─ notifyArr → waitTimeouter → unmonitorArr → DiscordNotifiarr
```

Every plugin in the middle has a `failFlow` branch on its error output — if anything goes wrong (bad remux, HandBrake exits non-zero, size check fails) the flow stops there instead of continuing on a broken file. That's most of the branching you'll see in the actual flow graph if you open it in the Tdarr UI; the diagram above only shows the success path.

The `checkFileNameIncludes` step at the top is what makes this flow idempotent — files Tdarr has already processed get the `[TDARR]` tag from the Renamer step, so re-scanning a library doesn't re-encode files that are already done.

## Installation

There are two ways to get this running: let Tdarr pull everything from the repo automatically, or download the plugin files and flow JSON yourself and import them by hand. Pick one — don't mix them, or you'll end up with duplicate plugins.

### Option A — Automated (repo-connected)

This sets the plugins repo URL in Tdarr and lets it pull plugins and flow templates directly from GitHub. Future plugin updates just need another sync — no manual file copying.

1. Tdarr WebUI → Options → set the community plugins repository URL to:
   `https://github.com/dennix85/Tdarr_Plugins/archive/master.zip`

<img width="1083" height="414" alt="image" src="https://github.com/user-attachments/assets/6cc9bc92-a041-42b1-ad5c-7d789a356e4a" />


2. Flows tab → click "Update community plugins" (1) → wait ~10 seconds → click "Sync node plugins" (2)

<img width="469" height="192" alt="image" src="https://github.com/user-attachments/assets/d9b2b32a-7761-4284-b387-9a361060a47a" />


3. Flows tab → "Flow +" (3 in the screenshot above) → Flow Templates → find "DeNiX : Workflow v2 (online repo)" under the "denix" category → click `+` to add it

 <img width="567" height="208" alt="image" src="https://github.com/user-attachments/assets/bdd54622-542d-498e-8933-72e3690cb4f0" />


<img width="527" height="437" alt="image" src="https://github.com/user-attachments/assets/9a208999-14ee-4659-a3d9-b802a5405d38" />


4. Open it and confirm all the DeNiX plugin nodes resolved correctly (no "plugin not found" errors) — if you skipped the sync in step 2, some nodes will show up broken

### Option B — Manual (download and import yourself)

No live repo connection, no screenshots for this path since the UI looks identical to any other manual plugin/flow install. You download the plugin files and the flow JSON from this repo, copy the plugins into Tdarr's local plugin folder, and import the flow as a local JSON template. Updates mean repeating this manually.

1. Download the plugin files from [Tdarr_Plugins](https://github.com/dennix85/Tdarr_Plugins) and copy them into:
   ```
   server\Tdarr\Plugins\FlowPlugins\LocalFlowPlugins\denix
   ```
   (create `LocalFlowPlugins` if it doesn't exist), then restart the Tdarr server
2. Download `Flow/DeNiX's Workflow v2.json` from this repo
3. Flows tab → "Flow +" → Flow Templates → "Import JSON Template" → select the downloaded file
4. Open it and confirm all the DeNiX plugin nodes resolved correctly — under this path, "not found" almost always means a plugin file didn't make it into `LocalFlowPlugins` or the server wasn't restarted after copying

### Either way: make it yours

Go through each node and replace my settings with yours:

- Language preferences (`Remuxer`, `SubtitleCleaner`, `AudioProcessor`, `Reordering`) — mine are set for eng/dut/nld/tur
- Encoder choice in `DeNiXHandbrakeManager` / `DeNiXHandbrakeManagerHDRDV` — mine is QSV AV1
- Radarr/Sonarr URLs and API keys in `notifyArr`/`unmonitorArr`
- HandBrake progress timeout if your hardware is slower than mine

### Test before running at scale

Point it at a handful of files first. The `SizeDurationChecker` and `failFlow` branches will catch obviously broken output, but they won't catch a quality setting that's wrong for your content.

## Docker image
denix811/tdarr-denix on Docker Hub bundles FFmpeg, MediaInfo, HandBrakeCLI, libvmaf and libdovi (Dolby Vision) pre-installed and pathed, so you're not manually wiring up binary paths per node. It does not include the plugins themselves — install those separately via the repo method above or by copying files in like above.

docker pull denix811/tdarr-denix:latest

You can find more info over here: [DockerHub](https://hub.docker.com/r/denix811/tdarr-denix)

## Known limitations

- The flow assumes MKV as both input-tolerant and output container. Non-MKV containers go through the Remuxer first; if your library has a lot of MP4/AVI sources, check that step's behavior before running at scale.
- `DeNiXHandbrakeManagerHDRDV` and the regular `DeNiXHandbrakeManager` are separate branches selected by what `HDRVideoCodecMediainfoDumper` detects upstream — if detection misclassifies a source, it'll hit the wrong encoder path.
- The 2-minute HandBrake progress timeout is tuned for my hardware. A slow CPU preset on a large 4K file can legitimately take longer than 2 minutes between progress updates; raise the timeout if you're seeing false timeout failures on CPU encodes.
- No before/after size or speed numbers are published yet for this specific flow end-to-end. The presets table above is what's configured, not a benchmark.
- The companion "DV AND HDR10+ HW ACCELERATED FFMPEG FLOW" folder in this repo is a placeholder — there's no flow file in it yet.

## HandBrake presets

Nine presets, one set per encoder/codec combination. All target 10-bit output, MKV container.

| Preset | Encoder | HandBrake preset | Quality (CQ/CRF) |
|---|---|---|---|
| `CPU-Libx265-HEVC-10bit` | x265 (CPU) | slow | 21 |
| `CPU-SVT-AV1-10bit` | SVT-AV1 (CPU) | 4 | 22 |
| `QSV_HEVC_10bit` | Intel QSV HEVC | quality | 25 |
| `QSV_AV1_10bit` | Intel QSV AV1 | quality | 18 |
| `NVIDIA_HEVC_10bit` | NVENC HEVC | slowest | 25 |
| `NVIDIA_AV1_10bit` | NVENC AV1 | slowest | 25 |
| `VCE_HEVC_10bit` | AMD VCE HEVC | quality | 25 |
| `VCE_AV1_10bit` | AMD VCE AV1 | quality | 25 |
| `Jellyfin` | x264 (CPU) | veryslow | 21 |

My own flow runs `DeNiXHandbrakeManager` with QSV AV1 as the configured encoder and bitrate filtering on. The plugin has support to modify the presets to ur ownlikings. The plugin has the ability to import presets, if u have very different settings or expectations u can do so with presets .
The full preset JSON is pasted directly into the plugin's HandBrake JSON Preset field rather than loaded as a separate import — the manager plugin takes the whole preset inline.

The CPU presets are noticeably slower than the hardware ones — that's the tradeoff for not depending on a specific GPU/iGPU being present on the node.
These are here for folks that are using another handbrake plugin. these are not activly mainted no more.

## Issues & plugin source

- Plugin source: [Tdarr_Plugins](https://github.com/dennix85/Tdarr_Plugins)
- Issues: Please visit the dedicated discord channel: [Help & Support channel](https://discord.com/channels/623392507828371476/1353809945568612526)
