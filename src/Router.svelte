<script>
	import { onMount } from 'svelte';
	export let router = null;

	function navigate() {
		const path = window.location.pathname.slice(1).split('/');
		if (path.length === 1 && path[0] === '') path[0] = '/';
		router.path = path;
	}

	onMount(() => {
		if (router?.path === undefined) {
			navigate();
			// window.addEventListener('urlchange', navigate);
			window.addEventListener('popstate', navigate);
		}
	});
</script>

{#if !!router.path || router.placeholder}
	{@const name = router.path[0] || router.placeholder}
	{#if router.node[name]?.nested}
		<svelte:component
			this={router.node[name].component}
			router={{
				content: router.content,
				node: router.node[name].nested,
				placeholder: router.node[name].placeholder,
				path: router.path.slice(1),
				api: router.api,
				link: router.link,
			}}
		/>
	{:else}
		<svelte:component this={router.node[name]?.component} />
	{/if}
{/if}
