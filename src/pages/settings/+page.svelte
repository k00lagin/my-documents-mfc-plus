<script>
	export let router;
</script>

<svelte:head>
	<title>Настройки</title>
</svelte:head>

<div class="settings">
	<div role="tablist" class="tabs tabs-boxed">
		<a
			role="tab"
			href="/mfc-plus/settings/offices"
			class="tab"
			use:router.link={{ activeClass: "tab-active" }}>Офисы</a
		>
		<a
			role="tab"
			href="/mfc-plus/settings/templates"
			class="tab"
			use:router.link={{ activeClass: "tab-active" }}>Шаблоны</a
		>
		<div class="spacer"/>
		<span>v{GM_info.script.version}</span>
	</div>

	<div class="content">
		<svelte:component this={router.content} {router} />
	</div>
</div>

<style>
	.settings {
		display: flex;
		flex-flow: row nowrap;
		align-items: stretch;
    height: 100%;
	}
	.content {
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		flex-grow: 1;
	}
	.tabs {
		flex-flow: column nowrap;
		display: flex;
		width: 10rem;
		background-color: transparent;
		align-items: stretch;
		flex-shrink: 0;
		border-right: 0.5px solid;
	}
</style>
