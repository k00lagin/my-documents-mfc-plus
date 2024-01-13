<script>
	import { onMount } from "svelte";
	import TemplateButton from "./TemplateButton.svelte";
	import FillWindows from "./FillWindows/FillWindows.svelte";
	import NewServices from "./NewServices/NewServices.svelte";
	import { myOffices, notify, offices, settings } from "../../stores.js";
	import StatsImporter from "./StatsImporter.svelte";
	import { iconStore } from "../../icon-store";
	let month, year;
	let isFillWindowsDialogOpen = false,
		fillWindowsData = {};
	let isNewServicesDialogOpen = false,
		newServicesData = {};
	let importerOfficeNames,
		importedData,
		isBindingsExpanded = false;

	month = new Date().getMonth() || 12;
	if (month == 12) {
		year = new Date().getFullYear() - 1;
	} else {
		year = new Date().getFullYear();
	}
	const months = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	];

	let fileInput;
	async function upload() {
		if (fileInput.value !== "") {
			for (const file of fileInput.files) {
				if (file) {
					let formData = new FormData();
					formData.append("filename", file.name);
					formData.append("docFile", file, file.name);
					fetch(
						"https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc/ws/quarterDataExcel/uploadData",
						{
							method: "POST",
							credentials: "same-origin",
							encType: "multipart/form-data",
							body: formData,
						},
					).then((response) => {
						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						response.json().then(function (data) {
							if (data.success) {
								notify("Успех!", "success");
							} else {
								notify(data.data, "error");
							}
						});
					});
				}
			}
			fileInput.value = "";
		}
	}

	onMount(() => {});
</script>

<svelte:head>
	<title>Шаблоны</title>
</svelte:head>

