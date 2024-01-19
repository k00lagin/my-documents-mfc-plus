<script>
	import { onMount, createEventDispatcher } from "svelte";
	import { prefillData } from "../../../stores";
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../../../icon-store";
	const dispatch = createEventDispatcher();

	export let newServicesData = null,
		open,
		newPrefillData = {},
		type;
	let didMount = false;

	onMount(() => {
		if (newServicesData !== null) {
			for (const service of newServicesData) {
				newPrefillData[service.serviceName] = {};
				newPrefillData[service.serviceName].options = [];
				newPrefillData = newPrefillData;
			}
		}
		didMount = true;
	});

	function save() {
		let newData = {};
		for (const serviceName of Object.keys(newPrefillData)) {
			if (
				newPrefillData[serviceName].options.length > 0 ||
				newPrefillData[serviceName].comment
			) {
				newData[serviceName] = {};
				for (const option of newPrefillData[serviceName].options) {
					newData[serviceName][option] = true;
				}
				if (newPrefillData[serviceName].comment) {
					newData[serviceName].comment = newPrefillData[serviceName].comment;
				}
			}
		}
		$prefillData[type].month = new Date().getMonth() + 1;
		$prefillData[type].year = new Date().getFullYear();
		$prefillData[type].services = {
			...$prefillData[type].services,
			...newData,
		};
	}
	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			dispatch("close");
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="backdrop" on:click={handleBackdropClick}>
	<dialog {open}>
		{#if didMount}
			<header>
				<h3>В шаблоне найдены новые услуги</h3>
				<button
					class="btn btn-xs btn-square"
					on:click={() => dispatch("close")}
				>
					<svg use:inlineSvg={iconStore["mdi_close"]} />
				</button>
			</header>
			<table class="table table-xs">
				<thead>
					<tr>
						<th rowspan="2">Услуга</th>
						<th colspan="2">Приём</th>
						<th colspan="4">Выдача</th>
						<th>Комментарий</th>
					</tr>
					<tr>
						<th>Физлица</th>
						<th>Юрлица</th>
						<th colspan="2">Физлица</th>
						<th colspan="2">Юрлица</th>
					</tr>
				</thead>
				<tbody>
					{#each newServicesData as service}
						{#if newPrefillData[service.serviceName] !== undefined}
							<tr>
								<td>{service.serviceName}</td>
								<td>
									<label
										for="{service.serviceName}-personIn"
										title="Приём физлиц в МФЦ"
									/>
									<input
										type="checkbox"
										class="checkbox checkbox-xs"
										bind:group={newPrefillData[service.serviceName].options}
										id="{service.serviceName}-personIn"
										value="personIn"
									/>
								</td>
								<td>
									<label
										for="{service.serviceName}-orgIn"
										title="Приём юрлиц в МФЦ"
									/>
									<input
										type="checkbox"
										class="checkbox checkbox-xs"
										bind:group={newPrefillData[service.serviceName].options}
										id="{service.serviceName}-orgIn"
										value="orgIn"
									/>
								</td>
								<td>
									<label
										for="{service.serviceName}-personOut"
										title="Выдача физлицам в МФЦ"
									/>
									<input
										type="checkbox"
										class="checkbox checkbox-xs"
										bind:group={newPrefillData[service.serviceName].options}
										id="{service.serviceName}-personOut"
										value="personOut"
									/>
								</td>
								<td>
									<label
										for="{service.serviceName}-personOutPositive"
										title="Положительный/отрицательный результат"
									/>
									<input
										type="checkbox"
										class="checkbox checkbox-xs"
										bind:group={newPrefillData[service.serviceName].options}
										id="{service.serviceName}-personOutPositive"
										value="personOutPositive"
									/>
								</td>
								<td>
									<label
										for="{service.serviceName}-orgOut"
										title="Выдача юрлицам в МФЦ"
									/>
									<input
										type="checkbox"
										class="checkbox checkbox-xs"
										bind:group={newPrefillData[service.serviceName].options}
										id="{service.serviceName}-orgOut"
										value="orgOut"
									/>
								</td>
								<td>
									<label
										for="{service.serviceName}-orgOutPositive"
										title="Положительный/отрицательный результат"
									/>
									<input
										type="checkbox"
										class="checkbox checkbox-xs"
										bind:group={newPrefillData[service.serviceName].options}
										id="{service.serviceName}-orgOutPositive"
										value="orgOutPositive"
									/>
								</td>
								<td>
									<label
										for="{service.serviceName}-comment"
									/>
									<input
										class="input input-bordered input-xs"
										type="text"
										name=""
										id="{service.serviceName}-comment"
										list="comments-list"
										bind:value={newPrefillData[service.serviceName].comment}
									/>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
			<footer>
				<button class="ml-auto btn btn-xs" on:click={() => dispatch("close")}
					>Отмена</button
				>
				<button
					class="btn btn-xs"
					on:click={() => {
						save();
						dispatch("close");
					}}>Применить</button
				>
			</footer>
		{/if}
	</dialog>
</div>
<datalist id="comments-list">
	<option value="Нет соглашения с органом" />
</datalist>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		place-items: center;
		background-color: rgb(0 0 0 / 0.3);
	}
	dialog {
		overflow: auto;
		max-width: 95%;
		max-height: 95%;
		border: 0.5px solid lightgrey;
		padding: 1rem;
	}
	td:has(label) {
		text-align: center;
		position: relative;
	}
	label {
		position: absolute;
		inset: 0;
	}
	label:has(+ input[type="checkbox"]) {
		cursor: pointer;
	}
	label:has(+ input[type="text"]) {
		cursor: text;
	}
	input[type="text"]:focus {
		outline: 2px solid var(--fallback-s, oklch(var(--s) / 0.5));
		outline-offset: -1px;
	}
	label:hover + input[type="checkbox"] {
		background-color: rgb(0 0 0 / 0.05);
		outline: 1px solid var(--fallback-a, oklch(var(--a) / 0.2));
	}
	table {
		margin-bottom: 1rem;
	}
	header {
		font-weight: 700;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	footer {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.5rem;
	}
</style>
