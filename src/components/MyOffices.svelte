<script>
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../icon-store.js";
	import { myOffices, removeOffice, settings } from "../stores.js";
</script>

{#if $myOffices.length > 0}
	<table class="table table-xs">
		<tr>
			<th>Адрес</th>
			<th>Псевдоним</th>
			<th />
		</tr>
		{#each $myOffices as office}
			<tr>
				<td>
					{office.address}
				</td>
				<td>
					<input
						type="text"
						class="input input-bordered input-xs"
						bind:value={office.short_name}
					/>
				</td>
				<td class="pl-4">
					<button
						class="btn btn-xs btn-square"
						on:click={() => {
							removeOffice(office.id);
						}}
					>
						<svg use:inlineSvg={iconStore["mdi_close"]}></svg>
					</button>
				</td>
			</tr>
		{/each}
	</table>
{/if}
