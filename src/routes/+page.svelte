<script lang="ts">
	import { useQuery } from '@triplit/svelte';
	import { useTriplitContext } from '$lib/components/triplit/context';
	import GettingStarted from './getting-started.svelte';
	import ConnectionStatus from './connection-status.svelte';
	import Todo from './todo.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { SignedIn, useClerkContext } from 'svelte-clerk';

	const clerkCtx = useClerkContext();
	const userId = $derived(clerkCtx.auth.userId);
	const orgId = $derived(clerkCtx.auth.orgId);

	const triplit = useTriplitContext();

	let textForOnlineTodo = $state('');
	const onlineTodos = useQuery(triplit.onlineDb, triplit.onlineDb.query('todos').order('created_at', 'DESC').where(['organization_id', '=', clerkCtx.auth.orgId ?? null]));
	let onlineTodosArray = $derived(onlineTodos.results ? Array.from(onlineTodos.results) : []);

	let textForOfflineTodo = $state('');
	const offlineTodos = useQuery(triplit.offlineDb, triplit.offlineDb.query('todos').order('created_at', 'DESC').where(['organization_id', '=', null]));
	let offlineTodosArray = $derived(offlineTodos.results ? Array.from(offlineTodos.results) : []);

	$effect(() => {
		// update query when lastActiveOrganizationId changes
		onlineTodos.updateQuery(
			triplit.onlineDb.query('todos').where(['organization_id', '=', clerkCtx.auth.orgId ?? null]),
		);
	});
</script>

<div class="main-container">
	<GettingStarted />
	<div class="app-container">
		<Nav />
		<h1>Todos</h1>
		<ConnectionStatus />
		
		<SignedIn>
		<h2>Online Synced Todos</h2>
		<form
			onsubmit={async (e) => {
				e.preventDefault();
				await triplit.onlineDb.insert('todos', { text: textForOnlineTodo, created_by_clerk_id: userId!, organization_id: orgId! });
				textForOnlineTodo = '';
			}}
		>
			<input type="text" placeholder="What needs to be done?" class="todo-input" bind:value={textForOnlineTodo} />
			<button class="btn" type="submit" disabled={!textForOnlineTodo}> Add Todo </button>
		</form>
		{#if onlineTodos.fetching}
			<p>Loading...</p>
		{/if}
		{#if onlineTodos.results}
			<div class="todos-container">
				{#each onlineTodosArray as [_key, todo]}
					<Todo {todo} client={triplit.onlineDb}/>
				{/each}
			</div>
		{/if}
	</SignedIn>

		<h2>Offline-only Todos</h2>
		<form
			onsubmit={async (e) => {
				e.preventDefault();
				await triplit.offlineDb.insert('todos', { text: textForOfflineTodo, created_by_clerk_id: null, organization_id: null });
				textForOfflineTodo = '';
			}}
		>
			<input type="text" placeholder="What needs to be done?" class="todo-input" bind:value={textForOfflineTodo} />
			<button class="btn" type="submit" disabled={!textForOfflineTodo}> Add Todo </button>
		</form>
		{#if offlineTodos.fetching}
			<p>Loading...</p>
		{/if}
		{#if offlineTodos.results}
			<div class="todos-container">
				{#each offlineTodosArray as [_key, todo]}
					<Todo {todo} client={triplit.offlineDb} />
				{/each}
			</div>
		{/if}
	</div>
</div>
