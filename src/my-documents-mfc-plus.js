import './app.css';
import App from './App.svelte';

export const init = () => {
	document.body.innerHTML = '';
	const app = new App({
		target: document.body
	});
	return app;
}
