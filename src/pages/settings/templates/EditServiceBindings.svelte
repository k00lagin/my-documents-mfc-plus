<script>
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../../../icon-store.js";
	import BindService from "../../../components/BindService.svelte";
	import { prefillData, serviceBindings } from "../../../stores";
	import { portal } from "svelte-portal";

	let open = false;
	let currentLevel = "federal";

	const titles = {
		federal: "Федеральные",
		regional: "Региональные",
		municipal: "Муниципальные",
		otherServices: "Услуги иных организаций",
	};

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			open = false;
		}
	}
	function handleClose() {
		open = false;
	}
</script>

<button class="btn btn-xs" on:click={() => (open = true)}>
	<svg use:inlineSvg={iconStore["mdi_pencil"]} />
	Редактировать связи услуг
</button>

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="backdrop"
		on:click={handleBackdropClick}
		use:portal={"body"}
		hidden
	>
		<dialog class="shadow-md fill-services" {open}>
			<header>
				<h1>Данные о связях услуг</h1>
				<button class="btn btn-xs btn-square" on:click={handleClose}>
					<svg use:inlineSvg={iconStore["mdi_close"]} />
				</button>
			</header>
			<div role="tablist" class="tabs tabs-bordered">
				{#each Object.keys($serviceBindings) as level, index}
					<button
						role="tab"
						class="tab"
						data-level={level}
						on:click={() => (currentLevel = level)}
						class:tab-active={currentLevel === level}>{titles[level]}</button
					>
				{/each}
			</div>
			{#each Object.keys($serviceBindings) as level, index}
				{#if currentLevel === level}
					<div class="content">
						<table class="table table-xs table-pin-rows">
							<thead>
								<tr>
									<th> Услуга в выгрузке </th>
									<th> Услуга в шаблоне </th>
									<th colspan="2" />
								</tr>
							</thead>
							<tbody>
								{#each Object.keys($serviceBindings[level]) as serviceName, index}
									{@const isEditing =
										Object.keys($serviceBindings[level][serviceName]).length ===
										0}
									<tr>
										<td>
											{serviceName}
										</td>
										<td colspan={isEditing ? 2 : 1}>
											{#if $serviceBindings[level][serviceName]?.match === "exact"}
												<span>Точное соответствие</span>
											{:else if $serviceBindings[level][serviceName]?.match !== undefined}
												<span
													>{$serviceBindings[level][serviceName]?.match}</span
												>
											{:else if $serviceBindings[level][serviceName]?.movedTo !== undefined}
												<span>
													Учитывается в шаблоне услуг
													{#if $serviceBindings[level][serviceName]?.movedTo === "otherServices"}
														иных организаций
													{:else}
														{$serviceBindings[level][serviceName]?.movedTo}
													{/if}
												</span>
											{:else if $serviceBindings[level][serviceName]?.blacklist}
												<span>Не учитывается в статистике</span>
											{:else}
												<BindService
													{serviceName}
													type={currentLevel}
													templateServices={Object.keys(
														$prefillData[currentLevel].services,
													)}
													hideLabel="true"
												/>
											{/if}
										</td>
										{#if !isEditing}
											<td>
												<button
													class="btn btn-xs btn-square"
													title="Редактировать связь"
													on:click={() => {
														$serviceBindings[level][serviceName] = {};
													}}
												>
													<svg use:inlineSvg={iconStore["mdi_pencil"]} />
												</button>
											</td>
										{/if}
										<td>
											<button
												class="btn btn-xs btn-square"
												title="Удалить данные об услуге"
												on:click={() => {
													delete $serviceBindings[level][serviceName];
													$serviceBindings = $serviceBindings;
												}}
											>
												<svg use:inlineSvg={iconStore["mdi_trash"]} />
											</button>
										</td></tr
									>
								{:else}
									<tr>
										<th colspan="4"
											>Нет данных. Сбор происходит при скачивании шаблонов</th
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{/each}
		</dialog>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		place-items: center;
		background-color: rgb(0 0 0 / 0.3);
	}
	dialog {
		overflow: clip;
		max-width: 95%;
		max-height: 95%;
		width: 95%;
		height: 95%;
		border: 0.5px solid lightgrey;
		padding: 1rem;
		display: flex;
		flex-flow: column nowrap;
	}
	header {
		font-weight: 700;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	table {
		margin-bottom: 1rem;
	}
	td:first-child {
		width: calc(50% - 2.5rem);
	}
</style>
