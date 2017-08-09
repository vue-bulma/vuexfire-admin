# vuexfire-admin
A Vue.js 2 admin app, based on vue-admin, using vuex, vuexfire, vue-router and firebase as the backend.

This project aims to be a template for using Firebase as a backend, and vue-admin as a frontend.

A lot of work has been done in a private repository and I'm currently in the progress of migrating this across to this public repo.

### Current features developed:

- Vuexfire for Firebase integration
- Firebase auth
- Ability to set a password (including Firebase reauth flow handling)
- Ability to link multiple auth providers
- Frontend Notification dispatching system (ie. not integrated with Cloud Messaging) and default notifications
- Protected Routes
- A User dashboard
- A basic User Notes taking feature, where completed / incompleted notes are shown on the User dashboard. Along with new note form that accepts a title, and wysiwyg body field (Quill)

### Installation

**NOTE: This app assumes you have a working Firebase instance with at least one of the auth providers; Google, Facebook, Github or Password enabled.**

1. Update `config/firebase.env.js` with your firebase config variables
2. `npm install`
3.  Open `node_modules/bulma/sass/utilities/mixins.sass` and add `@import './variables'` to first line.  (issue with `Bulma 0.5.0`)
4. `npm run dev`

### Additional work

I have a companion node.js server app that runs on heroku.  It watches the firebase database and performs database actions using firebase-admin sdk.

I will aim to make this app publicly available too, but optional (ie. not required for vuexfire-admin to work).

---
### Credits

This project is inspired or powered by these people or projects so I want to thank them

- [Vue](https://github.com/vuejs/vue) great work
- [Bulma](https://github.com/jgthms/bulma) A modern CSS framework based on Flexbox
- [vue-admin](https://github.com/vue-bulma/vue-admin) for laying the foundations
- [VuexFire](https://github.com/posva/vuexfire) for work integrating Vuex & Firebase
- [vee-validate](https://github.com/baianat/vee-validate) for making form validation in Vue so easy
- [Firebase](https://firebase.google.com/)