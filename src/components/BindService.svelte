<script>
	import { createCombobox, melt } from "@melt-ui/svelte";
	import { fly } from "svelte/transition";
	import { serviceBindings } from "../stores";
	import { inlineSvg } from "@svelte-put/inline-svg";
	import { iconStore } from "../icon-store";

	export let serviceName = "";
	export let templateServices = [];
	export let type = "";
	export let hideLabel = false;

	function toOption(service) {
		return {
			value: service !== serviceName ? service : 'exact',
			label: service,
		};
	}

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected },
	} = createCombobox({ forceVisible: true });

	$: if (!$open) {
		$inputValue = $selected?.label ?? "";
	}

	$: unbindedServices = templateServices.filter(
		(service) =>
			(!$serviceBindings[type][service] || Object.keys($serviceBindings[type][service]).length === 0) &&
			Object.keys($serviceBindings[type]).findIndex(
				(key) => $serviceBindings[type][key].match === service,
			) === -1,
	);

	$: filteredServices = $touchedInput
		? unbindedServices.filter((service) => {
				const normalizedInput = $inputValue.toLowerCase();
				return service.toLowerCase().includes(normalizedInput);
			})
		: unbindedServices;

	function handleBind() {
		if ($selected.value === "blacklist") {
			$serviceBindings[type][serviceName] = {
				blacklist: true,
			};
		} else if ($selected.value === "other") {
			$serviceBindings[type][serviceName] = {
				movedTo: "otherServices",
			};
		} else {
			$serviceBindings[type][serviceName] = {
				match: $selected.value,
			};
		}
	}
</script>

<div class="flex flex-col gap-1">
	{#if !hideLabel}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label use:melt={$label}>
			<span>{serviceName}</span>
		</label>
	{/if}

	<div class="combobox">
		<div class="input-wrap">
			<input
				use:melt={$input}
				class="flex items-center justify-between w-full pr-12 rounded-sm input input-sm input-bordered"
				placeholder="Выберите соответствующую услугу из шаблона:"
			/>
			<div class="absolute z-10 -translate-y-1/2 right-2 top-1/2">
				{#if $open}
					<svg use:inlineSvg={iconStore["mdi_chevron-up"]} class="icon-xs" />
				{:else}
					<svg use:inlineSvg={iconStore["mdi_chevron-down"]} class="icon-xs" />
				{/if}
			</div>
		</div>
		{#if $selected}
			<div class="binding-controls">
				<button class="btn btn-xs btn-square btn-ghost" on:click={handleBind} title="Сохранить">
					<svg use:inlineSvg={iconStore["mdi_content-save"]} />
				</button>
				<button
					class="btn btn-xs btn-square btn-ghost"
					on:click={() => ($selected = undefined)}
					title="Отмена"
				>
					<svg use:inlineSvg={iconStore["mdi_close"]} />
				</button>
			</div>
		{/if}
	</div>
</div>

{#if $open}
	<ul
		use:melt={$menu}
		class="bind-menu"
		transition:fly={{ duration: 150, y: -5 }}
	>
		<div class="list-wrap">
			<li
				class="option stray-service"
				use:melt={$option({
					disabled: true,
				})}
			>
				{serviceName}
			</li>
			<li
				class="option"
				use:melt={$option({
					value: "blacklist",
					label: "Не учитывается в статистике",
				})}
			>
				{#if $isSelected("blacklist")}
					<div class="check">
						<svg use:inlineSvg={iconStore["mdi_check"]} class="icon-xs" />
					</div>
				{/if}
				Не учитывается в статистике
			</li>
			{#if type === "federal"}
				<li
					use:melt={$option({
						value: "other",
						label: "Учитывается в шаблоне услуг иных организаций",
					})}
					class="option"
				>
					{#if $isSelected("other")}
						<div class="check">
							<svg use:inlineSvg={iconStore["mdi_check"]} class="icon-xs" />
						</div>
					{/if}
					Учитывается в шаблоне услуг иных организаций
				</li>
			{/if}
			{#each filteredServices as service, index}
				<li class="option" use:melt={$option(toOption(service))}>
					{#if $isSelected(service)}
						<div class="check">
							<svg use:inlineSvg={iconStore["mdi_check"]} class="icon-xs" />
						</div>
					{/if}
					{service}
				</li>
			{/each}
		</div>
	</ul>
{/if}

<style>
	.combobox {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	.binding-controls {
		display: flex;
		flex-flow: row nowrap;
		flex-shrink: 0;
		gap: 0.25rem;
		padding-left: 0.5rem;
	}
	.input-wrap {
		position: relative;
		flex-grow: 1;
	}
	input:focus {
		outline: 2px solid var(--fallback-s, oklch(var(--s) / 0.5));
		outline-offset: -1px;
	}
	.bind-menu {
		z-index: 10;
		display: flex;
		flex-flow: column nowrap;
		border-radius: 0.125rem;
		max-height: 24rem;
		overflow: clip;
		background-color: var(--fallback-b1, oklch(var(--b1)));
		box-shadow: var(--fallback-bc, oklch(var(--bc) / 0.2)) 0px 2px 8px 0px;
		border: 0.5px solid var(--fallback-bc, oklch(var(--bc) / 0.125));
		border-radius: 0.5rem;
	}
	.list-wrap {
		padding: 0.5rem;
		overflow-y: auto;
	}
	li.option {
		position: relative;
		padding: 0.5rem 1rem 0.5rem 2rem;
		border-radius: 0.25rem;
		cursor: default;
		user-select: none;
	}
	li.option.stray-service {
		opacity: 0.65;
		font-weight: 700;
	}
	li.option:not(.stray-service):hover {
		background-color: var(--fallback-s, oklch(var(--s) / 0.15));
	}
	.check {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		translate: 0 -50%;
	}
</style>
