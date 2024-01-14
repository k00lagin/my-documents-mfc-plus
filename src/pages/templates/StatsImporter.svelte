<script>
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import { myOffices } from "../../stores";
	import { iconStore } from "../../icon-store";
	let input = null,
		sheetnames = [],
		sheetname,
		workbook = null;

	function recursiveSet(object, key, value) {
		const keys = key.split("|");
		if (object[keys[0]] === undefined && keys.length > 1) object[keys[0]] = {};
		if (keys.length === 1) {
			object[keys[0]] = value;
		} else {
			recursiveSet(object[keys[0]], keys.slice(1).join("|"), value);
		}
	}

	async function handleFileChange(e) {
		if (input.files.length > 0) {
			const file = input.files[0];
			if (file) {
				const buffer = await file.arrayBuffer();
				workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(buffer);

				sheetnames = workbook.worksheets
					.map((w) => w.name)
					.filter(
						(w) => !w.endsWith("_к") && !w.endsWith("_т") && !w.endsWith("_р"),
					);
				sheetname = sheetnames[0];
			}
		}
	}
	function resetInput(e) {
		input.value = "";
		e.target.value = "";
	}
	function handleSheetSelect(sheetname) {
		if (!sheetname) return;
		// console.log(sheetname);
		let worksheet = workbook.getWorksheet(sheetname);
		let col = 3,
			pentahoOfficeNames = new Set(),
			pentahoData = [];

		const fuse = new Fuse($myOffices, {
			keys: ["full_name", "short_name"],
		});

		while (worksheet.getCell(1, col).value) {
			let officeName = worksheet.getCell(1, col).value;
			if (!pentahoOfficeNames.has(officeName)) {
				pentahoOfficeNames.add(officeName);
				pentahoData[worksheet.getCell(1, col).value] = {
					federal: {},
					regional: {},
					municipal: {},
					otherServices: {},
				};
			}
			let row = 4;
			while (worksheet.getCell(row, 1).value) {
				let level = {
					Государственная: "federal",
					Муниципальная: "municipal|municipal",
					"Государственная, переданная на муниципальный уровень": "municipal",
					Региональная: "regional",
				}[worksheet.getCell(row, 1).value];
				let name = worksheet.getCell(row, 2).value;
				let client = worksheet.getCell(2, col).value; // ИП, ФЛ, ЮЛ, ЮЛ+ФЛ, Н/Д
				let type = {
					"Колво по приему документов": "in",
					"Колво по выдаче документов": "out",
					"Колво полож. результатов": "positive",
				}[worksheet.getCell(3, col).value];
				let value = worksheet.getCell(row, col).value;
				if (value !== "")
					recursiveSet(
						pentahoData,
						`${officeName}|${level}|${name}|${client}|${type}`,
						value,
					);

				row++;
			}
			col++;
		}
		dispatch("import", pentahoData);
		dispatch("got-office-names", [...pentahoOfficeNames]);

		// console.log(pentahoOfficeNames);
	}
	$: handleSheetSelect(sheetname);
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<label class="btn btn-xs" title="Выберите файл с выгрузкой из Pentaho" on:click={resetInput} class:hidden={sheetnames.length}>
	Выбрать файл с данными
	<input
		type="file"
		accept=".xlsx"
		class="hidden"
		on:change={(e) => handleFileChange(e)}
		bind:this={input}
	/>
</label>

{#if sheetnames.length}
	<div class="join">
		<select
			class="sheetnames select select-xs select-bordered join-item"
			bind:value={sheetname}
		>
			{#each sheetnames as sheetname}
				<option value={sheetname}>{sheetname}</option>
			{/each}
		</select>
		<button
			class="btn btn-xs btn-square join-item"
			title="Очистить"
			on:click={() => {
				sheetnames = [];
				sheetname = '';
				dispatch("reset");
			}}
		>
			<img src={iconStore["mdi_close"]} alt="Очистить" />
		</button>
	</div>
{/if}

<style>
	.sheetnames {
		outline-offset: -1px;
		outline-color: oklch(var(--s) / 0.5);
	}
</style>
