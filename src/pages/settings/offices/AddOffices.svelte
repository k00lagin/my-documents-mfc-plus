<script>
	import { onMount } from "svelte";
	import { mfcList, urmList, myOffices, addOffice } from "../../../stores.js";
	import { fetchOffices } from "../../../api.js";

	let query = "";
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

	onMount(() => {
		fetchOffices();
	});
</script>

<div class="wrap">
	<table class="table table-xs">
		<tbody>
			<tr>
				<td>
					<input
						data-mfc-list={JSON.stringify($mfcList)}
						data-urm-list={JSON.stringify($urmList)}
						data-my-offices={JSON.stringify($myOffices)}
						type="text"
						class="w-full max-w-xs mt-1 input-xs input input-bordered"
						placeholder="Поиск..."
						bind:value={query}
					/>
				</td>
			</tr>
			{#if filteredMfc.length > 0}
				<tr><th>МФЦ</th></tr>
				{#each filteredMfc as office}
					<tr>
						<td>
							<button
								class="btn btn-xs btn-link"
								on:click={() => {
									addOffice(office);
								}}
								>{office.address}
							</button>
						</td>
					</tr>
				{/each}
			{/if}
			{#if filteredUrm.length > 0}
				<tr><th>ТОСПы</th></tr>
				{#each filteredUrm as office}
					<tr>
						<td>
							<button
								class="btn btn-xs btn-link"
								on:click={() => {
									addOffice(office);
								}}
								>{office.address}
							</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	.wrap {
		max-height: 19rem;
		overflow-y: auto;
		width: max-content;
	}
	table {
		width: max-content;
		border: 1px solid var(--fallback-b2, oklch(var(--b2)));
		border-top-width: 0;
	}
</style>
