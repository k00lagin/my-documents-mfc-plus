<script>
	import { user, authorized } from "../stores.js";
	import { logout } from "../api.js"
	export let router;
</script>

<header>
	<ul class="toolbar">
		<a href="/mfc-plus" class="btn btn-sm btn-ghost" use:router.link>МРС МФЦ+</a>
		{#if $authorized}
			<a href="/mfc-plus/templates" class="btn btn-sm btn-ghost" use:router.link>Шаблоны</a>
		{/if}
	</ul>
	{#if $authorized}
		{@const [lastName, firstName, middleName] = $user.fio.split(" ")}
		<a href="/mfc-plus/settings" class="ml-1 btn btn-ghost btn-sm btn-square" use:router.link>
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
				<path fill="currentColor" d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z" />
			</svg>
		</a>
		<div class="dropdown dropdown-bottom dropdown-end">
			<div tabindex="0" role="button" class="btn btn-sm btn-ghost">{lastName} {firstName[0]}. {middleName[0]}.</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
				<li><button class="btn btn-sm" on:click={logout}>Выйти</button></li>
			</ul>
		</div>
	{:else}
		<button class="btn btn-sm btn-ghost" on:click={()=> {
			window.open('https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc/esia/Login', '_blank', 'popup');
		}}>Войти через ЕСИА</button>
	{/if}
</header>

<style>
	header {
		height: 48px;
		width: 100%;
		background-color: oklch(var(--s) / 50%);
		box-shadow: 0 0.5px;
		display: flex;
		align-items: center;
		padding: 0 8px;
	}
	.toolbar {
		margin-right: auto;
	}
</style>
