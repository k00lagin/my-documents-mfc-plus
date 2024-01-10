export let iconStore = {};
export function iconStoreInit() {
		const resources = GM_info.script.resources
		for (const resource of resources) {
			iconStore[resource.name] = GM_getResourceURL(resource.name)
		}
}
