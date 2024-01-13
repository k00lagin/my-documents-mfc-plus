<script>
	import { onMount } from "svelte";
	import { user, offices, myOffices, settings } from "../../stores.js";
	import { fetchOffices } from "../../api.js";
	import SelectOffices from "../../components/SelectOffices.svelte";
	import MyOffices from "../../components/MyOffices.svelte";
	import { portal } from "svelte-portal";

	onMount(() => {
		fetchOffices();
	});
</script>

<svelte:head>
	<title>Настройки</title>
</svelte:head>

<div
	class="border collapse collapse-arrow border-base-300 bg-base-100 rounded-box"
>
	<input type="checkbox" class="peer" />
	<div class="text-xl font-medium collapse-title">Добавить отделы</div>
	<div class="collapse-content">
		{#if $offices}
			<SelectOffices></SelectOffices>
		{/if}
	</div>
</div>

<div
	class="border collapse collapse-arrow border-base-300 bg-base-100 rounded-box"
>
	<input type="checkbox" class="peer" />
	<div class="text-xl font-medium collapse-title">Мои отделы</div>
	<div class="collapse-content">
		<MyOffices></MyOffices>
	</div>
</div>

<div
	class="border collapse collapse-arrow border-base-300 bg-base-100 rounded-box"
>
	<input type="checkbox" class="peer" />
	<div class="text-xl font-medium collapse-title">Заполнение отчётов</div>
	<div class="collapse-content">
		<div class="form-control">
			<label class="cursor-pointer label">
				<span class="label-text">Заполнять отчёты по окнам без скачивания</span>
				<input
					type="checkbox"
					class="toggle"
					bind:checked={$settings["fillWindows"]}
				/>
			</label>
			<label class="cursor-pointer label">
				<span class="label-text"
					>Предзаполнять отчёты по услугам на основе прежних данных</span
				>
				<input
					type="checkbox"
					class="toggle"
					bind:checked={$settings["prefillTemplates"]}
					on:change={() => {
						if (!$settings["prefillTemplates"]) {
							$settings["fillTemplates"] = false;
						}
					}}
				/>
			</label>
			{#if $settings["prefillTemplates"]}
				<label class="cursor-pointer label">
					<span class="label-text"
						>Заполнять отчёты по услугам без скачивания</span
					>
					<input
						type="checkbox"
						class="toggle"
						bind:checked={$settings["fillTemplates"]}
					/>
				</label>
			{/if}
		</div>
	</div>
</div>

<!-- <div class="toast" use:portal={"body"} hidden>Entity successfully updated!</div> -->
