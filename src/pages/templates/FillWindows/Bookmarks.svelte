<script>
	import { createEventDispatcher } from "svelte";
	import { fillWindowsBookmarks } from "../../../stores";
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../../../icon-store";
	const dispatch = createEventDispatcher();

	export let currentValues;

	function newBookmark() {
		let bookmark = {
			title: "",
			value: currentValues,
		};
		$fillWindowsBookmarks.push(bookmark);
		$fillWindowsBookmarks = $fillWindowsBookmarks;
	}
	function deleteBookmark(index) {
		$fillWindowsBookmarks.splice(index, 1);
		$fillWindowsBookmarks = $fillWindowsBookmarks;
	}
	function renameBookmark(index) {
		let newTitle = prompt("Введите название шаблона:", $fillWindowsBookmarks[index].title);
		if (newTitle) {
			$fillWindowsBookmarks[index].title = newTitle;
			$fillWindowsBookmarks = $fillWindowsBookmarks;
		}
	}
	function applyBookmark(index) {
		dispatch('apply', $fillWindowsBookmarks[index].value)
	}
</script>

<div class="bookmarks">
	{#each $fillWindowsBookmarks as bookmark, index}
		<div class="join">
			<button class="btn btn-xs join-item btn-outline" title={bookmark.title ? bookmark.value.join(" ") : ""} on:click={() => applyBookmark(index)}>
				{bookmark.title || bookmark.value.join(" ")}
			</button>
			<button
				class="btn btn-xs join-item btn-square"
				on:click={() => renameBookmark(index)}
				title="Переименовать шаблон">
					<svg use:inlineSvg={iconStore["mdi_pencil"]} />
				</button
			>
			<button
				class="btn btn-xs join-item btn-square"
				on:click={() => deleteBookmark(index)}
				title="Удалить шаблон">
					<svg use:inlineSvg={iconStore["mdi_trash"]} />
				</button
			>
		</div>
	{/each}
	<button class="btn btn-xs btn-square" on:click={newBookmark} title="Добавить закладку-шаблон на основе текущих введённых данных">
		<svg use:inlineSvg={iconStore["mdi_plus"]} />
	</button>
</div>

<style>
	.bookmarks {
		display: flex;
    gap: 0.5rem;
		flex-flow: row wrap;
	}
</style>
