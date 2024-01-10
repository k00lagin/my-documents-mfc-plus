import Router from "./Router.svelte";

import Home from "./pages/Home.svelte"
import Templates from "./pages/templates/+page.svelte"
import Settings from "./pages/settings/+page.svelte"
import User from "./pages/User.svelte"

export const routes = {
	'mfc-plus': {
			component: Home,
			nested: {
				'templates': {
					component: Templates
				},
				'settings': {
					component: Settings
				},
				'user': {
					component: User
				}
			}
	}
}

export const router = {
	content: Router,
	node: routes,
	link: (node) => {
		node.addEventListener('click', e => {
			e.preventDefault();
			history.pushState({},'',e.currentTarget.href);
			dispatchEvent(new PopStateEvent('popstate'));
		})
	},
	api: {
		isCurrent: (path) => {
			return window.location.pathname === path;
		}
	}
}
