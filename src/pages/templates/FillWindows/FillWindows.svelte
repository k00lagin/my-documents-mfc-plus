<script>
	import { fetchData, downloadBlob } from "../../../api.js";
	import { notify } from "../../../stores.js";
	import { onMount, createEventDispatcher } from "svelte";
	import { convert, convertAddress } from "../../../converter.js";
	import FillWindowsRow from "./FillWindowsRow.svelte";
	import Bookmarks from "./Bookmarks.svelte";
	import { iconStore } from "../../../icon-store.js";
	export let templateUrl, emptyTemplateUrl, filename, open;
	const dispatch = createEventDispatcher();
	let template,
		workbook,
		sheet,
		worksheet,
		d = [];
	let title = "";
	onMount(async () => {
		let url = templateUrl || emptyTemplateUrl;
		template = await fetchData(url, "buffer");
		const sheetJsBook = XLSX.read(template, {
			cellFormula: true,
			cellStyles: true,
		});
		sheet = sheetJsBook.Sheets[sheetJsBook.SheetNames[0]];

		workbook = convert(sheetJsBook);
		worksheet = workbook.getWorksheet(1);
		const [startCellAddress, endCellAddress] = sheet["!ref"]
			.split(":")
			.map((adrr) => XLSX.utils.decode_cell(adrr));
		for (let r = startCellAddress.r; r <= endCellAddress.r; r++) {
			if (
				r >= 4 &&
				worksheet.getCell(`C${r + 1}`).value !== undefined &&
				worksheet.getCell(`C${r + 1}`).value ===
					worksheet.getCell(`D${r + 1}`).value
			) {
				worksheet.getCell(`C${r + 1}`).font = {
					name: "Arial",
					bold: true,
				};
			} else {
				worksheet.getRow(r + 1).height =
					15 *
					Math.ceil((worksheet.getCell(`C${r + 1}`).value?.length || 1) / 60);
			}
			for (let c = startCellAddress.c; c <= endCellAddress.c; c++) {
				const addr = convertAddress({ c, r });
				if (c >= 1 && r >= 4 && c <= 3) {
					worksheet.getCell(addr).border = {
						top: { style: "thin" },
						left: { style: "thin" },
						bottom: { style: "thin" },
						right: { style: "thin" },
					};
					worksheet.getCell(addr).alignment = {
						horizontal: "left",
						vertical: "top",
						wrapText: true,
					};
					if (!worksheet.getCell(addr).font) {
						worksheet.getCell(addr).font = {
							name: "Arial",
						};
					}
				}
			}
		}

		const bindings = {
			"1": 7,
			"2": 8,
			"3": 9,

			"6": 15,
			"7": 16,
			"8": 17,
			"9": 18,

			"11": 21,
			"12": 22,
			"13": 23,
		};

		for (const binding of Object.keys(bindings)) {
			d[Number(binding)] =
				worksheet.getCell(`D${bindings[binding]}`)?.value || 0;
		}

		title =
			worksheet.getCell("C2").value + " | " + worksheet.getCell("D3").value;
	});

	function setValue(key, value) {
		if (worksheet && !worksheet.getCell(key).formula) {
			worksheet.getCell(key).value = Number(value);
		}
	}

	$: setValue("D7", d[1]);
	$: setValue("D8", d[2]);
	$: setValue("D9", d[3]);

	$: setValue("D15", d[6]);
	$: setValue("D16", d[7]);
	$: setValue("D17", d[8]);
	$: setValue("D18", d[9]);

	$: setValue("D21", d[11]);
	$: setValue("D22", d[12]);
	$: setValue("D23", d[13]);

	$: setValue("D6", d[0]);
	$: setValue("D12", d[4]);
	$: setValue("D13", d[5]);
	$: setValue("D19", d[10]);

	$: d[0] = Number(d[1]) + Number(d[2]) + Number(d[3]);
	$: d[5] = Number(d[6]) + Number(d[7]) + Number(d[8]);
	$: d[10] = Number(d[11]) + Number(d[12]);
	$: d[4] = Number(d[5]) + Number(d[10]) + Number(d[9]) + Number(d[13]);

	async function upload() {
		let formData = new FormData();
		const wbout = await workbook.xlsx.writeBuffer();
		formData.append("filename", filename);
		let file = new File(
			[new Blob([wbout], { type: "application/vnd.ms-excel" })],
			filename,
		);
		formData.append("docFile", file);
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
	async function download() {
		const buffer = await workbook.xlsx.writeBuffer();
		downloadBlob(new Blob([buffer]), filename);
	}
	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			dispatch("close");
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="backdrop" on:click={handleBackdropClick}>
	<dialog class="shadow-md fill-windows" {open}>
		{#if sheet}
			<header>
				<h3>{title}</h3>
				<button
					class="btn btn-xs btn-square"
					on:click={() => dispatch("close")}
				>
					<img src={iconStore["mdi_close"]} alt="Close" />
				</button>
			</header>
			<table>
				<tbody>
					<tr>
						<td style="font-weight:700" colspan="2"
							>{worksheet.getCell("C5")?.value}</td
						>
					</tr>
					<tr />
					<tr>
						<td><em>{worksheet.getCell("C6")?.value}</em></td>
						<td><em>{d[0]}</em></td>
					</tr>
					<FillWindowsRow
						label={worksheet.getCell("C7")?.value}
						bind:value={d[1]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C8")?.value}
						bind:value={d[2]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C9")?.value}
						bind:value={d[3]}
					/>
					<tr>
						<td style="font-weight:700" colspan="2">{sheet.C11?.v}</td>
					</tr>
					<tr>
						<td><em>{worksheet.getCell("C12")?.value}</em></td>
						<td><em>{d[4]}</em></td>
					</tr>
					<tr>
						<td><em>{worksheet.getCell("C13")?.value}</em></td>
						<td><em>{d[5]}</em></td>
					</tr>
					<tr>
						<td colspan="2">{worksheet.getCell("C14")?.value}</td>
					</tr>
					<FillWindowsRow
						label={worksheet.getCell("C15")?.value}
						bind:value={d[6]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C16")?.value}
						bind:value={d[7]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C17")?.value}
						bind:value={d[8]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C18")?.value}
						bind:value={d[9]}
					/>
					<tr>
						<td>{worksheet.getCell("C19")?.value}</td>
						<td><em>{d[10]}</em></td>
					</tr>
					<tr>
						<td colspan="2">{worksheet.getCell("C20")?.value}</td>
					</tr>
					<FillWindowsRow
						label={worksheet.getCell("C21")?.value}
						bind:value={d[11]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C22")?.value}
						bind:value={d[12]}
					/>
					<FillWindowsRow
						label={worksheet.getCell("C23")?.value}
						bind:value={d[13]}
					/>
				</tbody>
			</table>
			<footer>
				<Bookmarks
					on:apply={(e) => {
						d[1] = e.detail[0];
						d[2] = e.detail[1];
						d[3] = e.detail[2];

						d[6] = e.detail[3];
						d[7] = e.detail[4];
						d[8] = e.detail[5];
						d[9] = e.detail[6];

						d[11] = e.detail[7];
						d[12] = e.detail[8];
						d[13] = e.detail[9];
					}}
					currentValues={[
						d[1],
						d[2],
						d[3],

						d[6],
						d[7],
						d[8],
						d[9],

						d[11],
						d[12],
						d[13],
					]}
				/>

				<button class="ml-auto btn btn-xs" on:click={() => dispatch("close")}
					>Отмена</button
				>
				<button class="btn btn-xs download" on:click={download}>Скачать</button>
				<button class="btn btn-xs upload" on:click={upload}>Отправить</button>
			</footer>
		{:else}
			<span class="loading loading-spinner loading-lg"></span>
		{/if}
	</dialog>
</div>

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
</style>
