# Cat Health Tracking Dashboard PRD

## Introduction
A web-based dashboard for monitoring the health and habits of multiple cats. The dashboard displays metrics from IoT devices (Litter Robot, SureFeed bowls, SureFeed Felaqua) integrated via Home Assistant. This v1 focuses on building the UI with stubbed data, with live Home Assistant integration to follow.

## Goals
- Provide at-a-glance health monitoring for multiple cats
- Visualize trends in weight, food consumption, water intake, and litter usage
- Surface anomalies and potential health concerns through alerts
- Create a foundation for future Home Assistant integration

## User Stories

### US-001: View All Cats Overview
**As a** cat owner
**I want** to see a summary of all my cats on one screen
**So that** I can quickly assess everyone's status

**Acceptance Criteria:**
- [ ] Dashboard displays cards for each cat with name and photo
- [ ] Each card shows latest weight, food eaten today, water consumed today
- [ ] Visual indicators show if any metrics are outside normal range
- [ ] Typecheck passes

### US-002: View Individual Cat Profile
**As a** cat owner
**I want** to view detailed metrics for a specific cat
**So that** I can monitor their health trends closely

**Acceptance Criteria:**
- [ ] Clicking a cat card navigates to their profile page
- [ ] Profile shows cat name, photo, and basic info
- [ ] Current values displayed for: weight, food eaten, water consumed
- [ ] Typecheck passes
- [ ] Verify in browser

### US-003: View Weight Trend Chart
**As a** cat owner
**I want** to see a chart of my cat's weight over time
**So that** I can spot gradual weight changes

**Acceptance Criteria:**
- [ ] Line chart displays weight data points over selectable time range
- [ ] Time range options: 7 days, 30 days, 90 days, 1 year
- [ ] Chart shows date on x-axis, weight on y-axis
- [ ] Typecheck passes
- [ ] Verify in browser

### US-004: View Food Consumption Trend Chart
**As a** cat owner
**I want** to see how much my cat has been eating over time
**So that** I can detect appetite changes

**Acceptance Criteria:**
- [ ] Bar or line chart shows daily food consumption
- [ ] Selectable time range: 7 days, 30 days, 90 days
- [ ] Shows amount eaten per day in grams
- [ ] Typecheck passes
- [ ] Verify in browser

### US-005: View Water Consumption Trend Chart
**As a** cat owner
**I want** to see my cat's water intake over time
**So that** I can ensure they're staying hydrated

**Acceptance Criteria:**
- [ ] Chart displays daily water consumption
- [ ] Selectable time range: 7 days, 30 days, 90 days
- [ ] Shows amount in ml
- [ ] Typecheck passes
- [ ] Verify in browser

### US-006: View Shared Resource Status
**As a** cat owner
**I want** to see the status of shared resources (food bowls, water fountain, litter)
**So that** I know when to refill or clean

**Acceptance Criteria:**
- [ ] Dashboard section shows current bowl food levels per cat
- [ ] Shows water fountain remaining level
- [ ] Shows litter tray waste level (how full)
- [ ] Shows litter hopper level (fresh litter remaining)
- [ ] Visual indicators (progress bars or gauges) for each
- [ ] Typecheck passes
- [ ] Verify in browser

### US-007: Display Alerts for Anomalies
**As a** cat owner
**I want** to see alerts when metrics are unusual
**So that** I can catch potential health issues early

**Acceptance Criteria:**
- [ ] Alert banner/section displays active alerts
- [ ] Alerts triggered for: significant weight change, low food consumption, low water consumption
- [ ] Each alert shows cat name, metric, and description
- [ ] Alerts visually distinct (color/icon)
- [ ] Typecheck passes
- [ ] Verify in browser

### US-008: Add/Edit Cat Profiles
**As a** cat owner
**I want** to add and edit my cats' profiles
**So that** the dashboard knows which cats to track

**Acceptance Criteria:**
- [ ] Form to add a new cat with name and photo
- [ ] Ability to edit existing cat name/photo
- [ ] Cat list updates after add/edit
- [ ] Typecheck passes
- [ ] Verify in browser

### US-009: Create Stubbed Data Layer
**As a** developer
**I want** realistic stubbed data for all metrics
**So that** I can build and test the UI before Home Assistant integration

**Acceptance Criteria:**
- [ ] Stub data includes 2-3 sample cats
- [ ] Each cat has 90 days of weight, food, and water history
- [ ] Shared resource levels have current values
- [ ] Data includes some anomalies for alert testing
- [ ] Data access abstracted behind service layer for future swap
- [ ] Typecheck passes

## Functional Requirements
- FR-1: Dashboard must support multiple cats (no hardcoded limit)
- FR-2: All charts must support time range selection
- FR-3: Metrics displayed in appropriate units (g for food, ml for water, kg for weight)
- FR-4: Responsive layout for desktop and tablet viewing
- FR-5: Alerts must be calculated from stubbed data thresholds

## Non-Goals (Out of Scope)
- User authentication/multi-user support
- Mobile native app
- Push notifications or email alerts
- Data export (CSV, PDF)
- Persistent data storage (database)
- Live Home Assistant integration (stubbed only)
- Historical data import

## Design Considerations
- Clean, minimal UI with focus on data visualization
- Cat photos as primary visual identifier
- Color-coded status indicators (green/yellow/red)
- Charts should be interactive (hover for values)
- Dark mode support (optional but nice for home dashboard)

## Technical Considerations
- **Framework:** TanStack Start
- **Charts:** Consider Recharts, Chart.js, or similar
- **Styling:** Tailwind CSS or similar utility framework
- **Data layer:** Abstract behind service/hook for easy swap to Home Assistant later
- **State:** TanStack Query for data fetching abstraction

## Success Metrics
- All user stories completed with passing acceptance criteria
- UI renders correctly with stubbed data
- Charts display and update based on time range selection
- Alerts calculate and display correctly from stub data

## Open Questions
- What weight change threshold should trigger an alert? (e.g., 5% change in 7 days)
- What food/water consumption drop should trigger an alert? (e.g., 50% below average)
- Should litter metrics be per-cat (if Litter Robot supports it) or household-level?
- Cat photo upload - local file or URL?
