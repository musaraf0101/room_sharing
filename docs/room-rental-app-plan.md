# Room Rental App — Product Plan
> Sri Lanka's trust-first room rental platform — for anyone looking for a room or listing one, with fully transparent, all-inclusive pricing.

---

## Positioning

**The easiest and most transparent way to find or list a room in Sri Lanka.**

Not another generic classifieds board. A dedicated room rental platform where every listing shows the real total cost upfront — no hidden fees, no surprises after calling the landlord. Anyone can post a room or post that they need one.

---

## Target Users

| User Type | Who They Are |
|---|---|
| Students | Looking for rooms near universities, colleges |
| Working professionals | Relocating to a new city for a job |
| Families | Looking for affordable rentals |
| Expats & foreigners | Short or long-term stays in Sri Lanka |
| Landlords / room owners | Individuals renting out rooms, annexes, or houses |
| Boarding house owners | Multiple rooms to list and manage |

---

## Two Sides of the Platform

### Anyone — Posts a Room

| Field | Details |
|---|---|
| Room type | Single / Sharing / Annex / Boarding / Apartment / Full house / Short stay |
| Monthly rent | LKR amount |
| What's included | Water, electricity, WiFi, meals |
| Security deposit | LKR amount |
| Location | City, area, nearby landmark |
| Gender preference | Male / Female / Any |
| Suitable for | Students / Professionals / Families / Anyone |
| Available from | Date |
| Photos | Minimum 3 required |
| House rules | No cooking / visitors / pets / etc. |
| Contact | WhatsApp number |

### Anyone — Posts a Room Request

| Field | Details |
|---|---|
| Who I am | Student / Professional / Family / Other |
| Looking in | City / Area |
| Max budget | LKR per month |
| Room type preferred | Single / Sharing / Annex / etc. |
| Move-in date | When they need it |
| Gender | Male / Female |
| Meals needed | Yes / No |
| Duration | Short term / Long term |
| Short bio | Who they are as a tenant |
| Contact | WhatsApp number |

---

## Room Types Supported

| Type | Description |
|---|---|
| Single room | One person, private room |
| Sharing room | 2–4 people share one room, split rent |
| Annex | Separate attached unit with own entrance |
| Boarding house | Full boarding with meals included |
| Apartment | Full apartment, shared or solo |
| Full house | Entire house for rent |
| Short stay | Weekly rate — exam season, work trips, travel |

---

## Key Features

### Smart Two-Sided Marketplace
Landlords can browse people looking for rooms that match their listing. Renters can browse available rooms that match their budget and area. Both sides benefit — unlike Ikman.lk which only shows supply with no demand side.

### Transparent Pricing (Core Differentiator)
Every listing must show:
- Base rent
- Utilities (water, electricity)
- WiFi / meals if included
- Security deposit

Renters see the **real total cost** before making any contact. A listing cannot be submitted without filling all price fields. This is what makes this platform different from every other option in Sri Lanka.

### WhatsApp-First Contact
No in-app messaging to learn. One-tap WhatsApp button on every listing and request. Sri Lankan users already live on WhatsApp — use it instead of building a chat system from scratch.

### Location-Based Search
Search by city, area, or nearby landmark. Filter by distance. Works for any city in Sri Lanka — Colombo, Kandy, Galle, Negombo, Jaffna, and beyond.

### Multi-language Support
Listings and UI in Sinhala, Tamil, and English. Essential for reaching landlords and renters across all regions of Sri Lanka.

---

## Trust & Verification

| Feature | Side | How it works |
|---|---|---|
| NIC verification | Landlord | Upload NIC photo → manual review → verified badge |
| Phone verification | All users | OTP on signup |
| Price breakdown required | Listings | Can't post without rent + utilities + deposit filled |
| Reviews | Both | Renter reviews landlord. Landlord reviews renter. |
| Report listing | All users | Flag fake or misleading listings for review |

---

## Key Screens to Build

