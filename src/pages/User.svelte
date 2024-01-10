<script>
	import { user } from "../stores.js";
	import { logout } from "../api.js"
</script>

<svelte:head>
	<title>О пользователе</title>
</svelte:head>

<table>
	<tr>
		<th>Параметр</th>
		<th>Значение</th>
	</tr>
	{#each Object.keys($user) as param}
		<tr>
			<td>{param}</td>
			<td>{$user[param]}</td>
		</tr>
	{/each}
</table>
<button class="btn btn-sm" on:click={logout}>Выйти</button>
