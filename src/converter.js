function convertColor(color) {
	if (color.rgb) {
		return {
			argb: `FF${color.rgb}`
		}
	}
}
export function convertAddress({ c, r }) {
	return XLSX.utils.encode_cell({ c, r })
}

export function convert(sheetJsWorkbook) {
	const workbook = new ExcelJS.Workbook();
	workbook.calcProperties.fullCalcOnLoad = true;

	for (const sheetname of sheetJsWorkbook.SheetNames) {
		const sheetJsSheet = sheetJsWorkbook.Sheets[sheetname];
		const worksheet = workbook.addWorksheet(sheetname);
		const meta = sheetJsWorkbook.Workbook.Sheets[sheetname];
		if (sheetname === 'hidden' || meta && meta.Hidden) {
			worksheet.state = 'hidden';
		}
		if (sheetJsSheet['!cols']) worksheet.columns = sheetJsSheet['!cols'].map(col => {
			return {
				width: col.width,
				hidden: col.hidden || col.width === 0
			}
		})

		const [startCellAddress, endCellAddress] = sheetJsSheet['!ref'].split(':').map(adrr => XLSX.utils.decode_cell(adrr));
    for (let r = startCellAddress.r; r <= endCellAddress.r; r++) {
        if (sheetJsSheet['!rows']?.[r]) {
            worksheet.getRow(r).height = sheetJsSheet['!rows'][r].hpt
        }
        for (let c = startCellAddress.c; c <= endCellAddress.c; c++) {
            const addr = convertAddress({ c, r})
            worksheet.getCell(addr).value = sheetJsSheet[addr]?.v;
            if (sheetJsSheet[addr]?.f) {
                worksheet.getCell(addr).value = {
                    formula: sheetJsSheet[addr]?.f
                }
            }
            if (sheetJsSheet[addr]?.s?.patternType === 'solid') {
                worksheet.getCell(addr).fill = {
                type: 'pattern',
                pattern: 'solid',
                bgColor: convertColor(sheetJsSheet[addr]?.s.bgColor),
                fgColor: convertColor(sheetJsSheet[addr]?.s.fgColor)
            };
        }
        }
    }

    // merges
    if (sheetJsSheet['!merges']) {
        for (const merge of sheetJsSheet['!merges']) {
            worksheet.mergeCells(`${convertAddress(merge.s)}:${convertAddress(merge.e)}`)
        }
    }
	}
	return workbook;
}