<div class="toolbar">
	<div class="join filters">
		<input
			type="text"
			class="w-16 input input-xs input-bordered year join-item"
			bind:value={year}
		/>
		<select
			class="select select-xs select-bordered month join-item"
			bind:value={month}
		>
			<option disabled>Месяц</option>
			{#each months as monthName, monthNumber}
				<option value={monthNumber + 1}>{monthName}</option>
			{/each}
		</select>
	</div>
	{#if $settings["fillTemplates"]}
		<StatsImporter
			on:import={({ detail }) => {
				importedData = detail;
			}}
			on:got-office-names={({ detail }) => (importerOfficeNames = detail)}
			on:reset={() => (importerOfficeNames = null)}
		/>
	{/if}
	<label class="ml-auto btn btn-xs">
		<input
			type="file"
			multiple
			bind:this={fileInput}
			class="hidden"
			accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			on:change={upload}
		/>
		Загрузить шаблон(ы)
	</label>
</div>
{#if $myOffices.length > 0}
	<table class="table table-xs">
		<tr>
			<th>Офис</th>
			<th>Окна</th>
			{#if $settings["fillTemplates"] && importerOfficeNames?.length > 0}
				<th>
					<button
						class="btn btn-xs btn-square expand-bindings"
						title="Связи между офисами на портале и в выгрузке из Pentaho"
						on:click={() => (isBindingsExpanded = !isBindingsExpanded)}
					>
						<img
							class="frame-1"
							src={iconStore["raphael_connect"]}
							alt=""
						/>
						<img
							class="frame-2"
							src={iconStore["raphael_connect"]}
							alt=""
						/>
					</button>
					{#if isBindingsExpanded}
						Имя в выгрузках
					{/if}
				</th>
			{/if}
			<th>Услуги</th>
		</tr>
		{#each $myOffices as office, officeIdx}
			<tr class="hover">
				<td>{office.short_name || office.address}</td>
				<td>
					<TemplateButton
						{year}
						{month}
						office={{
							id: office.id,
							type: office.type,
							name: office.short_name || office.id,
						}}
						type="windowsAndEmployee"
						on:fill-windows={({ detail }) => {
							isFillWindowsDialogOpen = true;
							fillWindowsData = {
								emptyTemplateUrl: detail.emptyTemplateUrl,
								templateUrl: detail.templateUrl,
								filename: detail.filename,
							};
						}}
					/>
				</td>
				{#if $settings["fillTemplates"] && importerOfficeNames?.length > 0}
					<td>
						<div class="flex gap-2 wrap">
							{#if office.pentaho_name}
								{#if importerOfficeNames.findIndex((name) => name === office.pentaho_name) !== -1}
									<button
										class="btn btn-xs btn-square btn-success"
										title="Связь установлена"
									>
										<img
											src={iconStore["mdi_check"]}
											alt=""
										/>
									</button>
								{:else}
									<button
										class="btn btn-xs btn-square btn-warning"
										title="В выгрузке отсутствует"
									>
										<img
											src={iconStore["mdi_exclamation"]}
											alt=""
										/>
									</button>
								{/if}
							{:else}
								<button
									class="btn btn-xs btn-square btn-error"
									title="Связь не установлена"
								>
									<img
										src={iconStore["vaadin_exclamation"]}
										alt=""
									/>
								</button>
							{/if}
							{#if isBindingsExpanded}
								{#if office.pentaho_name}
									<span>{office.pentaho_name}</span>
									<button
										title="Очистить"
										class="ml-auto btn btn-xs btn-square"
										on:click={() => ($myOffices[officeIdx].pentaho_name = "")}
									>
										<img
											src={iconStore["mdi_close"]}
											alt=""
										/>
									</button>
								{:else if importerOfficeNames}
									<select
										title="Необходимо связать этот офис с офисом из выгрузки"
										on:change={({ target }) => {
											$myOffices[officeIdx].pentaho_name = target.value;
										}}
									>
										<option value="" selected
											>Не выбрано / Отсутствует в выгрузке</option
										>
										{#each importerOfficeNames.filter((officeName) => $myOffices.findIndex((myOffice) => myOffice.pentaho_name === officeName) === -1) as name}
											<option value={name}>{name}</option>
										{/each}
									</select>
								{/if}
							{/if}
						</div>
					</td>
				{/if}
				<td>
					{#each office.type === "mfc" ? ["federal", "municipal", "regional", "otherServices"] : ["federal", "otherServices"] as template}
						<TemplateButton
							{year}
							{month}
							office={{
								id: office.id,
								type: office.type,
								name: office.short_name || office.id,
							}}
							fillData={importedData?.[office.pentaho_name]?.[template !== 'otherServices' ? template : 'federal'] || undefined}
							type={template}
							on:new-services={({ detail }) => {
								isNewServicesDialogOpen = true;
								newServicesData = detail;
							}}
						/>
					{/each}
				</td>
			</tr>
		{/each}
	</table>
{/if}
{#if isFillWindowsDialogOpen}
	<FillWindows
		open="true"
		emptyTemplateUrl={fillWindowsData.emptyTemplateUrl}
		templateUrl={fillWindowsData.templateUrl}
		filename={fillWindowsData.filename}
		on:close={() => {
			isFillWindowsDialogOpen = false;
			fillWindowsData = {};
		}}
	></FillWindows>
{/if}
{#if isNewServicesDialogOpen}
	<NewServices
		open="true"
		newServicesData={newServicesData.services}
		type={newServicesData.type}
		on:close={() => {
			isNewServicesDialogOpen = false;
			newServicesData = [];
		}}
	></NewServices>
{/if}

<style>
	table {
		width: max-content;
	}
	.toolbar {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.5rem;
	}
	.month:focus,
	.year:focus {
		outline-offset: -1px;
		outline-color: oklch(var(--s) / 0.5);
	}
	.expand-bindings:not(:hover) > .frame-2 {
		display: none;
	}
	.expand-bindings:hover > .frame-1 {
		display: none;
	}
	.wrap > span {
		flex-shrink: 0;
	}
</style>
