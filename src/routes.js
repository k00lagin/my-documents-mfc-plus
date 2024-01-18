import Router from "./Router.svelte";

import Home from "./pages/Home.svelte"
import Templates from "./pages/templates/+page.svelte"
import User from "./pages/User.svelte"

import Settings from "./pages/settings/+page.svelte"
import SettingsOffices from "./pages/settings/offices/+page.svelte"
import SettingsTemplates from "./pages/settings/templates/+page.svelte"

export const routes = {
	'mfc-plus': {
		component: Home,
		nested: {
			'templates': {
				component: Templates
			},
			'settings': {
				component: Settings,
				placeholder: 'offices',
				nested: {
					'offices': {
						component: SettingsOffices
					},
					'templates': {
						component: SettingsTemplates
					}
				}
			},
			'user': {
				component: User
			}
		}
	}
}

let listeners = [];
window.addEventListener('navigate', e => {
	console.log('navigate', listeners, e)
	listeners.forEach(listener => {
		listener.dispatchEvent(new CustomEvent('navigate', { detail: e.detail }));
	})
})
export const subscribe = (listener) => {
	listeners.push(listener);
}
export const unsubscribe = (listener) => {
	console.log('before', listeners)
	listeners = listeners.filter(l => l !== listener);
	console.log('after', listeners)
}

export const router = {
	content: Router,
	node: routes,
	link: (node, options) => {
		const activeClass = options?.activeClass || 'link-active';
		if (window.location.pathname === node.getAttribute('href')) {
			node.classList.add(activeClass);
		}
		subscribe(node);
		node.addEventListener('click', e => {
			e.preventDefault();
			history.pushState({}, '', e.currentTarget.href);
			dispatchEvent(new CustomEvent('navigate', { detail: e.currentTarget.href }));
		})
		node.addEventListener('navigate', e => {
			if (window.location.pathname === node.getAttribute('href')) {
				node.classList.add(activeClass);
			} else {
				node.classList.remove(activeClass);
			}
		})
		return {
			destroy: () => {
				unsubscribe(node);
			}
		};
	},
	api: {
		isCurrent: (path) => {
			return window.location.pathname === path;
		}
	}
}
