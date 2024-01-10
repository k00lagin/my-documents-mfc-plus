<script>
	import { onMount } from 'svelte';
	export let router;
	onMount(() => {
	})
</script>

<svelte:head>
	<title>МРС МФЦ+</title>
</svelte:head>

<svelte:component this={router.content} {router} />
