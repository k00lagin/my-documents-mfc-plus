<script>
	import { onMount } from "svelte";
	import {
		mfcList,
		urmList,
		offices,
		myOffices,
		addOffice,
	} from "../stores.js";
	import { iconStore } from "../icon-store.js";

	let query = "";
	// $: filteredOffices = $offices.filter(office => office.address.toLowerCase().includes(query.toLowerCase()) && !$myOffices.some(myOffice => office.id === myOffice.id));
	$: filteredMfc =
		$mfcList.filter(
			(office) =>
				office.address.toLowerCase().includes(query.toLowerCase()) &&
				!$myOffices.some((myOffice) => office.id === myOffice.id),
		) || [];
	$: filteredUrm =
		$urmList.filter(
			(office) =>
				office.address.toLowerCase().includes(query.toLowerCase()) &&
				!$myOffices.some((myOffice) => office.id === myOffice.id),
		) || [];

	onMount(() => {});
</script>

<input
	type="text"
	class="w-full max-w-xs mt-1 input-sm input input-bordered"
	placeholder="Поиск..."
	bind:value={query}
/>
{#if filteredMfc.length > 0}
	<h3>МФЦ</h3>
	{#each filteredMfc as office}
		<p class="">
			<button
				class="btn btn-xs btn-square"
				on:click={() => {
					addOffice(office);
				}}><img src={iconStore["mdi_plus"]} alt="" /></button
			>
			{office.address}
		</p>
	{/each}
{/if}
{#if filteredUrm.length > 0}
	<h3>ТОСПы</h3>
	{#each filteredUrm as office}
		<p class="">
			<button
				class="btn btn-xs btn-square"
				on:click={() => {
					addOffice(office);
				}}><img src={iconStore["mdi_plus"]} alt="" /></button
			>
			{office.address}
		</p>
	{/each}
{/if}
<!-- {#each filteredOffices as office}
<p class="" title={office.type}>
	<button class="btn btn-xs btn-square" on:click={() => {
		addOffice(office);
	}}>+</button>
	{office.address}
</p>
{/each} -->
