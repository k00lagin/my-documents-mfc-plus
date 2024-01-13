<script>
	import { downloadBlob } from "../../../api.js";
	import { iconStore } from "../../../icon-store";
	import { serviceBindings } from "../../../stores";
	import { portal } from "svelte-portal";
	import BindService from "./BindService.svelte";
	import DisplayNumbers from "./DisplayNumbers.svelte";

	let open = false,
		type,
		filename,
		workbook,
		worksheet,
		fillData = [],
		templateServices = [],
		autoBindedServices = [],
		title;

	const titles = {
		federal: "Услуги федеральных органов власти",
		municipal: "Услуги муниципальных органов власти",
		regional: "Услуги региональных органов власти",
		otherServices: "Услуги иных организаций",
	};

	export const init = (options) => {
		workbook = options.workbook;
		worksheet = workbook.getWorksheet(1);
		type = options.type;
		if (type === "otherServices") {
			let otherData = {};
			for (const serviceName of Object.keys(options.fillData)) {
				if (
					$serviceBindings["federal"][serviceName]?.movedTo === "otherServices"
				) {
					otherData[serviceName] = options.fillData[serviceName];
				}
			}
			fillData = otherData;
		} else {
			fillData = options.fillData;
		}
		filename = options.filename;
		title = `${
			titles[workbook.getWorksheet("hidden").getCell("C69").value]
		} | ${worksheet.getCell("F3").value}`;

		for (const [serviceIndex, _] of [
			...Array(worksheet.rowCount - 8),
		].entries()) {
			let serviceName = worksheet.getCell(`E${serviceIndex + 8}`).value;
			templateServices.push(serviceName);

			if (!$serviceBindings?.[type][serviceName] && fillData[serviceName]) {
				autoBindedServices.push(serviceName);
				$serviceBindings[type][serviceName] = {
					match: "exact",
				};
			}
		}

		open = true;
	};

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			open = false;
		}
	}
	function handleClose() {
		open = false;
	}
	async function download() {
		const buffer = await workbook.xlsx.writeBuffer();
		downloadBlob(new Blob([buffer]), filename);
	}
	function upload() {}
