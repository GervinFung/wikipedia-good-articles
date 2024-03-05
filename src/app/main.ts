import { Defined } from '@poolofdeath20/util';

import App from './main.svelte';

const app = new App({
	target: Defined.parse(document.getElementById('app')).orThrow(
		'No app element'
	),
});

export default app;
