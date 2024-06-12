<script>
	import { Img } from 'flowbite-svelte';
	import listData from '../../store/grid-store.js';
	import { createEventDispatcher } from 'svelte';

	const onClickDispatch = createEventDispatcher();
</script>

{#each $listData as row (row.id)}
	<a
		rel="noopener noreferrer nofollow"
		target="listing_{row.id}"
		aria-labelledby="title_{row.id}"
		on:click={() => {
			onClickDispatch('onClicked', row);
		}}
		class=""
	>
		<div class="panel overflow-hidden rounded-lg border bg-white">
			<div class="relative" style="padding-bottom: 76.666667%">
				<Img
					src={row.image_url}
					alt="Listing"
					imgClass="absolute h-full w-full object-cover"
				/>
			</div>
			<div style="margin: 5%;">
				<p
					class="text-xs font-semibold uppercase tracking-wide text-gray-500"
				>
					{row.public_address}
				</p>
				<p class="text-base font-semibold text-gray-900">
					Lejlighed / 1 vær. / 35 m²
				</p>
				<p class="mt-1 truncate text-base text-gray-700">{row.title}</p>
				<p class="panel-rent mt-2 text-gray-800">
					<span class="font-semibold text-teal-600"
						>{row.monthly_rent}</span
					>
					<span class="text-sm text-gray-600">kr./måned</span>
				</p>
			</div>
		</div>
	</a>
{/each}

<style>
	.panel {
		margin-left: 5px;
		margin-right: 5px;
	}

	.panel-rent {
		text-align: right;
	}

	a {
		text-decoration: none;
	}
</style>
