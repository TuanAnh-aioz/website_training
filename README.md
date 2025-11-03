# Training Dashboard (Static demo)

A small static front-end demo that mimics a training dashboard (training options, training progress/logs, results panel with model loss and inference result). It's intended as a UI scaffold for integrating a real training backend later.

This README contains instructions to run the demo, an overview of the project structure, and notes on how to extend or integrate real training outputs.

---

## Quick start

Requirements:
- Any modern browser (Chrome/Firefox/Edge)
- Python 3 (for the simple static server)

Run the local static server from the project root and open the site in your browser:

```bash
cd /home/aioz-ta/Documents/Project/website
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Important: `app.js` uses ES modules (import/export). The page must be served over HTTP (file:// will not work for modules). The simple Python server above is sufficient.

## What you'll see
- Left column: Training Options (task type, dataset, model, optimizer, scheduler, loss, hyperparameters)
- Center: Training Progress & Logs
- Right column: Results — Inference Result, Model Loss (chart) and Model Info

## Project structure

```
website/
├─ components/                 # HTML fragments loaded dynamically
│  ├─ training_options.html
│  ├─ training_progress.html
│  ├─ training_logs.html
│  └─ training_results.html
├─ css/
│  ├─ styles.css               # main styling
│  └─ results.css              # results panel styles
├─ images/                     # demo images used in Results
├─ js/
│  ├─ components.js            # loads HTML fragments into index.html
│  ├─ app.js                   # main app coordinator (type="module")
│  └─ modules/                 # split JS modules (options, logs, progress, results)
│     ├─ training-options.js
│     ├─ training-progress.js
│     ├─ training-logs.js
│     └─ training-results.js
└─ index.html
```

## How components are loaded
`js/components.js` fetches the `components/*.html` fragments and injects them into placeholders in `index.html` on DOMContentLoaded. After components load it calls `initApp()` which is defined by `js/app.js`.

This makes it easy to edit a single component (`components/training_logs.html` etc.) without editing the main `index.html`.

## JS architecture notes
- `js/app.js` is the main coordinator and now uses ES module imports from `js/modules/*`.
- Modules:
	- `training-options.js` — fills model options and exposes `getCurrentOptions()`
	- `training-progress.js` — updates epoch/loss/accuracy display
	- `training-logs.js` — manages log entries and controls (copy/download/clear)
	- `training-results.js` — manages the loss chart, model info, and model download

If you want to add features or hook a server, focus on `app.js` and the modules — they are intentionally small and isolated.

## Logs ordering change
By default the demo now appends logs so the newest entries appear at the bottom (like a console). That behaviour is implemented in `js/modules/training-logs.js` (`log()` uses `appendChild`). If you prefer newest-first, change `appendChild` back to `prepend`.

## Replacing demo images / showing real results
- Put result images into `images/` and update the `components/training_results.html` markup or the results module to swap images in at runtime.
- For real model outputs (inference result images), add a small API on your training/inference backend that returns image URLs (or base64) and update `training-results.js` to fetch and display them.

## Running tests / quick verification
1. Start the Python static server (see Quick start)
2. Open the site in the browser
3. Click `Start Training` — the demo will simulate epochs, update metrics, append logs, and draw a simple loss/val loss chart.

## Extending to a real backend
- Add endpoints to your backend that provide:
	- Training status (current epoch, loss, metrics)
	- Latest model artifacts (download URL)
	- Inference images / predictions
- Update `js/modules/*` to poll or subscribe (WebSocket) to the backend endpoints and update UI components accordingly.

Security note: This project is purely a client-side demo. If you expose model downloads or dataset uploads in production, secure your endpoints and add authentication.

## Troubleshooting
- If charts or modules don't load, make sure you are serving via HTTP (not `file://`) and open the browser console for errors.
- If model options are blank, verify `components/training_options.html` exists and that components were loaded (check network fetch from `js/components.js`).

## Development notes
- To add a new UI component: create `components/your_component.html`, add a placeholder div to `index.html`, and update `js/components.js` to load it.
- To add new JS functionality: add a module under `js/modules/` and import it from `js/app.js` (remember to keep `app.js` a module via `<script type="module">`).

---

Xin chào — nếu bạn muốn mình viết ghi chú/phiên bản README bằng tiếng Việt đầy đủ hơn, mình sẽ bổ sung phiên bản tiếng Việt.

License: MIT (you can change as needed)
Training Dashboard - Static Demo

This is a small static demo that reproduces the three-column training dashboard from the screenshot.

Files:
- index.html — main page
- css/styles.css — styles
- js/app.js — small demo logic to simulate training

How to run:
1. Open `index.html` in your browser (double-click or `xdg-open index.html`).
2. Click "Start Training" to simulate training logs and watch the progress.

Next steps / options:
- Convert to a React app (Vite) if you want componentized code and state management.
- Hook the UI to a backend that streams real training metrics (WebSocket or SSE).
- Add charts (Chart.js or D3) to replace the small inline SVG.

If you want, I can:
- Convert this into a React + Vite + Tailwind project with source build scripts.
- Add downloadable assets and a real chart library.
