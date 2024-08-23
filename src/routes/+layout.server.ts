// src/+layout.server.ts
import { buildClerkProps } from 'svelte-clerk/server';

// To enable Clerk SSR support, pass the `initialState` to the `ClerkProvider` component.
export const load = ({ locals }) => {
	return {
		...buildClerkProps(locals.auth)
	};
};