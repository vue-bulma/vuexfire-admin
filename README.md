# vuexfire-admin
A Vue.js 2 admin app, based on vue-admin, using vuex, vuexfire, vue-router and firebase as the backend.

This project aims to be a template for using Firebase as a backend, and vue-admin as a frontend.

A lot of work has been done in a private repository and I'm currently in the progress of migrating this across to this public repo.

### Current features developed (to be migrated here):

- Vuexfire for Firebase integration
- Firebase auth
- Ability to set a password (including Firebase reauth flow handling)
- Ability to link multiple auth providers
- Frontend Notification dispatching system (ie. not integrated with Cloud Messaging) and default notifications
- Protected Routes
- A User dashboard
- A basic User Notes taking feature, where completed / incompleted notes are shown on the User dashboard. Along with new note form that accepts a title, and wysiwyg body field (Quill)

### Additional work

I have a companion node.js server app that runs on heroku.  It watches the firebase database and performs database actions using firebase-admin sdk.

I will aim to make this app publicly available too, but optional (ie. not required for vuexfire-admin to work).

### Installation (Proposed method, not yet implemented)

1. Rename `CHANGEME.env` to `.env`
2. Add your firebase config
3. `npm install`
4. `npm run dev`