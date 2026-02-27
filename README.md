# Ranking with Friends
## Greyson King

[My Notes](notes.md)

## Startup Application Deliverable

### Brief Description

The title of my startup project is Ranking with Friends. As expressed in the title this project will allow friends to collaborate together to rank their favorite self-created subjects. As shown in rough sketches down below this uses the tier list system (S, A, B, C, D) with an unranked category beneath them all. The collaboration comes in the form of creator and participant. The creator goes to a page to create a category and a dynamic list of items to rank within that category. After creation a server generated join code is made that the creator can tell other participants authenticating that the right people are in the group.

### Elevator Pitch

Have you ever wondered how your opinions compare to your friends? Welcome to "Ranking with Friends" a new ranking system that allows friends to get together and rank anything from movies to basketball players. Using the template of tier lists allows for interesting rankings that can always be different through the voting system.

### Design

![alt text](image.png)

### Key Features

- Secure lobbies with server generated join codes
- Custom Tier lists with different topics and items
- Voting System for each item and the given tiers
- Tier List results are stored
- Ability to create individual username

### Technologies
#### I am going to use the required techologies in these ways:

- **HTML** - HTML is the framework for the application. Multiple HTML pages: Main menu, tier list creation, join page, tier list, and voting.
- **CSS** - CSS is the styling of the application. Used for different colors and font sizes depending on what is needed as seen in the design sketch.
- **React** - React will be used in the join code process/login. It will also be used in the voting system
- **Service** - Endpoints:
    1. Submitting votes
    2. Allocating correct items to correct tiers based on the tally
    3. Showing results
- **DB** 
    1. Storing custom topics/ideas for tier list
    2. Storing saved completed tier lists
    3. Remembering Votes and tier placement
- **Websocket** 
    1. Showing user votes to everyone
    2. Live chat sidebar
    3. Display the number of users voting on the list


## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Server deployed and accessible with custom domain name** - [My server link](https://rankingwithfriends.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **HTML pages** - I have multiple HTML pages beginning with the home page (index), a page to create the tier list, a page to vote, a results page, and an about page. They all link to each other
- [X] **Proper HTML element usage** - I used multiple interesting HTML elements, some as placeholder and other
- [X] **Links** - Nav menu contains working links between each page, while buttons have been setup for future use to navigate pages.
- [X] **Text** - Each page contains text describing what it does along with examples of how it will look in the future.
- [X] **3rd party API placeholder** - Quoted fact in about section as 3rd party API placeholder
- [X] **Images** - Placeholder tier list image in the results page
- [X] **Login placeholder** - Multiple logins on home screen depending on what you want to access
- [X] **DB data placeholder** - Saved tier lists access on result page
- [X] **WebSocket placeholder** - Live voting placeholder on voting page along with live chat, and voting records.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Visually appealing colors and layout. No overflowing elements.** - Maintains a consistent visually appealing style of color and layout.
- [X] **Use of a CSS framework** - Used the Bootstrap CSS framework
- [X] **All visual elements styled using CSS** - Yes each of the pages and aspects of the page were modified using CSS styling such as Header, navbar, body, background, buttons, etc.
- [X] **Responsive to window resizing using flexbox and/or grid display** - Using flex modifiers the page is responsive to window resizising
- [X] **Use of a imported font** - Imported Poppins font
- [X] **Use of different types of selectors including element, class, ID, and pseudo selectors** -  Used element selectors (body, header, button), class selectors(content-block), ID selectors (#login-form), and pseudo selectors (:hover, :root)

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Bundled using Vite** - Installed and configured Vite. Updated package.json with dev, build, and preview scripts
- [X] **Components** - Converted HTML components for each of the 5 pages, Converted all HTML content to JSX with correct additions.
- [X] **Router** - Implemented React Router with BrowserRouter. Updaged NavLink components for navigation, and added a NotFound component for invalid routes.
## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **All functionality implemented or mocked out** - All functionality is implemented or mapped out. User can login and that username is saved to local storage, and is then taken to the create page where they can name and add/subtract items to/from the tier list, this again is saved once the list is created and the voting stage is implemented the join button is also mocked out along with saved lists. Once on the voting page items can have their tier selected live updates and the chat is also mocked out. In the results page the saved tier list is displayed and the database is also mocked. Finally their is an about page that has a 3rd party API mocked.
- [X] **Hooks** - Hooks are used throughout the whole startup project mostly for managing inputs. (username, password, title, items, join code, etc.) use effect hook loads tier list from local storage in voting and results page 

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