1. **Home page** — Two CTAs: "Find a room" and "Post a room / Post a request." City filter at top. Latest listings and latest requests shown below.
2. **Room listings page** — Filter by city/area, price range, room type, gender preference, suitable for, available date. Each card shows all-in price, location, WhatsApp button.
3. **Room requests page** — Landlords browse people looking for rooms. Filter by city, budget, move-in date, who they are.
4. **Post a room form** — Step-by-step: location → room type → price breakdown → photos → rules → contact.
5. **Post a request form** — Simple form: who I am → where → budget → dates → preferences → short bio. Under 2 minutes.
6. **Room detail page** — Full photos, price breakdown table, landlord profile, rules, map location, reviews, WhatsApp contact button.
7. **User profile** — Landlord: all their listings + verification badge + reviews received. Renter: their request + reviews received.
8. **Search & filters** — City, area, price min/max, room type, gender, available from, suitable for, includes meals, short/long term.

---

## Business Model

| Phase | Model | Price |
|---|---|---|
| Phase 1 (Month 1–3) | Free listings | Build supply first |
| Phase 2 | Featured listing boost | LKR 500–2,000/month |
| Phase 3 | Verified badge subscription | LKR 1,000–3,000/month |
| Phase 4 | Promoted room requests | LKR 300–500 per request |
| Later | Rental agreement PDF generation | LKR 500 per agreement |
| Later | Boarding house management (multi-listing) | LKR 3,000–8,000/month |

---

## Build Roadmap

### Month 1–2 — MVP (Web only)
- Post and browse rooms
- Post and browse room requests
- Location-based search (city/area filter)
- Price breakdown required on all listings
- WhatsApp contact button
- Phone OTP signup

### Month 3 — Traction
- Reviews system (renter reviews landlord, landlord reviews renter)
- Basic user profiles
- Report / flag listing feature
- NIC verification for landlords
- Expand to Kandy and Galle

### Month 4–5 — Mobile App
- React Native app (iOS + Android)
- Push notifications for new matching listings/requests
- Saved listings / saved requests
- Sinhala + Tamil language support
- Expand to all major cities

### Month 6+ — Monetization & Growth
- Featured listings
- Verified landlord badges
- Promoted room requests
- Rental agreement PDF tool
- Boarding house multi-room management dashboard

---

## How to Get Your First Listings

1. **Walk neighborhoods in Colombo.** Rooms for rent are advertised on physical boards, gates, and walls. Knock, explain, offer to list for free.
2. **Post in Sri Lankan Facebook groups.** Housing groups, city groups, expat groups — "Looking for a room in Colombo? Try this free platform."
3. **WhatsApp community outreach.** Post in local WhatsApp groups with a simple message and link.
4. **Ikman.lk listings.** Contact landlords already listing there, offer them a free listing with better presentation and transparency.
5. **Word of mouth.** Every person who finds a room through your platform is a potential referrer.

---

## Access & Authentication

| Action | Login Required |
|---|---|
| Browse room listings | No |
| Browse room requests | No |
| Search and filter | No |
| View room detail page | No |
| Post a room | Yes |
| Post a room request | Yes |
| Contact via WhatsApp | No |
| Leave a review | Yes |
| Save a listing | Yes |

### How it works
- Anyone can land on the platform and browse freely — no account, no friction.
- When a user tries to post a room or post a request, they are prompted to sign up or log in.
- Signup is phone number + OTP only. No email required. Fast and familiar for Sri Lankan users.
- Once logged in, the user is a single role — they can post rooms AND post requests from the same account. No separate landlord or renter account types.

---

## Key Product Decisions

- **No in-app chat for MVP** — Keep contact via WhatsApp. Don't build messaging. Ship faster and reduce complexity.
- **No login to browse** — Anyone can see listings and requests. Only require signup to post. Lower friction = more traffic.
- **Single user role** — No landlord vs renter account split. One account can do both. Keeps auth simple.
- **Mobile after web** — Validate the concept on web first. Build mobile only after you have real users.

---

## Competitive Advantage

| Platform | Gap |
|---|---|
| Ikman.lk | Generic classifieds, no price transparency, no room requests, no trust features |
| Airbnb | Tourist-focused, expensive, not built for long-term local rentals |
| Facebook Groups | No structure, no verification, no filters, high scam risk |
| **This platform** | Transparent pricing, two-sided (rooms + requests), verified users, Sri Lanka-specific |

---

*Built for Sri Lanka.*
