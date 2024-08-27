<script lang="ts">
	import { OrganizationSwitcher, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
</script>

<header>
	<nav>
		<div class="logo">
			<a href="/">
				<img src="https://www.triplit.dev/_next/static/media/triplit-logo.a8f7600b.svg" alt="Triplit Logo" />
				<div>Triplit</div>
			</a>
		</div>
		<div class="links">
			<SignedIn>
				<UserButton />
				<div class="align">
					<OrganizationSwitcher />
				</div>
			</SignedIn>
			<SignedOut>
				<a href="/signin">Sign in</a>
				<a href="/signup">Sign up</a>
			</SignedOut>
		</div>
	</nav>
</header>

<style>
	header {
		width: 100%;
	}

	.logo a {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo img {
		height: 2rem;
	}

	nav,
	.links {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.links {
		gap: 2rem;
		padding-inline: 1rem;
	}

	/* hack to align organization switcher */
	.align {
		padding-block-start: 4px;
	}

	a {
		/* color: tbd; */
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
