<script lang="ts">
	import { useQuery } from '@triplit/svelte';
	import GettingStarted from './getting-started.svelte';
	import ConnectionStatus from './connection-status.svelte';
	import Todo from './todo.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { useClerkContext } from 'svelte-clerk';
	import { triplit } from '$lib/client';

	const clerkCtx = useClerkContext();
	const userId = $derived(clerkCtx.auth.userId ?? 'anon');
	const orgId = $derived(clerkCtx.auth.orgId ?? null);

	let text = $state('');
	const todos = useQuery(
		triplit,
		triplit
			.query('todos')
			.order('created_at', 'DESC')
			.where(['organization_id', '=', clerkCtx.auth.orgId ?? null]),
	);
	let todosArray = $derived(todos.results ? Array.from(todos.results) : []);

	$effect(() => {
		// update query when lastActiveOrganizationId changes
		todos.updateQuery(triplit.query('todos').where(['organization_id', '=', clerkCtx.auth.orgId ?? null]));
	});
</script>

<div class="main-container">
	<GettingStarted />
	<div class="app-container">
		<Nav />
		<h1>Todos</h1>
		<ConnectionStatus />

		<h2>Online Synced Todos</h2>
		<form
			onsubmit={async (e) => {
				e.preventDefault();
				await triplit.insert('todos', {
					text: text,
					created_by_clerk_id: userId,
					organization_id: orgId,
				});
				text = '';
			}}
		>
			<input type="text" placeholder="What needs to be done?" class="todo-input" bind:value={text} />
			<button class="btn" type="submit" disabled={!text}> Add Todo </button>
		</form>
		{#if todos.fetching}
			<p>Loading...</p>
		{/if}
		{#if todos.results}
			<div class="todos-container">
				{#each todosArray as [_key, todo]}
					<Todo {todo} />
				{/each}
			</div>
		{/if}
	</div>
</div>
