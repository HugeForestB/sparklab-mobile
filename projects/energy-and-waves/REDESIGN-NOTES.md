# Unit 2 Phenomena — Energy and Waves Redesign (preview branch)

## Purpose
Redesign the existing classroom app rather than replace it. Keep a mode that curious students can open freely, even weeks after a lesson, while offering a guided ten-stage speaker investigation and optional undergraduate physics.

## Audit of existing repository
- Existing site: plain GitHub Pages, no package manager or framework.
- Core app: `projects/energy-and-waves/index.html`, approximately 109 kB, containing **31** vocabulary entries and Canvas renderers.
- Existing features retained: 31 concept records, existing desktop/mobile Canvas renderers, image capture, tone generator, basic correctness feedback, local-only progress, and project switcher.
- Existing Explore, Mini Labs, Word Wall, and teacher/physics views were interwoven in the same file. The redesign hides old top-level navigation in CSS rather than destructively removing the underlying renderers.
- Separate projects elsewhere in the repository are untouched.

## New files
- `redesign.css` — responsive landing page, guided path, Word Wall, bonus mode, and compact controls.
- `redesign.js` — three primary modes, ten-stage learning path, browsable categories, concept-to-bonus navigation, prediction-and-manipulation checks.
- `frequency.js` — paired transverse and longitudinal waves, fixed detectors, one simulated-second measurement, independent physical and playback time.
- `material.js` — investigations for density, length, thickness, and reflectivity; illustrative mass/volume and light-energy accounting.
- `bonus.js` — optional undergrad-level modules in waves, acoustic fields, Maxwell's equations, optics, and electromechanical speakers.

## Student entry points
- **Learning Sequence**: speaker vibration → air → longitudinal waves → transverse waves → media → visible light → material interactions → vacuum propagation → electromagnetic spectrum → circuits.
- **Word Wall**: direct, unlocked concept browsing with four categories.
- **Bonus Physics**: optional from the main navigation and from each concept. This is part of the same application, never a separate required course.

## Known caveats and remaining work
- Bonus Physics is an initial five-module interactive framework, **not** a complete undergraduate textbook. Further sections could cover Fourier decomposition, normal modes, detailed Fresnel derivations, non-planar acoustic fields, and validated speaker-impedance parameters.
- Some legacy models remain simplified and have not been independently validated against physical measurements. Existing text and diagrams remain available for iterative refinements.
- The current detector uses a shared controlled frequency for both waves. Its cycle counter derives from phase and elapsed simulated time, not counting on-screen peaks or animation frames.
- A completed one-second detector result stays visible while the wave animation continues; a changed frequency or reset starts another measurement.
- The material-properties example uses a hypothetical sample. Optical attenuation follows an illustrative Beer–Lambert relationship with fixed coefficient; density is not automatically a predictor of reflectivity.
- Legacy progress is retained under `sparklab-progress-v2`, and verified prediction-plus-manipulation progress is stored separately under `energy-waves-verified-v3`; neither requires login.
- The project currently uses browser-native text/Unicode equations rather than a full offline LaTeX renderer. LaTeX typesetting and richer stepwise derivations are future refinements.
- No student data is sent to a server.

## Testing and review checklist
### Static and numerical checks already performed
- Parsed the original inline JavaScript and all four new JavaScript files successfully.
- Confirmed the four new script paths and stylesheet path are present in the HTML.
- Checked required legacy DOM IDs remain in place.
- Numerically checked phase-cycle counts for 1, 2, 4, and 7 Hz across time windows, including before and after one second.
- Checked reflected, transmitted, and absorbed illustrative energy fractions sum to 1 for several sample thicknesses.

### Manual browser tests required before merging
- [ ] Open from a local HTTP server, including on an actual phone.
- [ ] Home: choose both guided sequence and Word Wall.
- [ ] Word Wall: search, expand all four groups, select at least one word from each.
- [ ] Stage 1: play audible speaker tone and confirm expected sound.
- [ ] Stage 3: set frequency to 4 Hz and verify both detectors hold 4 cycles after one simulated second.
- [ ] Change playback from 0× to 3×; verify counters and physical parameters do not change incorrectly.
- [ ] Stage 7: change each material property and verify readable output and energy budget.
- [ ] Complete a concept check by correctly predicting and manipulating; verify reset behavior after navigation.
- [ ] Bonus: open every module from top navigation and from a concept card; test controls and labels.
- [ ] Test landscape classroom display and portrait phone widths, including keyboard-only navigation and reduced-motion.
- [ ] Verify snapshot button and other legacy features that remain visible.
- [ ] Recheck all scientific explanations before presenting to students.
- [ ] Merge only after a real browser smoke test and review of changes; do not silently deploy unfinished changes.

## Development notes
For local browser review, use a static HTTP server from the repository root, e.g. `python -m http.server 8000`, and open `http://localhost:8000/projects/energy-and-waves/`.

The existing `main` branch is intentionally unchanged. This redesign is isolated on a feature branch and should be reviewed through a pull request.
