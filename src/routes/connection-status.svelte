<script lang="ts">
	import { useConnectionStatus } from '@triplit/svelte';
	import { onlineDb } from '$lib/client';

	const connection = useConnectionStatus(onlineDb);
</script>

<div class="connection-status">
	<div class={`indicator ${connection.status.toLowerCase()}`}></div>
	{connection.status === 'CLOSED' ? 'Offline' : connection.status === 'CONNECTING' ? 'Connecting' : 'Online'}
</div>
