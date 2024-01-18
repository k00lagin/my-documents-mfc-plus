import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from "rollup-plugin-postcss";
import sveltePreprocess from 'svelte-preprocess';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import metablock from 'rollup-plugin-userscript-metablock';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/meta.js',
		output: {
			file: 'public/build/my-documents-mfc-plus.meta.js',
		},
		plugins: [
			metablock({
				file: './src/meta.json',
				override: {
					version: pkg.version,
					description: pkg.description,
					author: pkg.author,
					license: pkg.license,
				}
			})
		]
	},
	{
		input: 'src/main.js',
		output: {
			format: 'iife',
			name: 'app',
			file: 'public/build/my-documents-mfc-plus.user.js',
		},
		plugins: [
			postcss({ minimize: true }),
			svelte({
				preprocess: sequence([
					preprocessMeltUI(),
					sveltePreprocess({
						sourceMap: !production
					})]),
				compilerOptions: {
					dev: !production
				},
				emitCss: false,
			}),

			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			production && terser({
				output: {
					beautify: true,
				}
			}),

			metablock({
				file: './src/meta.json',
				override: {
					version: pkg.version,
					description: pkg.description,
					author: pkg.author,
					license: pkg.license,
				}
			})
		],
		watch: {
			clearScreen: false
		}
	}
];
