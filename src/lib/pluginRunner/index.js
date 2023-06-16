import { ExtismContext } from '@extism/runtime-browser';

const ctx = new ExtismContext();

/**
 * @param {string} name
 * @param {Uint8Array} wasm
 */
export async function register({ manifest, functions, config }) {
	const plugin = await ctx.newPlugin(manifest, functions, config);

	let funcs = Object.keys(await plugin.getExports());
	// console.log('funcs', funcs);
	// for each func, create a proxy function that calls the plugin (excpet 'memory')
	let proxy = {};
	for (let func of funcs) {
		if (func === 'memory') continue;
		proxy[func] = async function (...args) {
			return await plugin.call(func, args[0]);
		};
	}

	return proxy;
}
