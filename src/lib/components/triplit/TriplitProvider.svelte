<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setTriplitContext } from './context';
	import { useClerkContext } from 'svelte-clerk';
	import { offlineDb, onlineDb } from '$lib/client';

	const {
		token,
		children,
	}: {
		token: string | null;
		children: Snippet;
	} = $props();

	const clerk = useClerkContext();

	// use token from SSR if available instead of waiting for it to load client side
	let currentTriplitToken: string | undefined | null = token;
	if (currentTriplitToken) {
		onlineDb.updateToken(currentTriplitToken);
	}

	async function updateToken(session: typeof clerk.session) {
		const currentSessionToken = session?.lastActiveToken?.getRawString();
		if (!session) {
			currentTriplitToken = null;
			onlineDb.disconnect();
		} else if (currentTriplitToken !== currentSessionToken) {
			const lastActiveTokenExp = session?.lastActiveToken?.jwt?.claims.exp;

			if (!lastActiveTokenExp || lastActiveTokenExp * 1000 < new Date().getTime()) {
				console.log('Token expired, getting new token');
				currentTriplitToken = await session?.getToken();
				// or use a custom Clerk JWT token template here
				// currentTriplitToken = await session?.getToken({ template: 'triplit' });
			} else {
				currentTriplitToken = currentSessionToken;
			}

			if (currentTriplitToken) {
				// console.log('updating token to', currentTriplitToken);
				onlineDb.updateToken(currentTriplitToken);
			} else {
				onlineDb.disconnect();
			}
		} else {
			console.log('Token is the same');
		}
	}

	// when session changes, update Triplit token
	$effect(() => {
		updateToken(clerk.session);
	});

	setTriplitContext({
		get onlineDb() {
			return onlineDb;
		},
		get offlineDb() {
			return offlineDb;
		},
	});
</script>

{@render children()}
