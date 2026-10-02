# Saigon Authentic Hostel & Tours Website

Static multi-page website for https://www.saigonauthentichostel.com.

## Hosting
- Production hosting: GitHub Pages
- Publishing source: `main` branch, repository root (`/`)
- Custom domain: `www.saigonauthentichostel.com`
- The apex domain `saigonauthentichostel.com` should redirect to `www` when GitHub Pages and DNS are configured correctly.

## Update workflow
1. Edit or upload the changed website files.
2. Commit the changes to `main`.
3. Open the **Actions** tab and wait for the GitHub Pages deployment to finish successfully.
4. Check the change on https://www.saigonauthentichostel.com.

## Important hosting files
Do not delete these root files:
- `CNAME` - keeps the custom domain for branch-based GitHub Pages publishing.
- `.nojekyll` - tells GitHub Pages to serve this already-built static site without Jekyll processing.

## Pages
- Home
- Rooms
- Hostel Life
- Experiences
- Location
- Reviews

## Booking
All direct booking enquiries go through WhatsApp. The central WhatsApp number is defined in `assets/js/main.js`.

## Assets
Property photography is stored locally under `assets/images/` as WebP. Platform logos are stored locally under `assets/logos/`.

All production media required by the website should be stored in this repository, except intentional third-party services such as Google Fonts, Google Maps, WhatsApp and booking/review platforms.
