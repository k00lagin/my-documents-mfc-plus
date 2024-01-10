export const init = () => {
	if (location.href.split('#')[0] === 'https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc/AisUiApp/index.html' &&
		window.opener?.location.href.startsWith('https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc-plus')) {
		window.opener.location.reload();
		window.close();
	}
}
