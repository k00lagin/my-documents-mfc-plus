<script>
	import { inlineSvg } from '@svelte-put/inline-svg';
	import { iconStore } from "../../../icon-store";

	export let id, value;
	function sanitize(e) {
		let value = e.target.value.replace(/[,]/g, ".") || 0;
		value = e.target.value.replace(/[^\d\.]/g, "") || 0;
		value = value.replaceAll(".", (_, offset, s) => {
			return offset === s.indexOf(".") ? "." : "";
		});
		if (Number(value) < 0) value = 0;
		e.target.value = value;
	}
	function increment() {
			value = Math.trunc(value) + 1;
	}
	function decrement() {
		value = Math.ceil(value) - 1;
		if (value < 0) value = 0;
	}
</script>

<div class="join">
	<button
		class="btn btn-xs btn-square join-item"
		on:click={decrement}
		disabled={value <= 0}
	>
		<svg use:inlineSvg={iconStore["mdi_chevron-down"]} />
	</button>
	<input
		{id}
		class="input input-xs input-bordered join-item"
		type="text"
		on:input={sanitize}
		bind:value
	/>
	<button class="btn btn-xs btn-square join-item" on:click={increment}>
		<svg use:inlineSvg={iconStore["mdi_chevron-up"]} />
	</button>
</div>

<style>
	.join {
		position: relative;
		z-index: 1;
		margin: 0.25rem 0.5rem;
	}
	.join:focus-within {
		outline: 2px solid oklch(var(--s) / 0.5);
		outline-offset: -1px;
	}
	.join,
	input,
	button {
		border-radius: 0;
	}
	input:focus {
		outline: none;
	}
</style>
