<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useClerkContext } from 'svelte-clerk';
	import { triplit } from '$lib/client';
	import { browser } from '$app/environment';

	const {
		token,
		children,
	}: {
		token: string | null;
		children: Snippet;
	} = $props();

	const clerk = useClerkContext();

	// use token from SSR if available instead of waiting for it to load client side
	// but only do this in the browser
	let currentTriplitToken: string | undefined | null = token;
	if (currentTriplitToken && browser) {
		triplit.updateToken(currentTriplitToken);
	}

	async function updateToken(session: typeof clerk.session) {
		const currentSessionToken = session?.lastActiveToken?.getRawString();
		if (!session) {
			currentTriplitToken = null;
			triplit.disconnect();
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
				if (!triplit.connectionStatus || triplit.connectionStatus === 'CLOSED') {
					// if there's no token, ensure all projects created by anon user are associated with the new token's user
					const allAnonTodosQuery = triplit
						.query('todos')
						.where([
							['created_by_clerk_id', '=', 'anon'],
							['organization_id', '=', null],
						])
						.syncStatus('pending')
						.build();
					const anonTodos = await triplit.fetch(allAnonTodosQuery, { policy: 'local-only' });
					if (anonTodos.size) {
						// updates won't work because the previous inserts will be rejected by remote server

						// const updatePromises = Array.from(anonProjects).map((project) => {
						// 	return triplit.update('projects', project[0], async (p) => {
						// 		p.created_by_clerk_id = session.user.id;
						// 	});
						// });
						// await Promise.all(updatePromises);

						// insert acts as an upsert locally if the id already exists but an insert on the remote for permissions
						const insertPromises = Array.from(anonTodos).map((todo) => {
							console.log({ projectId: todo[0], project: todo[1] });

							return triplit.insert('todos', {
								...todo[1],
								created_by_clerk_id: session.user.id,
							});
						});
						const p = await Promise.all(insertPromises);
						console.log({ p });
					}
				}

				triplit.updateToken(currentTriplitToken);
			} else {
				triplit.disconnect();
			}
		} else {
			console.log('Token is the same');
		}
	}

	// when session changes, update Triplit token
	$effect(() => {
		updateToken(clerk.session);
	});
</script>

{@render children()}
