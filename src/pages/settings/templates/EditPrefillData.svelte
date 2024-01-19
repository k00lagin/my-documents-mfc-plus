<script>
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../../../icon-store.js";
	import { prefillData } from "../../../stores";
	import { portal } from "svelte-portal";

	let open = false;
	let currentLevel = "federal";

	const titles = {
		personIn: "Приём физлиц в МФЦ",
		personOut: "Выдача физлицам из МФЦ",
		personOutPositive: "Положительный/отрицательный результат",

		orgIn: "Приём юрлиц в МФЦ",
		orgOut: "Выдача юрлицам из МФЦ",
		orgOutPositive: "Положительный/отрицательный результат",

		allIn: "Приём в МФЦ (все)",
		allOut: "Выдача из МФЦ (все)",
		foreignIn: "Приём в МФЦ экстерр.",
		foreignOut: "Выдача из МФЦ экстерр.",

		federal: "Федеральные",
		regional: "Региональные",
		municipal: "Муниципальные",
		otherServices: "Услуги иных организаций",
	};

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			open = false;
		}
	}
	function handleClose() {
		open = false;
	}
	function updateTime() {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;
		if ($prefillData[currentLevel].year < currentYear) $prefillData[currentLevel].year = currentYear;
		if ($prefillData[currentLevel].month < currentMonth) $prefillData[currentLevel].month = currentMonth;
	}
</script>

<button class="btn btn-xs" on:click={() => (open = true)}>
	<svg use:inlineSvg={iconStore["mdi_pencil"]} />
	Редактировать данные о приёме/выдаче
</button>

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="backdrop"
		on:click={handleBackdropClick}
		use:portal={"body"}
		hidden
	>
		<dialog class="shadow-md fill-services" {open}>
			<header>
				<h1>Данные о приёме/выдаче услуг</h1>
				<button class="btn btn-xs btn-square" on:click={handleClose}>
					<svg use:inlineSvg={iconStore["mdi_close"]} />
				</button>
			</header>
			<div role="tablist" class="tabs tabs-bordered">
				{#each Object.keys($prefillData) as level, index}
					<button
						role="tab"
						class="tab"
						data-level={level}
						on:click={() => (currentLevel = level)}
						class:tab-active={currentLevel === level}>{titles[level]}</button
					>
				{/each}
			</div>
			{#each Object.keys($prefillData) as level, index}
				{#if currentLevel === level}
					<div class="content">
						<table class="table table-xs table-pin-rows">
							<thead>
								<tr>
									<th>Услуга</th>
									<th colspan="2">Приём</th>
									<th colspan="4">Выдача</th>
									<th>Комментарий</th>
									<th />
								</tr>
							</thead>
							<tbody>
								{#each Object.keys($prefillData[level].services) as serviceName}
									<tr>
										<td>{serviceName}</td>
										{#each $prefillData[level].services[serviceName].personIn !== undefined ? ["personIn", "orgIn", "personOut", "personOutPositive", "orgOut", "orgOutPositive"] : ["allIn", "foreignIn", "allOut", "foreignOut"] as type}
											<td
												colspan={type === "allOut" || type === "foreignOut"
													? 2
													: 1}
											>
												<label
													for="{serviceName}-{type}"
													title={titles[type]}
												/>
												<input
													type="checkbox"
													class="checkbox checkbox-xs"
													id="{serviceName}-{type}"
													value={type}
													bind:checked={$prefillData[level].services[
														serviceName
													][type]}
													on:change={updateTime}
												/>
											</td>
										{/each}
										<td>
											<label for="{serviceName}-comment" title="{'Комментарий'}{!!$prefillData[level].services[serviceName]
												.comment ? `: ${$prefillData[level].services[serviceName]
													.comment}` : ''}" />
											<input
												type="text"
												class="input input-bordered input-xs"
												id="{serviceName}-comment"
												bind:value={$prefillData[level].services[serviceName]
													.comment}
												list="comments-list"
												on:change={updateTime}
											/>
										</td>
										<td>
											<button
												class="btn btn-xs btn-square"
												title="Удалить данные об услуге"
												on:click={() => {
													delete $prefillData[level].services[serviceName];
													$prefillData = $prefillData;
												}}
											>
												<svg use:inlineSvg={iconStore["mdi_trash"]} />
											</button>
										</td>
									</tr>
								{:else}
									<tr>
										<th colspan="9">Нет данных</th>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{/each}
		</dialog>
	</div>
	<datalist id="comments-list">
		<option value="Нет соглашения с органом" />
	</datalist>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		place-items: center;
		background-color: rgb(0 0 0 / 0.3);
	}
	dialog {
		overflow: clip;
		max-width: 95%;
		max-height: 95%;
		border: 0.5px solid lightgrey;
		padding: 1rem;
		display: flex;
		flex-flow: column nowrap;
	}
	table {
		margin-bottom: 1rem;
	}
	tbody tr:hover {
		background-color: oklch(0.86 0.05 219.67 / 0.1);
	}
	td:has(label) {
		text-align: center;
		position: relative;
		padding: 0.25rem 0.5rem;
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
	label:hover + input[type="checkbox"] {
		background-color: rgb(0 0 0 / 0.05);
		outline: 1px solid var(--fallback-a, oklch(var(--a) / 0.2));
	}
	input[type="text"]:focus {
		outline: 2px solid var(--fallback-s, oklch(var(--s) / 0.5));
		outline-offset: -1px;
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
		align-items: flex-end;
	}
</style>
