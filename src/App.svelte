<script>
	import { router } from './routes'
	import { onMount } from "svelte";
	import { checkAuth } from "./api"
	import Header from './components/Header.svelte';
	import { authorized, notifications } from "./stores.js";
	import Unauthorized from './pages/Unauthorized.svelte';
	import { iconStoreInit, iconStore } from "./icon-store";

	onMount(() => {
		// const html = document.querySelector("html");
		// html.setAttribute("data-theme", "business"); // corporate
		iconStoreInit();

		let link = document.createElement("link");
		link.rel = "icon";
		link.type = "image/png";
		link.href = iconStore.favicon;
		document.head.appendChild(link);

		checkAuth();
		setInterval(() => {
			checkAuth();
		}, 60 * 1000);
	});
</script>

<Header {router}></Header>
<div class="main">
	{#if $authorized}
		<svelte:component this={router.content} {router} />
	{:else}
		<Unauthorized />
	{/if}
</div>

{#if $notifications.length > 0}
<div class="toast toast-end">
	{#each $notifications as notification}
		<div class="alert"
			class:alert-error={notification.type === 'error'}
			class:alert-success={notification.type === 'success'}
			class:alert-info={notification.type === 'info'}
			class:alert-warning={notification.type === 'warning'}
		>
			<div>
				{#if Array.isArray(notification.text)}
				<ol>
					{#each notification.text as line}
						<li>{line}</li>
					{/each}
				</ol>
				{:else}
					<span>{notification.text}</span>
				{/if}
			</div>
		</div>
	{/each}
</div>
{/if}

<style>
	:global(body) {
		display: flex;
		flex-flow: column nowrap;
	}
	.main {
		flex-grow: 1;
		height: calc(100% - 48px);
		padding: 8px 16px;
	}
	.alert-error ol {
		list-style: auto;
    padding-left: 16px;
	}
</style>
