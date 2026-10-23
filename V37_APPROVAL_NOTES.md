# Saigon Authentic v37 — review candidate (21 October 2026)

This is a local demo only. No GitHub production changes.

## Approved changes
- Brochure-consistent tour titles: Saigon Night Motorbike & Local Dinner; Full Day Discover Authentic Mekong Delta.
- Corrected website spelling: Vietnamese Noodle Soup; English-speaking guide.
- Vegetarian options available on request: Walking Food, Motorbike, Mekong and Cu Chi/Mekong Combo.
- Breakfast note before 7:30 AM departures: begin at 7:30 AM; eat from 7:00 AM at Saigon Authentic Hostel if breakfast included (Alley guests may walk over 100 m).
- Preserved the existing Mekong workshop/place itinerary without introducing new stops.
- Booking enquiry (Homepage): human-readable date and warmer message closing.
- Hostel detail pages: check-in, check-out, guests modal added to existing Check Availability CTA, with matching structured WhatsApp message.
- Tour enquiry: Cu Chi morning/afternoon conditional choice, accommodation / pickup location optional field and structured message.
- Real Guest Moments carousel retains swipe and arrows; click or keyboard on individual photos opens an enlarged viewer with navigation, ESC/X close.

## Safety
- No changes to visible tour prices; no prices displayed.
- Site includes real photographs (original assets), no AI pictures.
- No automatically sent WhatsApp messages; guest presses Send in WhatsApp.
- Do not deploy without owner review and a Work implementation command.
- PDF brochure itself has not been edited; typographic corrections on this demo do not edit source PDF.

## Date appearance consistency (requested)
- All on-screen date selectors (Homepage check-in/check-out, hostel room enquiries, Local Experiences preferred date) show friendly English **25 October 2026** once selected.
- The original native date input remains for picking a date, date validation and the ISO internal form value. WhatsApp messages already used the friendly date style, so they remain unchanged.
- Applied through v37-readable-dates.css and v37-readable-dates.js; no design or content changes elsewhere.
