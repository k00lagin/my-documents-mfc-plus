<script>
	import { keyboard } from "../../../stores.js";

	export let cell;

	function sanitize() {
		cell.value = cell.value.replace(/[^\d]/g, "") || 0;
		if (Number(cell.value) < 0) value = 0;
	}
	function increment() {
		let step = 1;
		if ($keyboard.isShiftDown) step = 100;
		if ($keyboard.isCtrlDown) step = 10;
		cell.value = new Decimal(cell.value).plus(step).toNumber();
	}
	function decrement() {
		let step = 1;
		if ($keyboard.isShiftDown) step = 100;
		if ($keyboard.isCtrlDown) step = 10;
		cell.value = new Decimal(cell.value).minus(step).toNumber();
		if (cell.value < 0) cell.value = 0;
	}
	function handleKeydown(e) {
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			if (e.key === "ArrowUp") increment();
			if (e.key === "ArrowDown") decrement();
		}
	}
</script>

<input
	type="text"
	bind:value={cell.value}
	on:keydown={handleKeydown}
	on:input={sanitize}
	class="inline-block input input-xs input-bordered"
	style:width="calc({String(cell.value).length * 1.25}ch + 1rem)"
/>

<style>
	input:focus {
		outline: 2px solid var(--fallback-s, oklch(var(--s) / 0.5));
		outline-offset: -1px;
	}
</style>
