# Story Builder

## Overview

Story Builder is a simple web application that allows users to create, edit, organize, and store fictional characters.

The goal of this project is to practice:
- JavaScript DOM manipulation
- CRUD operations (Create, Read, Update, Delete)
- State management
- Local storage persistence
- UI/UX fundamentals

## Features

### Core features (MVP)

- Add / Edit / Delete a character (name + description)
- Display list of characters
- Add / Edit / Delete storylines Chapters and scenes (title + content)
- Display list of Chapters and scenes
- Add / Edit / Delete locations (title + content)
- Display list of locations
- Persistent storage using localStorage

### Bonus features

- Search/filter objects
- Export data as JSON file
- Import data from JSON file
- Responsive UI design
- Multi-page MPA navigation
- Card-based layout with hover effects

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage API

## Data Model



Each character is stored as:

```js
{
  id: number,
  name: string,
  description: string
}
```
Each chapter/scene is stored as:

```js
{
  id: number,
  title: string,
  scenes: [
    {
      id: number,
      title: string,
      content: string,
      updatedAt: number
}
```
Each location is stored as:

```js
{
  id: number,
  name: string,
  description: string
}
```

## Application Architecture

### Core functions

```js
renderCharacters() → updates UI
addCharacter() → adds new entry
deleteCharacter() → removes entry
editCharacter() → updates existing entry
saveToLocalStorage() → persists data
loadFromLocalStorage() → loads saved data
```

## How to Run

### 1. Clone the repository
```js
git clone git@github.com:AstralVixen373/my-portfolio.git
```

### 2. Open the project folder

### 3. Open index.html in your browser

## Project structure
```js
story-builder/
├── css/
    ├── index.html              # Home / dashboard
    ├── characters.html         # Characters module
    ├── chapters.html           # Chapters / scenes module
    ├── locations.html          # Worldbuilding module
    │
    ├── css/
    │   └── style.css           # Global styles (shared across all pages)
    │
    ├── js/
    │   ├── shared.js           # Storage + utilities
    │   ├── characters.js       # Characters logic
    │   ├── chapters.js         # Chapters / scenes logic
    │   └── locations.js        # Locations logic
    │
    ├── assets/
    │   ├── icons/
    │   └── images/
    │
    └── README.md
```

## Development Checklist

### Day 0 — Planning
- Defined project idea
- Defined MVP features
- Defined bonus features
- Defined basic data model for characters
- Created basic project files
- Planned functions structure

### Day 1 — Core foundation + Edit/Delete system
- Built HTML structure for characters' page (form + list)
- Created characters array
- Implemented add character
- Implemented render function
- Ensured UI updated correctly
- Added edit mode state
  - Loads data into form
  - Updates existing character
- Added delete button per item
  - Implements event delegation
  - Removes from array
  - Syncs with UI + localStorage

### Day 2 — UI improvements
- Card layout instead of list
- Spacing system
- Hover effects
- Remove bullet points
- Centered container layout

### Day 3 — Import / Export + Search system
- localStorage load/save working
- Export JSON file
- Import JSON file
- Replace state + re-render
- Add search input
- Filter characters dynamically
- Keep original array intact
- Update render logic

### Day 4 — Restructured into a multi-page MPA navigation system
- Restructured project's architecture
- Created separate html and js files to accomodate the home page, the chapters page and the locations page
- Coded home page and started coding chapters page

### Day 5 — Updated App Architecture and generalised features
- Reorganized directory
- Updated data map
- Implemented export/import feature across all MPA
- Finished the chapters page

### Day 6 — Added a Delete all data feature and the locations page
- Added a Delete button next to the Import and Export ones, in the toolbar and coded its associated function
- Coded the locations page

### Day ? — Final polish
- UI consistency check
- Fix spacing and alignment
- Add empty state message
- Test full app flow
- Bug fixes

### Testing Checklist
- Add character/scene/location works
- Edit character/scene/location works
- Delete character/scene/location works
- Refresh = keeps data
- Import works correctly
- Export works correctly
- Delete works correctly
- Search works correctly
- Navigation between pages works correctly

### Possible future Improvements
- Authentication system
- Backend storage (Rails integration)
- Categories/tags system
- Add more variables to the characters cards
- Drag and drop ordering
- Animations and transitions

## Author: AstralVixen373
Created as part of a web development learning journey.
