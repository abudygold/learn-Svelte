<script>
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import listData from '../../store/grid-store.js';

	/**
	 * @type {HTMLDivElement}
	 */
	let mapElement;
	/**
	 * @type {{ openPopup: (arg0: string, arg1: any[]) => void; remove: () => void; }}
	 */
	let map;
	/**
	 * @type {string | any[]}
	 */
	let lists;

	/**
	 * @type {{ image_url: any; public_address: any; monthly_rent: any; title: any; latitude: any; longitude: any; }}
	 */
	export let list;

	const unsubscribe = listData.subscribe(resp => {
		lists = resp;
	});

	$: if (map && list) {
		map.openPopup(
			// @ts-ignore
			htmlPopup(list),
			[list.latitude, list.longitude]
		);
	}

	/**
	 * @param {{ image_url: any; public_address: any; monthly_rent: any; title: any; latitude: any; longitude: any; }} _data
	 */
	function htmlPopup(_data) {
		return `
			<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md flex max-w-sm flex-col p-0">
				<img class="rounded-t-lg" src="${_data.image_url}" alt="product 1">
				
				<div class="flex flex-row pt-3 px-3">
					<div class="basis-8/12">
						<p class="text-xs font-semibold truncate tracking-wide" style="margin: 0;">
							${_data.public_address}
						</p>
					</div>
					<div class="basis-4/12">
						<span class="fa fa-star"></span>
						4.48 (286)
					</div>
				</div>
				
				<p class="mt-1 truncate text-sm text-gray-700 px-3" style="margin: 0;">
					${_data.title}
				</p>
				<p class="mt-2 pb-3 px-3" style="margin: 0;">
					<span class="text-xs text-gray-500 line-through">${_data.monthly_rent} kr DKK</span>
					<span class="text-xs font-semibold">${_data.monthly_rent} kr DKK night</span>
					<span class="m-auto">.</span>
					<span class="text-xs">Dec 20 - 25</span>
				</p>
			</div>
		`;
	}

	onMount(async () => {
		if (browser) {
			// @ts-ignore
			const leaflet = await import('leaflet');

			map = leaflet.map(mapElement).setView([55.6761, 12.5683], 13);

			leaflet
				.tileLayer(
					'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					{
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					}
				)
				.addTo(map);

			for (let i = 0; i <= lists.length; i++) {
				const century21icon = leaflet.divIcon(
					{
						className: 'my-div-icon',
						html: `<b>${lists[i].monthly_rent} kr DKK</b>`,
					}
					// {
					// iconUrl: 'https://i.ibb.co/sJrMTdz/favicon-32x32.png',
					// iconUrl: lists[i].monthly_rent,
					// iconSize: [20, 20],

					// }
				);

				leaflet
					.marker([lists[i].latitude, lists[i].longitude], {
						icon: century21icon,
					})
					.addTo(map)
					.bindPopup(htmlPopup(lists[i]));
			}
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<!-- <CardMap item={list} /> -->

<main>
	<div bind:this={mapElement} />
</main>

<style>
	@import '../../../node_modules/leaflet/dist/leaflet.css';
	main div {
		height: 800px;
	}

	:global(.leaflet-popup-content) {
		/* this will apply to <body> */
		margin: 0;
	}

	:global(.my-div-icon) {
		padding: 5px;
		min-width: 100px;
		width: auto !important;
		height: auto !important;
		background-color: white;
		border-radius: 15px;
		text-align: center;
	}
</style>
