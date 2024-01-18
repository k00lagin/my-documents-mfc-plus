<script>
	import CustomInput from "./CustomInput.svelte";

	export let row, fillData, hiddenResult = false, mergedFillData;
	const cells = row && {
		personIn: row.getCell("I"),
		personOut: row.getCell("N"),
		personOutPositive: row.getCell("O"),

		orgIn: row.getCell("J"),
		orgOut: row.getCell("P"),
		orgOutPositive: row.getCell("Q"),

		allIn: row.getCell("G"),
		allOut: row.getCell("L"),
		foreignIn: row.getCell("H"),
		foreignOut: row.getCell("M"),
		comment: row.getCell("T"),
	};
	const slots = row && {
		personIn: typeof cells.personIn.value === "number",
		personOut: typeof cells.personOut.value === "number",
		personOutPositive: typeof cells.personOutPositive.value === "number",

		orgIn: typeof cells.orgIn.value === "number",
		orgOut: typeof cells.orgOut.value === "number",
		orgOutPositive: typeof cells.orgOutPositive.value === "number",

		allIn: typeof cells.allIn.value === "number",
		allOut: typeof cells.allOut.value === "number",
		foreignIn: typeof cells.foreignIn.value === "number",
		foreignOut: typeof cells.foreignOut.value === "number",

		comment: cells.comment.value,
	};

	const sorted = Object.keys(fillData).sort((t1, t2) => {
		const [v1, v2] = [t1, t2].map((t) => {
			if (t === "ФЛ") return 2;
			if (t === "ЮЛ" || t === "ИП") return 1;
			if (t === "Н/Д") return -1;
			return 0;
		});
		return v2 - v1;
	});

	let unusedInputs = [];
	if (slots) {
		let inputData = mergedFillData ?? fillData;
		unusedInputs = !hiddenResult && [...sorted] || [];
		if (slots.personIn && inputData["ФЛ"]?.in !== undefined) {
			cells.personIn.value = inputData["ФЛ"].in;
			unusedInputs = unusedInputs.filter((t) => t !== "ФЛ");
		}
		if (slots.personOut && inputData["ФЛ"]?.out !== undefined) {
			cells.personOut.value = inputData["ФЛ"].out;
		}
		if (slots.personOutPositive && inputData["ФЛ"]?.positive !== undefined) {
			cells.personOutPositive.value = inputData["ФЛ"].positive;
		}

		if (slots.orgIn && (inputData["ЮЛ"]?.in !== undefined || inputData["ИП"]?.in !== undefined)) {
			cells.orgIn.value = (inputData["ЮЛ"]?.in || 0) + (inputData["ИП"]?.in || 0);
			unusedInputs = unusedInputs.filter((t) => t !== "ЮЛ" && t !== "ИП");
		}
		if (slots.orgOut && (inputData["ЮЛ"]?.out !== undefined || inputData["ИП"]?.out !== undefined)) {
			cells.orgOut.value =
				(inputData["ЮЛ"]?.out || 0) + (inputData["ИП"]?.out || 0);
		}
		if (
			slots.orgOutPositive &&
			(inputData["ЮЛ"]?.positive !== undefined || inputData["ИП"]?.positive !== undefined)
		) {
			cells.orgOutPositive.value =
				(inputData["ЮЛ"]?.positive || 0) + (inputData["ИП"]?.positive || 0);
		}

		if (slots.allIn && sorted.length) {
			cells.allIn.value = sorted.reduce(
				(sum, type) => sum + (inputData[type]?.in || 0),
				0,
			);
			unusedInputs = [];
		}
		if (slots.allOut && sorted.length) {
			cells.allOut.value = sorted.reduce(
				(sum, type) => sum + (inputData[type]?.out || 0),
				0,
			);
		}
	}
</script>

<td class="pr-1">
	<div class="column">
		{#each sorted as type}
			<div
				class="badge type"
				style="max-width: 2rem;text-overflow: ellipsis;overflow: clip;"
				title={type}
				class:unused={unusedInputs.includes(type)}
			>
				{type}
			</div>
		{/each}
	</div>
</td>
<td>
	<div class="column">
		{#each sorted as type}
			<div class="pr-4 badge">
				{fillData[type]?.in || 0}
			</div>
		{/each}
	</div>
</td>
<td>
	<div class="column">
		{#each sorted as type}
			<div class="badge">
				{fillData[type]?.out || 0}
			</div>
		{/each}
	</div>
</td>
<td>
	<div class="column">
		{#each sorted as type}
			<div class="badge">
				{fillData[type]?.positive || 0}
			</div>
		{/each}
	</div>
</td>

{#if row && !hiddenResult}
	<td>
		<div class="column">
			{#if slots.personIn}
				<div>
					<span class="badge">ФЛ</span>
				</div>
			{/if}
			{#if slots.orgIn}
				<div>
					<span class="badge">ЮЛ</span>
				</div>
			{/if}
			{#if slots.allIn}
				<div>
					<span class="badge">Все</span>
				</div>
				{#if slots.foreignIn}
					<div>
						<span class="badge">Экст</span>
					</div>
				{/if}
			{/if}
		</div>
	</td>
	<td class="in">
		<div>
			{#if slots.personIn}
				<div>
					<CustomInput cell={cells.personIn} />
				</div>
			{/if}
			{#if slots.orgIn}
				<div>
					<CustomInput cell={cells.orgIn} />
				</div>
			{/if}
			{#if slots.allIn}
				<div>
					<CustomInput cell={cells.allIn} />
				</div>
				{#if slots.foreignIn}
					<div>
						<CustomInput cell={cells.foreignIn} />
					</div>
				{/if}
			{/if}
		</div>
	</td>

	<td class="out">
		<div>
			{#if slots.personOut}
				<div>
					<CustomInput cell={cells.personOut} />
					{#if slots.personOutPositive}
						<CustomInput cell={cells.personOutPositive} />
					{/if}
				</div>
			{/if}
			{#if slots.orgOut}
				<div>
					<CustomInput cell={cells.orgOut} />
					{#if slots.orgOutPositive}
						<CustomInput cell={cells.orgOutPositive} />
					{/if}
				</div>
			{/if}
			{#if slots.allOut}
				<div>
					<CustomInput cell={cells.allOut} />
				</div>
				{#if slots.foreignOut}
					<div>
						<CustomInput cell={cells.foreignOut} />
					</div>
				{/if}
			{/if}
		</div>
	</td>
{/if}

<style>
	td.in > div,
	td.out > div,
	.column {
		display: flex;
		flex-flow: column nowrap;
		gap: 0.25rem;
		align-items: center;
	}
	td.in > div > div,
	td.out > div > div {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
	}
	.type.unused {
		background-color: var(--fallback-s, oklch(var(--s) / 0.2));
		opacity: 0.5;
	}
</style>
