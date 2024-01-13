<script>
	export let cell;
</script>

<input
	type="text"
	bind:value={cell.value}
	class="inline-block input input-xs input-bordered"
	style:width="calc({String(cell.value).length * 1.25}ch + 1rem)"
/>

<style>
</style>
