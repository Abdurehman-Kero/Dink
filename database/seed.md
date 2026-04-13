
## ROLE

You are a **senior backend engineer** working with:

* Prisma ORM
* PostgreSQL
* A production-grade **Event Management Platform**

Your task is to generate a **complete seed system** that populates ALL tables with **realistic, relational, and demo-ready data**.

---

## PRIMARY OBJECTIVE

Populate the database such that:

* Every table has **at least 10 rows (where logically applicable)**
* All relationships are **valid and meaningful**
* The data simulates **real-world platform behavior**
* The system is **ready for a live demo**

---

## 🔴 CRITICAL RULE: NO RANDOM DATA

You MUST NOT generate:

* Random names without context
* Disconnected records
* Invalid foreign key references

Instead:

> Every record must be part of a **coherent story** (events, users, orders, check-ins, etc.)

---

## 📁 OUTPUT STRUCTURE

Create:

```bash
/Seed/
  ├── seed.ts
  ├── data/
  │     ├── roles.ts
  │     ├── users.ts
  │     ├── organizers.ts
  │     ├── categories.ts
  │     ├── events.ts
  │     ├── tickets.ts
  │     ├── orders.ts
  │     ├── reviews.ts
  │     ├── staff.ts
  │     ├── payments.ts
  │     ├── checkins.ts
  │     └── notifications.ts
  ├── utils/
  │     ├── ids.ts
  │     └── helpers.ts
```

---

## 🧩 DOMAIN MODELING REQUIREMENTS

---

## 1. ROLES

Create roles:

* admin
* organizer
* user

These must be inserted FIRST.

---

## 2. USERS (VERY IMPORTANT)

Create **at least 30 users** divided as:

| Role      | Count |
| --------- | ----- |
| Admin     | 2–3   |
| Organizer | 8–10  |
| Regular   | 15+   |

---

### REQUIRED USER FORMAT

Each user MUST include:

* Realistic full name
* Email (consistent pattern)
* Username (optional but realistic)
* Password (plain for demo but stored as hash)

---

### 🔑 LOGIN CREDENTIALS (MANDATORY OUTPUT)

You MUST output a table like:

```md
### Demo Accounts

Admin:
- email: admin1@event.com
- password: Admin123!

Organizer:
- email: organizer1@event.com
- password: Organizer123!

User:
- email: user1@event.com
- password: User123!
```

---

### PASSWORD RULE

Hash using:

```ts
bcrypt.hash("password", 10)
```

But ALSO document the **plain password for demo use**.

---

## 3. ORGANIZER PROFILES

Only for users with organizer role.

Include:

* organization_name (realistic)
* organization_type:

  * corporate
  * non_profit
  * individual
* verification_status:

  * mix of approved / pending / rejected

At least:

* 5 approved
* 2 pending
* 1 rejected

---

## 4. EVENT CATEGORIES

Create at least 10:

* Technology
* Music
* Business
* Education
* Health
* Networking
* Startup
* Workshop
* Festival
* Conference

---

## 5. EVENTS (CORE SYSTEM)

Create **10–15 events**.

---

### REQUIRED VARIETY

You MUST include:

* 1 draft event
* 1 cancelled event
* 2 completed events
* 5+ published events

---

### EVENT TYPES

* Conference
* Workshop
* Festival
* Meetup
* Webinar

---

### LOCATION DATA

Use realistic Ethiopian cities:

* Addis Ababa
* Adama
* Bahir Dar
* Hawassa

---

### IMAGE REQUIREMENT

Use `banner_url`:

* Use real Unsplash URLs
* Match event theme

Example:

```ts
https://images.unsplash.com/photo-1540575467063-178a50c2df87
```

At least:

* 80% events have images
* 20% null (test fallback UI)

---

## 6. TICKET TYPES

Each event must have **2–3 ticket tiers**:

* Regular
* VIP
* Early Bird

---

### RULES

* capacity ≥ remaining_quantity
* Some ticket types must be **sold out**
* Some partially available

---

## 7. ORDERS (REAL FLOW)

Orders must simulate:

* Successful payments (paid)
* Failed payments
* Cancelled orders
* Refunded orders

---

### REQUIRED RELATION

* Orders → Users
* Orders → DigitalTickets

---

## 8. DIGITAL TICKETS

ONLY create tickets for:

* `paid` orders

---

### RULES

* ticket_code must be unique
* Some tickets:

  * used (checked in)
  * unused

---

## 9. CHECK-IN LOGS

Simulate real scanning:

* valid
* already_scanned
* invalid

---

### RULE

Only tickets that exist can be checked in.

---

## 10. STAFF MEMBERS

Assign staff to events:

* Roles:

  * staff
  * security

---

### REQUIREMENTS

* Each major event has 2–5 staff
* Some linked to existing users
* Some external (no user_id)

---

## 11. REVIEWS & REPLIES

---

### REVIEWS

* Only for completed events
* Ratings: 1–5
* Mix of:

  * positive
  * negative
  * neutral

---

### REVIEW REPLIES

* Written by organizers
* Only for some reviews

---

## 12. PAYMENTS & FINANCE

---

### PlatformFeePayment

* Only for organizers
* Mix of:

  * pending
  * completed

---

### Payouts

* Only for organizers
* Only after completed events
* Must align with event success

---

## 13. NOTIFICATIONS

Create for:

* Order confirmations
* Event reminders
* Event updates

---

### RULES

* Some read
* Some unread

---

## 14. TIME CONSISTENCY (CRITICAL)

Ensure:

* event.start < event.end
* orders.created < paid_at
* ticket.used_at within event time
* check-ins within event duration

---

## 15. EXECUTION ORDER (MANDATORY)

1. Roles
2. Users
3. OrganizerProfiles
4. EventCategories
5. Events
6. TicketTypes
7. Orders
8. DigitalTickets
9. StaffMembers
10. CheckInLogs
11. Reviews
12. ReviewReplies
13. PlatformFeePayments
14. Payouts
15. Notifications

---

## 16. IMPLEMENTATION RULES

* Use `createMany` where possible
* Use `upsert` for idempotency
* Use deterministic IDs:

```ts
id: `user_${i}`
```

---

## 17. DEMO SCENARIOS (MUST EXIST)

Your data must clearly support:

* ✅ User buys ticket → gets digital ticket
* ✅ Staff scans ticket → check-in recorded
* ✅ Event completed → reviews added
* ✅ Organizer replies to reviews
* ✅ Organizer receives payout
* ✅ Notifications sent

---

## 18. FINAL OUTPUT

After seeding, print:

```bash
Seed Completed:
Users: X
Events: X
Orders: X
Tickets: X
CheckIns: X
```

---

## 🧠 FINAL RULE

> This is NOT a seed script.
> This is a **simulation of a real platform**.

Every entity must connect logically to another.

