// src/+layout.server.ts
import { buildClerkProps } from 'svelte-clerk/server';

// To enable Clerk SSR support, pass the `initialState` to the `ClerkProvider` component.
export const load = async ({ locals }) => {
	const token = await locals.auth?.getToken();
	return {
		...buildClerkProps(locals.auth),
		token,
	};
};
