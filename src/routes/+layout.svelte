<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { ClerkProvider } from 'svelte-clerk';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import '../index.css';
	import TriplitProvider from '$lib/components/triplit/TriplitProvider.svelte';

	const {
		children,
		data,
	}: {
		children: Snippet;
		data: LayoutData;
	} = $props();
</script>

<ClerkProvider {...data} publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
	<TriplitProvider token={data.token}>
		{@render children()}
	</TriplitProvider>
</ClerkProvider>
