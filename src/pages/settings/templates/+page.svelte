<script>
	import EditPrefillData from "./EditPrefillData.svelte";
	import EditServiceBindings from "./EditServiceBindings.svelte";
	import { settings } from "../../../stores.js";
</script>

<svelte:head>
	<title>Настройки: Шаблоны</title>
</svelte:head>

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
		<EditPrefillData />
	{/if}
	{#if $settings["prefillTemplates"]}
		<label class="cursor-pointer label">
			<input
				type="checkbox"
				class="checkbox checkbox-sm"
				bind:checked={$settings["fillTemplates"]}
			/>
			<span class="label-text">Заполнять отчёты по услугам без скачивания</span>
		</label>
		{#if $settings["fillTemplates"]}
			<EditServiceBindings />
		{/if}
	{/if}
</div>

<style>
	.form-control {
		align-items: flex-start;
	}
	.label {
		justify-content: flex-start;
		gap: 0.5rem;
	}
</style>
