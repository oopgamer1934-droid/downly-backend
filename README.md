# Downly — All-in-One Video Downloader

A responsive downloader website based on the HTML you shared, with a small Express backend so your RapidAPI key is not exposed in the browser.

## Requirements
- Node.js 18 or newer
- A RapidAPI subscription for `social-download-all-in-one`

## Run locally
1. Extract this ZIP.
2. Open a terminal in this folder.
3. Install packages:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env`.
5. Add your **new** RapidAPI key to `.env`:
   ```env
   RAPIDAPI_KEY=your_new_key_here
   PORT=3000
   ```
6. Start:
   ```bash
   npm start
   ```
7. Visit http://localhost:3000

## Important security note
The RapidAPI key in the HTML you pasted is now considered exposed. Revoke/rotate it in RapidAPI and use the replacement only in your private `.env` file. Never put it in `public/index.html`, GitHub, or client-side JavaScript.

## Deployment
Deploy this as a Node.js app on a host that supports Express. Set `RAPIDAPI_KEY` as a private environment variable in the hosting dashboard. Do not upload `.env`.

## Notes
- Platform support, formats, and availability depend on the RapidAPI provider and its current plan/API response.
- This project does not bypass private accounts, paywalls, DRM, or access controls. Download only content you own or are authorized to save.
