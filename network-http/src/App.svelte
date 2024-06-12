<script>
	import { onMount } from 'svelte';
	import hobbyStore from './hobby-store';

	let hobbyInput;
	let isLoading = false;

	onMount(() => {
		isLoading = true;
		fetch('https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/hobbies.json')
			.then(resp => {
				if (!resp.ok) {
					throw new Error('Failed!');
				}

				return resp.json();
			}).then(data => {
				const hobbies = Object.values(data);
				hobbyStore.setHobbies(hobbies);
				
				isLoading = false;

				return hobbies;
			}).catch(err => {
				console.log(err);
				isLoading = false;
			});
	});

	function addHobby() {
		hobbyStore.addHobby(hobbyInput.value);

		isLoading = true;

		fetch('https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/hobbies.json', {
			method: 'POST',
			body: JSON.stringify(hobbyInput.value),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(resp => {
			if (!resp.ok) {
				throw new Error('Failed!');
			}

			isLoading = false;
			alert('Saved Data!');
			// ...
		}).catch(err => {
			console.log(err);
			isLoading = false;
		})
	}
</script>

<label for="hobby">Hobby</label>
<input type="text" id="hobby" bind:this="{hobbyInput}" />
<button on:click="{addHobby}">Add Hobby</button>

{#if isLoading}
	<p>Loading...</p>
{:else}
	<ul>
		{#each $hobbyStore as hobby}
			<li>{hobby}</li>
		{/each}
	</ul>
{/if}
