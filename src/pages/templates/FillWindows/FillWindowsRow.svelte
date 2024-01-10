<script>
	import { onMount } from "svelte";
	import CustomInput from "./CustomInput.svelte";
	export let label, value;
	let id;
	onMount(() => {
		id = crypto.randomUUID();
	});
</script>

<tr>
	<td>
		<label class="title-label" for={id}>{label}</label>
	</td>
	<td class="relative">
		<label class="input-label" for={id} />
		<CustomInput {id} bind:value />
	</td>
</tr>

<style>
	tr:hover {
		background-color: oklch(0.86 0.05 219.67 / 0.1);
	}
	.title-label {
		width: 100%;
		display: inline-block;
		cursor: default;
		padding: 0.25rem 0.5rem;
	}
	.input-label {
    position: absolute;
		inset: 0;
	}
</style>
