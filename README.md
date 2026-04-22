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
- Add / Edit / Delete storylines ideas and draft scenes (title + content)
- Display list of storylines and draft scenes
- Persistent storage using localStorage

### Bonus features

- Search/filter characters
- Export data as JSON file
- Import data from JSON file
- Responsive UI design
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

Each storyline or draft scenes are stored as:

```js
{
  id: number,
  title: string,
  content: string
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
git clone https://github.com/your-username/story-builder.git
```

### 2. Open the project folder

### 3. Open index.html in your browser

## Project structure
```js
story-builder/
│
├── lib/ 
│   ├── index.html
│   ├── style.css
│   ├── script.js
└── README.md
```

## Development Checklist

### Day 0 — Planning
- Define project idea
- Define MVP features
- Define bonus features
- Define data model
- Create project files
- Plan functions structure

### Day 1 — Core foundation
- Build HTML structure (form + list)
- Create characters array
- Implement add character
- Implement render function
- Ensure UI updates correctly

### Day 2 — Delete system
- Add delete button per item
- Implement event delegation
- Remove from array
- Sync with UI + localStorage

### Day 3 — Edit system
- Add edit mode state
- Load data into form
- Update existing character
- Reset edit mode after submit

### Day 4 — UI improvements
- Card layout instead of list
- Spacing system
- Hover effects
- Remove bullet points
- Centered container layout

### Day 5 — Search system
- Add search input
- Filter characters dynamically
- Keep original array intact
- Update render logic

### Day 6 — Import / Export + persistence
- localStorage load/save working
- Export JSON file
- Import JSON file
- Replace state + re-render

### Day 7 — Final polish
- UI consistency check
- Fix spacing and alignment
- Add empty state message
- Test full app flow
- Bug fixes

### Testing Checklist
- Add character works
- Edit character works
- Delete character works
- Refresh keeps data
- Import works
- Export works
- Search works correctly

### Future Improvements
- Authentication system
- Backend storage (Rails integration)
- Categories/tags system
- Drag and drop ordering
- Animations and transitions

## Author: AstralVixen373
Created as part of a web development learning journey.
