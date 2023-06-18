// needs to provide api for
// prnt, publish, subscribe, unsubscribe
export const ipnsPubsubImports = {
	prnt: () => console.log('Printing from Host'),
	publish: () => console.log('Publishing from Host'),
	subscribe: () => console.log('Subscribing from Host'),
	unsubscribe: () => console.log('Unsubscribing from Host')
};

import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	throw error(404, 'Not found');
}
