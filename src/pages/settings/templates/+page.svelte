<script>
	import { settings } from "../../../stores.js";
</script>

<div class="form-control">
	<label class="cursor-pointer label">
		<input
			type="checkbox"
			class="checkbox checkbox-sm"
			bind:checked={$settings["fillWindows"]}
		/>
		<span class="label-text">Заполнять отчёты по окнам без скачивания</span>
	</label>
	<label class="cursor-pointer label">
		<input
			type="checkbox"
			class="checkbox checkbox-sm"
			bind:checked={$settings["prefillTemplates"]}
			on:change={() => {
				if (!$settings["prefillTemplates"]) {
					$settings["fillTemplates"] = false;
				}
			}}
		/>
		<span class="label-text"
			>Предзаполнять отчёты по услугам на основе прежних данных</span
		>
	</label>
	{#if $settings["prefillTemplates"]}
		<label class="cursor-pointer label">
			<input
				type="checkbox"
				class="checkbox checkbox-sm"
				bind:checked={$settings["fillTemplates"]}
			/>
			<span class="label-text">Заполнять отчёты по услугам без скачивания</span>
		</label>
	{/if}
</div>

<style>
	.label {
		justify-content: flex-start;
		gap: 0.5rem;
	}
</style>
