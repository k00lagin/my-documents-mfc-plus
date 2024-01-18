import { readable, writable, derived } from 'svelte/store';

export const user = writable({});
export const authorized = writable(false);

export const mfcList = writable([]);
let $mfcList;
mfcList.subscribe(value => {
	$mfcList = value;
});
export const urmList = writable([]);
let $urmList;
urmList.subscribe(value => {
	$urmList = value;
});

export const offices = derived([mfcList, urmList], () => [...$mfcList, ...$urmList]);

const localOffices = GM_getValue('my-offices') || [];
export const myOffices = writable(localOffices);
let $myOffices;
myOffices.subscribe(value => {
	GM_setValue('my-offices', value);
	$myOffices = value;
});
export const addOffice = (id) => {
	myOffices.set([...$myOffices, id])
}
export const removeOffice = (id) => {
	myOffices.set($myOffices.filter(office => office.id !== id))
}

let $notifications;
export const notifications = writable([]);
notifications.subscribe(value => {
	$notifications = value;
});
export const notify = (text, type, duration) => {
	let id = Math.random().toString(36).substring(2, 11)
	notifications.set([...$notifications, {
		id,
		text,
		type
	}]);
	setTimeout(() => {
		dismissNotification(id)
	}, duration || 5000);
}
export const dismissNotification = (id) => {
	notifications.set($notifications.filter(notification => notification.id !== id));
}

const localSettings = GM_getValue('settings') || {
	fillWindows: true,
	prefillTemplates: true
};
export const settings = writable(localSettings);
let $settings;
settings.subscribe(value => {
	GM_setValue('settings', value);
	$settings = value;
});

export const prefillData = writable(GM_getValue('prefill-data') || {});
let $prefillData;
prefillData.subscribe(value => {
	GM_setValue('prefill-data', value);
	$prefillData = value;
})

export const serviceBindings = writable(GM_getValue('service-bindings') || {
	federal: {},
	municipal: {},
	regional: {},
	otherServices: {}
});
let $serviceBindings;
serviceBindings.subscribe(value => {
	GM_setValue('service-bindings', value);
	$serviceBindings = value;
})

export const fillWindowsBookmarks = writable(GM_getValue('fill-windows-bookmarks') || []);
let $fillWindowsBookmarks;
fillWindowsBookmarks.subscribe(value => {
	GM_setValue('fill-windows-bookmarks', value);
	$fillWindowsBookmarks = value;
})

export const keyboard = writable({
	isShiftDown: false,
	isCtrlDown: false
})
