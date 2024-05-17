# David Yellin Collaborative Repository

## Get Started
Please follow these steps to start using this project repository
- Clone this repository `git clone https://github.com/mayNigri/David-Yellin-collaborative-repository`
- Connect to the repository `git remote add origin https://github.com/mayNigri/David-Yellin-collaborative-repository`
- Install react `npm install`
- Copy `.env` file from the Google Drive.
- Start react locally `npm start`

## Useful commands
- `npm start` start react server
- `npm run build` create standalone files for hosting
- `npm run test` run unit tests
- `npm install` installs needed dependencies (run every time you pull from git)

## Project Structure
Below is a detailed breakdown of your existing project structure along with the added test structure, explaining the purpose of each folder and file:

 - `.env` - file that define environment variables that needs privacy and security. (currently has firebase keys)
- `/documents` - all needed instructive documents and diagrams for developement.
- `/src` - code source files directory
- - `/components` - app components
- - `/models` - classes for each model in project
  - `/pages` - pages for each route (need to be updated in `routes.tsx` also)
  - `/services` - services that we are using in the app, example: we have `firebase.tsx` that configures firebase services.
  - `App.tsx` - app root compomnent for routes pages and url paths.