</script>

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{@const strayServices = Object.keys(fillData).filter(
		(service) =>
			service !== "municipal" &&
			!$serviceBindings?.[type][service] &&
			!autoBindedServices.includes(service),
	)}
	{@const matchedServices = Object.keys(fillData).filter(
		(service) => $serviceBindings?.[type]?.[service]?.match !== undefined,
	)}
	{@const movedServices = Object.keys(fillData).filter(
		(service) => $serviceBindings?.[type]?.[service]?.movedTo !== undefined,
	)}
	{@const blacklistServices = Object.keys(fillData).filter(
		(service) => $serviceBindings?.[type]?.[service]?.blacklist !== undefined,
	)}
	{@const municipalServices =
		(type === "municipal" && Object.keys(fillData.municipal)) || []}
	<div
		class="backdrop"
		on:click={handleBackdropClick}
		use:portal={"body"}
		hidden
	>
		<dialog class="shadow-md fill-services" {open}>
			<header>
				<h3>{title}</h3>
				<button class="btn btn-xs btn-square" on:click={handleClose}>
					<img src={iconStore["mdi_close"]} alt="Close" />
				</button>
			</header>
			{#if autoBindedServices.length > 0 || strayServices.length > 0}
				<h2>Некоторые услуги из выгрузки не привязаны к услугам в шаблоне</h2>
				<details class="collapse collapse-arrow">
					<summary class="collapse-title"
						>Автоматически привязанные услуги ({autoBindedServices.length}):</summary
					>
					<div class="collapse-content">
						<ol class="auto">
							{#each autoBindedServices as serviceName}
								<li class="auto">{serviceName}</li>
							{/each}
						</ol>
					</div>
				</details>
				<h3>Не привязанные услуги ({strayServices.length}):</h3>
				<ol>
					{#each strayServices as serviceName (serviceName)}
						<li>
							<span>{serviceName}</span>
							<BindService
								strayService={serviceName}
								{templateServices}
								{type}
							/>
						</li>
					{/each}
				</ol>
			{:else}
				<table class="table table-xs">
					<thead>
						<tr>
							<th rowspan="2"> Услуга </th>
							<th colspan="4"> Выгрузка </th>
							<th colspan="3"> Результат </th>
						</tr>
						<tr>
							<th />
							<th> Приём </th>
							<th colspan="2"> Выдача </th>

							<th />
							<th> Приём </th>
							<th> Выдача </th>
						</tr>
					</thead>
					<tbody>
						{#each matchedServices as serviceName}
							{@const templateRow =
								$serviceBindings?.[type]?.[serviceName]?.match !== undefined &&
								worksheet.getRow(
									templateServices.indexOf(
										$serviceBindings?.[type]?.[serviceName]?.match === "exact"
											? serviceName
											: $serviceBindings?.[type]?.[serviceName]?.match,
									) + 8,
								)}
							<tr
								class="service hover"
								class:blacklist={$serviceBindings?.[type]?.[serviceName]
									?.blacklist}
								class:moved={$serviceBindings?.[type]?.[serviceName]
									?.movedTo !== undefined}
								title={$serviceBindings?.[type]?.[serviceName]?.blacklist
									? "В статистике не учитывается"
									: $serviceBindings?.[type]?.[serviceName]?.movedTo ===
									    "otherServices"
									  ? "Учитывается в шаблоне услуг иных организаций"
									  : ""}
							>
								<td class:success={templateServices.includes(serviceName)}
									>{serviceName}</td
								>
								<DisplayNumbers
									row={templateRow}
									fillData={fillData[serviceName]}
								/>
							</tr>
						{:else}
							<tr>
								<th class="opacity-50" colspan="8">Не найдены принятые услуги, шаблон останется пустым</th>
							</tr>
						{/each}
						{#if municipalServices.length}
							{@const mergedFillData = Object.keys(fillData.municipal).reduce((acc, serviceName) => {
								Object.keys(fillData.municipal[serviceName]).forEach((type) => {
									if (acc[type] === undefined) acc[type] = {};
									Object.keys(fillData.municipal[serviceName][type]).forEach((key) => {
										if (acc[type][key] === undefined) acc[type][key] = 0;
										acc[type][key] += fillData.municipal[serviceName][type][key];
									})
								});
								return acc;
							}, {})}
							{@const templateRow = worksheet.getRow(
								templateServices.indexOf("Муниципальные услуги") + 8,
							)}
							<tr data-merged={JSON.stringify(mergedFillData['ФЛ'])}>
								<th colspan="8">Муниципальные услуги</th>
							</tr>
							{#each municipalServices as serviceName, index}
								<tr class="service hover">
									<td>{serviceName}</td>
									<DisplayNumbers
										row={templateRow}
										fillData={fillData.municipal[serviceName]}
										mergedFillData={(municipalServices.length && index === 0) && mergedFillData}
										hiddenResult={municipalServices.length && index > 0}
									/>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			{/if}

			<footer>
				<button class="ml-auto btn btn-xs" on:click={handleClose}>Отмена</button
				>
				{#if autoBindedServices.length || strayServices.length}
					<button
						disabled={strayServices.length}
						class="btn btn-xs download"
						on:click={() => (autoBindedServices = [])}>Далее</button
					>
				{:else}
					<button class="btn btn-xs download" on:click={download}
						>Скачать</button
					>
				{/if}
				<!-- <button class="btn btn-xs upload" on:click={upload}>Отправить</button> -->
			</footer>
		</dialog>
	</div>
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
		overflow: auto;
		max-width: 95%;
		max-height: 95%;
		border: 0.5px solid lightgrey;
		padding: 1rem;
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
		align-items: flex-end;
	}

	ol.auto {
		list-style: auto;
		margin-left: 1rem;
	}
	.service.moved {
		background-color: oklch(var(--s) / 0.1);
		opacity: 0.5;
	}
	.service.blacklist {
		opacity: 0.3;
	}
</style>
