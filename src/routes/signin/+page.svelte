<script lang="ts">
	import { SignIn } from 'svelte-clerk/components';
</script>

<div>
	<SignIn forceRedirectUrl="/" />
</div>

<style>
	div {
		display: grid;
		place-items: center;
		height: 100vh;
	}
</style>
