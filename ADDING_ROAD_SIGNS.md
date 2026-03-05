# How to Add / Edit Road Signs, Road Rules & Highway Code Data

All content data lives in **separate JSON files** for easy editing -- you never need to touch TypeScript code to add or remove data.

---

## File Structure

```
data/
  road-signs.json       <-- All road sign categories & signs (Class A-E)
  road-rules.json       <-- Road rules, question help, general notes
  highway-code.json     <-- Highway code sections (speed limits, licensing, etc.)
  notes-content.ts      <-- TypeScript types & re-exports (do NOT edit data here)

public/images/signs/    <-- Where sign image files go
```

---

## Data Schemas

### Road Signs (`data/road-signs.json`)

The file is an **array of category objects**. Each category has a `signs` array:

**Simple class (no subgroups -- Class A, D, E):**
```json
{
  "title": "Danger Warning Signs",
  "subtitle": "Class A",
  "classCode": "Class A",
  "description": "Danger warning signs alert drivers to potential hazards ahead...",
  "shape": "triangle",
  "shapeColor": "#DC2626",
  "shapeFill": "#FEF3C7",
  "signs": [
    {
      "name": "Curve Ahead",
      "meaning": "Sharp bend or curve in the road ahead.",
      "image": "/images/signs/class-a/curve-ahead.png"
    }
  ]
}
```

**Class with subgroups (Class B, C):**
```json
{
  "title": "Regulatory Signs",
  "subtitle": "Class B",
  "classCode": "Class B",
  "description": "Regulatory signs indicate actions that are forbidden, compulsory, or reserved...",
  "shape": "circle-slash",
  "shapeColor": "#DC2626",
  "shapeFill": "#FFFFFF",
  "subgroups": [
    { "name": "Prohibitory Signs", "description": "Circular with red border..." },
    { "name": "Command Signs", "description": "Circular with blue background..." },
    { "name": "Reservation Signs", "description": "Circular with blue background..." }
  ],
  "signs": [
    {
      "name": "No Entry",
      "meaning": "Do not enter this road or lane.",
      "subgroup": "Prohibitory Signs",
      "image": "/images/signs/class-b/no-entry.png"
    }
  ]
}
```

| Field         | Required | Description                                                |
|---------------|----------|------------------------------------------------------------|
| `title`       | Yes      | Category display title (e.g. "Danger Warning Signs")       |
| `subtitle`    | Yes      | Shown below the title (e.g. "Class A")                     |
| `classCode`   | Yes      | `"Class A"`, `"Class B"`, `"Class C"`, `"Class D"`, or `"Class E"` |
| `description` | Yes      | Brief explanation shown when category is expanded          |
| `shape`       | Yes      | Visual badge shape (see Shape Types below)                 |
| `shapeColor`  | Yes      | Hex colour for the shape border / accent                   |
| `shapeFill`   | Yes      | Hex colour for the shape fill                              |
| `subgroups`   | No       | Array of `{ "name": "...", "description": "..." }` -- used by Class B and C |
| `signs`       | Yes      | Array of sign objects                                      |

Each **sign object**:

| Field      | Required | Description                                              |
|------------|----------|----------------------------------------------------------|
| `name`     | Yes      | Sign name (e.g. "No Entry")                              |
| `meaning`  | Yes      | What the sign means                                      |
| `image`    | No       | Path to image file, e.g. `"/images/signs/class-b/no-entry.png"` |
| `subgroup` | No       | Must match a `subgroups[].name` if the class has subgroups (e.g. `"Prohibitory Signs"`) |

### Road Rules (`data/road-rules.json`)

Array of section objects:

```json
{
  "title": "Road Rules",
  "icon": "alt-route",
  "content": [
    "No car should turn right in the face of oncoming traffic",
    "Give way to traffic coming from your right."
  ]
}
```

| Field     | Required | Description                                              |
|-----------|----------|----------------------------------------------------------|
| `title`   | Yes      | Section heading                                          |
| `icon`    | Yes      | MaterialIcons icon name (e.g. `"alt-route"`, `"gavel"`) |
| `content` | Yes      | Array of strings -- each string is one bullet point      |

### Highway Code (`data/highway-code.json`)

Same structure as Road Rules:

```json
{
  "title": "Speed Limits",
  "icon": "speed",
  "content": [
    "Built-up / Urban areas: 60 km/h unless otherwise posted.",
    "Rural / Open roads: 80 km/h unless otherwise posted."
  ]
}
```

---

## The 5 Road Sign Classes

| Class   | Title                    | Subgroups                                | Signs |
|---------|--------------------------|------------------------------------------|-------|
| Class A | Danger Warning Signs     | --                                       | 17    |
| Class B | Regulatory Signs         | Prohibitory, Command, Reservation        | 35    |
| Class C | Informative Signs        | Guidance, Tourism                        | 20    |
| Class D | Traffic Light Signals    | --                                       | 10    |
| Class E | Carriageway Markings     | --                                       | 11    |

---

## Adding a New Sign (Step-by-Step)

### 1. Add the image file (optional)

Place the image in the appropriate folder:

```
public/images/signs/
  class-a/          <-- Danger Warning Signs
  class-b/          <-- Regulatory Signs (prohibitory, command, reservation)
  class-c/          <-- Informative Signs (guidance, tourism)
  class-d/          <-- Traffic Light Signals
  class-e/          <-- Carriageway Markings
```

