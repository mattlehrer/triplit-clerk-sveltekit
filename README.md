# Template for Triplit using Clerk Auth in a SvelteKit project

This template uses the [Triplit Svelte template](https://github.com/aspen-cloud/triplit/tree/0f14473466ed9b4c6673713f1af4a2492a856377/templates/svelte) as a base and adds Clerk Auth to it with separate databases for offline and online work. 

Before a user signs up or signs in, this is one way to allow a user to begin using the app offline. It is possible to create an anonymous user if they were online at some point, but this template does not do that. Here, data from the offline app database could be manually or automatically inserted into the online database after a user signs up, using their new user ID.