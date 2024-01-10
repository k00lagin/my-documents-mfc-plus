<script>
	import { onMount, createEventDispatcher } from "svelte";
	import { iconStore } from "../../../icon-store";
	const dispatch = createEventDispatcher();


	export let open = false, workbook;

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			dispatch("close");
		}
	}
	function download() {;}
	function upload() {;}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="backdrop" on:click={handleBackdropClick}>
	<dialog class="shadow-md fill-services" {open}>
		<header>
			<h3>{'title'}</h3>
			<button
				class="btn btn-xs btn-square"
				on:click={() => dispatch("close")}
			>
				<img src={iconStore["mdi_close"]} alt="Close" />
			</button>
		</header>

	<footer>
		<button class="ml-auto btn btn-xs" on:click={() => dispatch("close")}
			>Отмена</button
		>
		<button class="btn btn-xs download" on:click={download}>Скачать</button>
		<button class="btn btn-xs upload" on:click={upload}>Отправить</button>
	</footer>
	</dialog>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		place-items: center;
		background-color: rgb(0 0 0 / 0.3);
	}
	dialog {
		overflow: auto;
		max-width: 95%;
		max-height: 95%;
		border: 0.5px solid lightgrey;
		padding: 1rem;
	}
	table {
		margin-bottom: 1rem;
	}
	header {
		font-weight: 700;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	footer {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.5rem;
		align-items: flex-end;
	}
</style>
