import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import postcss from "rollup-plugin-postcss";
import sveltePreprocess from 'svelte-preprocess';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import fs from 'fs';

const preamble = fs.readFileSync('src/meta.js', 'utf-8');
const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/meta.js',
		output: {
			file: 'public/build/my-documents-mfc-plus.meta.js',
			banner: preamble
		}
	},
	{
		input: 'src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/build/my-documents-mfc-plus.user.js',
			banner: preamble
		},
		plugins: [
			postcss({ minimize: false }),
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

			// typescript({
			// 	sourceMap: !production,
			// 	inlineSources: !production
			// }),

			!production && serve(),

			production && terser({
				output: {
					beautify: true,
					preamble: preamble
				}
			})
		],
		watch: {
			clearScreen: false
		}
	}
];
