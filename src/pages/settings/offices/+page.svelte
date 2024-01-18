<script>
	import AddOffices from "./AddOffices.svelte";
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../../../icon-store.js";
	import { myOffices } from "../../../stores.js";

	let selectedOfficeIndex = -1;
	let isAddingOffices = false;

	function handleSelect(officeIdx) {
		selectedOfficeIndex = officeIdx;
	}

	function handleMoveUp() {
		if (selectedOfficeIndex > 0) {
			const office = $myOffices[selectedOfficeIndex];
			$myOffices = [
				...$myOffices.slice(0, selectedOfficeIndex - 1),
				office,
				...$myOffices.slice(selectedOfficeIndex - 1, selectedOfficeIndex),
				...$myOffices.slice(selectedOfficeIndex + 1),
			];
			selectedOfficeIndex--;
		}
	}
	function handleMoveDown() {
		if (selectedOfficeIndex < $myOffices.length - 1) {
			const office = $myOffices[selectedOfficeIndex];
			$myOffices = [
				...$myOffices.slice(0, selectedOfficeIndex),
				...$myOffices.slice(selectedOfficeIndex + 1, selectedOfficeIndex + 2),
				office,
				...$myOffices.slice(selectedOfficeIndex + 2),
			];
			selectedOfficeIndex++;
		}
	}
	function handleRemove() {
		$myOffices = [
			...$myOffices.slice(0, selectedOfficeIndex),
			...$myOffices.slice(selectedOfficeIndex + 1),
		];
		selectedOfficeIndex = -1;
	}
</script>

<h3>Мои офисы</h3>
{#if $myOffices.length > 0}
	<table class="table table-xs">
		<thead>
			<tr>
				<th>Адрес</th>
				<th>Псевдоним</th>
			</tr>
		</thead>
		<tbody>
			{#each $myOffices as office, officeIdx}
				<tr
					class="hover"
					tabindex="0"
					class:selected={selectedOfficeIndex === officeIdx}
					on:click={() => handleSelect(officeIdx)}
				>
					<td class="office-address">
						{office.address}
					</td>
					<td>
						<input
							type="text"
							class="input input-bordered input-xs"
							bind:value={office.short_name}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="2" class="toolbar-cell">
					<div class="toolbar">
						<button
							class="btn btn-xs btn-outline"
							on:click={() => (isAddingOffices = !isAddingOffices)}
						>
							{#if !isAddingOffices}
								<svg use:inlineSvg={iconStore["mdi_plus"]}></svg>
							{:else}
								<svg use:inlineSvg={iconStore["mdi_chevron-up"]}></svg>
							{/if}
							<span>Добавить</span>
						</button>
						<button
							class="btn btn-xs btn-square btn-outline second"
							disabled={selectedOfficeIndex < 0}
							on:click={handleRemove}
						>
							<svg use:inlineSvg={iconStore["mdi_trash"]}></svg>
						</button>
						<div class="spacer" />
						<button
							class="btn btn-xs btn-square btn-outline"
							disabled={selectedOfficeIndex <= 0}
							on:click={() => handleMoveUp(selectedOfficeIndex)}
						>
							<svg use:inlineSvg={iconStore["mdi_chevron-up"]}></svg>
						</button>
						<button
							class="btn btn-xs btn-square btn-outline second"
							disabled={selectedOfficeIndex >= $myOffices.length - 1 ||
								selectedOfficeIndex < 0}
							on:click={() => handleMoveDown(selectedOfficeIndex)}
						>
							<svg use:inlineSvg={iconStore["mdi_chevron-down"]}></svg>
						</button>
					</div>
				</td>
			</tr>
		</tfoot>
	</table>
	{#if isAddingOffices}
		<AddOffices />
	{/if}
{/if}

<style>
	h3 {
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
	}
	table {
		border: 1px solid var(--fallback-b2, oklch(var(--b2)));
		width: max-content;
	}
	tr.selected {
		background-color: var(--fallback-s, oklch(var(--s) / 0.3));
	}
	tr:focus.selected {
		background-color: var(--fallback-s, oklch(var(--s) / 0.6));
	}
	.office-address {
		cursor: default;
	}
	.toolbar-cell {
		border-top: 1px solid var(--fallback-b2, oklch(var(--b2)));
		padding: 0;
	}
	.toolbar {
		display: flex;
		flex-flow: row nowrap;
	}
	.spacer {
		flex-grow: 1;
	}
	.toolbar button {
		border-radius: 0;
		border-width: 0;
		border-color: var(--fallback-b2, oklch(var(--b2)));
	}
	.toolbar button:has(~ .spacer) {
		border-right-width: 1px;
	}
	.toolbar .spacer ~ button {
		border-left-width: 1px;
	}
</style>
