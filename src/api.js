import { user, authorized, mfcList, urmList, prefillData } from "./stores.js";

let $user;
user.subscribe(value => {
	$user = value;
});

export const checkAuth = () => {
	fetch("https://моидокументы.рф/mfc/ws/auth/current", {
		credentials: "same-origin",
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Не авторизован");
			}
		})
		.then((data) => {
			user.update(() => data);
			authorized.update(() => true);
		})
		.catch((error) => {
			authorized.update(() => false);
			console.warn(error)
			// throw new Error(error);
		});
}

export const logout = () => {
	fetch("https://моидокументы.рф/mfc/ws/auth/logout", {
		credentials: "same-origin"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			response.json().then(function (data) {
				authorized.update(() => false)
				user.update(() => { })
			});
		})
		.catch(error => {
			throw new Error(error);
		});
}

export const fetchOffices = () => {
	for (const type of ['mfc', 'urm']) {
		fetch(
			encodeURI(
				`https://моидокументы.рф/mfc/ws/dictionary/unicombo/?collection=amm_sys_${type}_card_form&fields=["_id","common_data.address","common_data.full_name","common_data.status","common_data.profile","common_data.wnd_count","common_data.start_date","common_data.finish_date"]&additionalFilter={"common_data.rf_subject":${$user.rfSubjectRoleIds[0]},"common_data.status":"\u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0439","$or":[{"common_data.hidden":{"$exists":false}},{"common_data.hidden":{"$in":[0,false]}}]}&sort={"common_data.address":1}&page=1&start=0`
			),
			{
				credentials: "same-origin",
			}
		).then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			response.json().then(function (data) {
				let list = data.items.map(office => {
					return {
						id: office._id,
						type: type,
						...office.common_data
					}
				});
				if (type === 'mfc') {
					mfcList.update(() => list);
				} else if (type === 'urm') {
					urmList.update(() => list);
				}
			});
		});
	}
}

export const fetchData = async (url, type = 'json') => {
	return new Promise((resolve, reject) => {
		fetch(url, {
			credentials: "same-origin",
			headers: {
				"Content-type":
					"application/x-www-form-urlencoded; charset=UTF-8"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				switch (type) {
					case 'json': {
						response.json().then(json => {
							resolve(json);
						});
						break
					}
					case 'buffer': {
						response.arrayBuffer().then(buffer => {
							resolve(buffer);
						})
						break
					}
					case 'blob': {
						response.blob().then(blob => {
							resolve(blob);
						})
						break
					}
					case 'text': {
						response.text().then(text => {
							resolve(text);
						})
						break
					}
				}
			})
			.catch(error => {
				reject(error);
			});
	})
}

export const downloadBlob = (blob, filename) => {
	const url = window.URL.createObjectURL(blob);

	let a = document.createElement("a");
	a.href = url;
	a.style.display = 'none';
	a.download = filename;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
}

export const fetchFile = (url) => {
	let filename = '', extension = '';
	return new Promise((resolve, reject) => {
		fetch(url, {
			credentials: "same-origin"
		})
			.then(response => {
				if (!response.ok) {
					reject("Network response was not ok");
				}
				let contentDisposition = response.headers.get('Content-Disposition');
				if (contentDisposition.startsWith('attachment; filename="')) {
					filename = decodeURI(contentDisposition.slice(22, -1)).split('+').join(' ');
					extension = filename.substring(filename.lastIndexOf('.') + 1)
				}
				return response.blob();
			})
			.then(blob => {
				resolve({blob, filename, extension});
			})
			.catch(error => {
				reject(error);
			});
	})
}

export const fetchAndSave = (url, filename) => {
	fetch(url, {
		credentials: "same-origin"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.blob();
		})
		.then(function (blob) {
			downloadBlob(blob, filename);
		})
		.catch(error => {
			throw new Error(error);
		});
}

let $prefillData;
prefillData.subscribe(data => {
	$prefillData = data;
})
export const getPrefillData = async ({ serviceName, formType, mouType, officeId, currentMonth, currentYear }) => {
	const storedData = $prefillData[formType] || {};
	if (storedData.services?.[serviceName]) {
		return storedData.services[serviceName];
	}
	let prevMonth = currentMonth - 1;
	let prevYear = currentYear;
	if (prevMonth === 0) {
		prevMonth = 12;
		prevYear--;
	}
	let data = {
		month: prevMonth,
		year: prevYear,
		services: {}
	}
	if (Object.keys(storedData).length === 0 || storedData.year < prevYear || (storedData.year === prevYear && storedData.month < prevMonth)) {
		const uploads = await fetchData(
			`https://моидокументы.рф/mfc/ws/quarterDataExcel/getTemplatesList?rf_subject=${$user.rfSubjectRoleIds[0]}&year=${prevYear}&month=${prevMonth}&formType=${formType}&importType=mou&mouType=${mouType}&mouId=${officeId}`,
		);
		let template = await fetchData(`https://моидокументы.рф/mfc/ws/file/view/${uploads?.items[0].uploadFile.fileId}`, "buffer");
		let workbook = XLSX.read(template);
		let worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const [startCellAddress, endCellAddress] = worksheet['!ref']
			.split(":")
			.map((adrr) => XLSX.utils.decode_cell(adrr));
		for (let r = 7; r < endCellAddress.r; r++) {
			if (worksheet[`E${r + 1}`]?.v) {
				let serviceData = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
					range: `E${r + 1}:T${r + 1}`,
				})[0];
				let serviceName = serviceData[0];
				data.services[serviceName] = {};
				if (serviceData[2] === undefined && serviceData[3] === undefined) {
					data.services[serviceName].personIn = serviceData[4] !== 'нет приема через МФЦ';
					data.services[serviceName].orgIn = serviceData[5] !== 'нет приема через МФЦ';
					data.services[serviceName].personOut = serviceData[9] !== 'нет выдачи через МФЦ';
					data.services[serviceName].personOutPositive = serviceData[10] !== 'нет выдачи через МФЦ';
					data.services[serviceName].orgOut = serviceData[11] !== 'нет выдачи через МФЦ';
					data.services[serviceName].orgOutPositive = serviceData[12] !== 'нет выдачи через МФЦ';
				} else {
					data.services[serviceName].allIn = serviceData[2] !== 'нет приема через МФЦ';
					data.services[serviceName].allOut = serviceData[7] !== 'нет выдачи через МФЦ';
					if (serviceData[3] !== undefined) {
						data.services[serviceName].foreignIn = serviceData[3] !== 'нет приема через МФЦ';
						data.services[serviceName].foreignOut = serviceData[8] !== 'нет выдачи через МФЦ';
					}
				}
				if (serviceData[15] !== undefined) {
					data.services[serviceName].comment = serviceData[15];
				}
			}
		}
		prefillData.update(old => ({
			...old,
			[formType]: data
		}))
		// GM_setValue(`prefillData-${formType}`, data);
		return data.services[serviceName];
	}
}
