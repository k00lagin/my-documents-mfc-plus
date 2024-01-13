<script>
	import { onMount, createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import {
		fetchData,
		fetchAndSave,
		fetchFile,
		downloadBlob,
		getPrefillData,
	} from "../../api.js";
	import { user, settings, serviceBindings } from "../../stores.js";
	import { convert, convertAddress } from "../../converter.js";
	import FillServices from "./FillServices/FillServices.svelte";
	let fillServices;

	export let year,
		month,
		type,
		office,
		fillData = null;

	let templates = {
		federal: {
			title: "Федеральные услуги",
			letter: "Ф",
		},
		regional: {
			title: "Региональные услуги",
			letter: "Р",
		},
		municipal: {
			title: "Муниципальные услуги",
			letter: "М",
		},
		otherServices: {
			title: "Услуги иных организаций",
			letter: "И",
		},
		windowsAndEmployee: {
			title: "Окна и сотрудники",
			letter: "О",
		},
	};

	let uploads;
	$: errors = uploads?.items[0]?.uploadFile?.countErrors;

	async function fetchUploads() {
		uploads = await fetchData(
			`https://моидокументы.рф/mfc/ws/quarterDataExcel/getTemplatesList?rf_subject=${$user.rfSubjectRoleIds[0]}&year=${year}&month=${month}&formType=${type}&importType=mou&mouType=${office.type}&mouId=${office.id}`,
		);
	}

	$: fetchUploads(year, month, type, office);
	$: emptyTemplateUrl = `https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc/ws/quarterDataExcel/templateMou/${office.id}?year=${year}&month=${month}&serviceType=${type}&mouType=${office.type}&subjectId=${$user.rfSubjectRoleIds[0]}`;

	async function handleClick(e) {
		if (e.button === 0) {
			if ($settings.fillWindows && type === "windowsAndEmployee") {
				dispatch("fill-windows", {
					emptyTemplateUrl,
					templateUrl: uploads?.items[0]?.uploadFile
						? `https://моидокументы.рф/mfc/ws/file/view/${uploads?.items[0].uploadFile.fileId}`
						: "",
					filename: `${templates[type].letter} - ${office.name} - ${month}.${year}.xlsx`,
				});
			} else if ($settings.prefillTemplates && !uploads?.items[0]?.uploadFile) {
				let newServices = [];
				let template = await fetchData(emptyTemplateUrl, "buffer");
				let sheetJsWorkbook = XLSX.read(template, {
					cellFormula: true,
					cellStyles: true,
				});
				let workbook = convert(sheetJsWorkbook);

				const sheetname = sheetJsWorkbook.SheetNames[0];
				const sheetJsSheet = sheetJsWorkbook.Sheets[sheetname];
				// console.log(sheetJsSheet.K8);
				let worksheet = workbook.getWorksheet(1);

				for (const addr of ["F3", "G3"]) {
					worksheet.getCell(addr).alignment = {
						horizontal: "left",
						vertical: "top",
						wrapText: true,
					};
				}
				worksheet.getRow(3).height = 25;
				const [startCellAddress, endCellAddress] = sheetJsSheet["!ref"]
					.split(":")
					.map((adrr) => XLSX.utils.decode_cell(adrr));
				for (let r = startCellAddress.r; r <= endCellAddress.r; r++) {
					for (let c = startCellAddress.c; c <= endCellAddress.c; c++) {
						const addr = convertAddress({ c, r });
						if (c >= 3 && r >= 4 && c <= 19) {
							worksheet.getCell(addr).border = {
								top: { style: "thin" },
								left: { style: "thin" },
								bottom: { style: "thin" },
								right: { style: "thin" },
							};
							worksheet.getCell(addr).alignment = {
								horizontal: "center",
								vertical: "top",
								wrapText: true,
							};
						}

						if (c === 4 && r >= 7 && r < endCellAddress.r) {
							const serviceName = worksheet.getCell(addr).value;
							const prefillData = await getPrefillData({
								serviceName,
								formType: type,
								mouType: office.type,
								officeId: office.id,
								currentYear: year,
								currentMonth: month,
							});
							if (prefillData) {
								if (prefillData.personIn !== undefined) {
									if (prefillData.personIn)
										worksheet.getCell(`I${r + 1}`).value = 0;
									if (prefillData.orgIn)
										worksheet.getCell(`J${r + 1}`).value = 0;

									if (prefillData.personOut)
										worksheet.getCell(`N${r + 1}`).value = 0;
									if (prefillData.personOutPositive)
										worksheet.getCell(`O${r + 1}`).value = 0;
									if (prefillData.orgOut)
										worksheet.getCell(`P${r + 1}`).value = 0;
									if (prefillData.orgOutPositive)
										worksheet.getCell(`Q${r + 1}`).value = 0;
								} else if (prefillData.allIn !== undefined) {
									if (prefillData.allIn)
										worksheet.getCell(`G${r + 1}`).value = 0;
									if (prefillData.foreignIn)
										worksheet.getCell(`H${r + 1}`).value = 0;

									if (prefillData.allOut)
										worksheet.getCell(`L${r + 1}`).value = 0;
									if (prefillData.foreignOut)
										worksheet.getCell(`M${r + 1}`).value = 0;
								}
								if (prefillData.comment) {
									worksheet.getCell(`T${r + 1}`).value = prefillData.comment;
								}

							} else {
								const serviceType = worksheet.getCell(`G${r + 1}`).fill
									? "person-org"
									: worksheet.getCell(`H${r + 1}`).fill
									  ? "all"
									  : "all-foreign";
								newServices.push({
									serviceName: worksheet.getCell(addr).value,
									formType: type,
									row: r + 1,
									type: serviceType,
								});
							}
						}
					}
				}
				worksheet.getCell(endCellAddress.r + 1, endCellAddress.c).value = "0";

				if (newServices.length > 0) {
					dispatch("new-services", { services: newServices, type });
				} else if ($settings.fillTemplates && $serviceBindings?.[type] && fillData) {
						fillServices.init({
							type,
							workbook,
							fillData,
							filename: `${templates[type].letter} - ${office.name} - ${month}.${year}.xlsx`
						});
				} else {
					const buffer = await workbook.xlsx.writeBuffer();
					downloadBlob(
						new Blob([buffer]),
						`${templates[type].letter} - ${office.name} - ${month}.${year}.xlsx`,
					);
				}
			} else {
				fetchFile(
					uploads?.items[0]?.uploadFile
						? `https://моидокументы.рф/mfc/ws/file/view/${uploads?.items[0].uploadFile.fileId}`
						: emptyTemplateUrl,
				).then(({blob, extension}) => {
					downloadBlob(
						blob,
						`${templates[type].letter} - ${office.name} - ${month}.${year}.${extension}`,
					);
				});
			}
		}
	}

	onMount(() => {});
</script>

<button
	class="btn btn-xs btn-outline"
	class:btn-error={errors}
	class:btn-success={errors === 0}
	title={templates[type].title}
	on:click={handleClick}>{templates[type].letter}</button
>

<FillServices bind:this={fillServices} />

<style>
</style>