**Image tips:**
- Use PNG with transparent background for best results
- Recommended size: 200x200 pixels (square) or 300x200 (rectangular)
- Keep file sizes under 50KB for fast loading
- Naming convention: lowercase with dashes, e.g. `no-entry.png`, `speed-limit-60.png`

### 2. Open `data/road-signs.json`

Find the correct category by its `classCode` and `title`.

### 3. Add your sign to the `signs` array

**Simple sign (Class A, D, or E -- no subgroup needed):**
```json
{ "name": "Bridge Ahead", "meaning": "Narrow bridge ahead; oncoming traffic may have priority." }
```

**Sign with image (any class):**
```json
{
  "name": "Bridge Ahead",
  "meaning": "Narrow bridge ahead; oncoming traffic may have priority.",
  "image": "/images/signs/class-a/bridge-ahead.png"
}
```

**Sign in a subgroup (Class B or C -- subgroup is required):**
```json
{
  "name": "No Hitchhiking",
  "meaning": "Picking up or dropping off hitchhikers is prohibited.",
  "subgroup": "Prohibitory Signs",
  "image": "/images/signs/class-b/no-hitchhiking.png"
}
```

> **Important:** For Class B signs, set `"subgroup"` to one of: `"Prohibitory Signs"`, `"Command Signs"`, or `"Reservation Signs"`.
> For Class C signs, set `"subgroup"` to one of: `"Guidance Signs"` or `"Tourism Signs"`.

### 4. Save -- the app updates automatically

---

## Adding a New Category

Add a new object to the array in `data/road-signs.json`:

```json
{
  "title": "Special Zone Signs",
  "subtitle": "Regulatory - Special",
  "classCode": "Class B",
  "description": "Signs indicating special regulated zones.",
  "shape": "rectangle",
  "shapeColor": "#9333EA",
  "shapeFill": "#9333EA",
  "signs": [
    {
      "name": "School Zone",
      "meaning": "You are entering a school zone. Reduce speed to 40 km/h.",
      "image": "/images/signs/class-b/school-zone.png"
    },
    {
      "name": "Hospital Zone",
      "meaning": "Hospital zone ahead. No hooting."
    }
  ]
}
```

---

## Adding Road Rules or Highway Code Sections

Open `data/road-rules.json` or `data/highway-code.json` and add a new section object:

```json
{
  "title": "Your New Section Title",
  "icon": "menu-book",
  "content": [
    "First bullet point.",
    "Second bullet point.",
    "Third bullet point."
  ]
}
```

Common icon names: `"gavel"`, `"speed"`, `"traffic"`, `"directions-walk"`, `"alt-route"`,
`"help-outline"`, `"menu-book"`, `"pan-tool"`, `"signpost"`, `"directions-car"`, `"category"`,
`"cloud"`, `"local-bar"`, `"badge"`, `"compare-arrows"`, `"swap-horiz"`.

---

## Available Shape Types

| Shape               | When to use                            | Visual                       |
|---------------------|----------------------------------------|------------------------------|
| `circle`            | Command/mandatory signs (blue)         | Filled circle                |
| `circle-slash`      | Prohibition signs (red border + slash) | Circle with diagonal line    |
| `triangle`          | Warning/danger signs                   | Triangle with colored border |
| `rectangle`         | Info/guidance/carriageway signs        | Rounded rectangle            |
| `diamond`           | Temporary/construction signs           | Rotated square               |
| `octagon`           | Stop sign                              | Eight-sided shape            |
| `inverted-triangle` | Give way sign                          | Upside-down triangle         |

---

## Recommended Colours per Category

| Category                       | `shapeColor`        | `shapeFill`         |
|--------------------------------|---------------------|---------------------|
| Warning (Class A)              | `"#DC2626"` (red)   | `"#FEF3C7"` (cream) |
| Prohibitory (Class B)          | `"#DC2626"` (red)   | `"#FFFFFF"` (white)  |
| Command (Class B)              | `"#2563EB"` (blue)  | `"#2563EB"` (blue)   |
| Reservation (Class B)          | `"#0284C7"` (sky)   | `"#0284C7"` (sky)    |
| Guidance (Class C)             | `"#047857"` (green) | `"#047857"` (green)  |
| Tourism (Class C)              | `"#78350F"` (brown) | `"#78350F"` (brown)  |
| Traffic Lights (Class D)       | `"#374151"` (gray)  | `"#1F2937"` (dark)   |
| Carriageway Markings (Class E) | `"#7C3AED"` (purple)| `"#7C3AED"` (purple) |

---

## Layout Behaviour

- There are exactly **5 classes** (A through E) -- each is a collapsible section
- Class B and C have **subgroups** that show as labelled dividers inside the expanded section
- Each sign card shows a colour-coded **subgroup tag** (e.g. red for Prohibitory, blue for Command)
- All sign cards use a **full-width horizontal layout**: image on the left (80x80), text on the right
- Signs without images show a numbered badge instead
- The search bar at the top searches across **all classes** by name, meaning, subgroup, or class code

---

## Quick Checklist

1. [ ] Place image file in `public/images/signs/<class-folder>/` (optional)
2. [ ] Open the correct JSON file (`road-signs.json`, `road-rules.json`, or `highway-code.json`)
3. [ ] Find the right category/section or add a new one
4. [ ] Add your entry following the schema above
5. [ ] Save -- the app updates automatically
