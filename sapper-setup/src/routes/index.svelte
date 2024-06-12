<script context="module">
    export async function preload(page) {
        return this.fetch('https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/meetups.json')
			.then((resp) => {
				if (!resp.ok) {
					throw new Error('Fetching meetups failed, please try again later!');
				}

				return resp.json();
			}).then((data) => {
				const meetupsData = Object.values(data);
				const meetupsKeys = Object.keys(data);
				const fetchedMeetups = meetupsData.map((meetup, idx) => {
					return {...meetup, id: meetupsKeys[idx]};
				});

                return { fetchedMeetups: fetchedMeetups.reverse() };
			}).catch((err) => {
				errorMessage = err;
				isLoading = false;
                this.error(500, 'Could not fetch meetups!');
			})
    }
</script>

<script>
    import { onMount, onDestroy } from 'svelte';
    import { scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import meetups from '../meetups-store';
    import MeetupItem from '../components/Meetup/MeetupItem.svelte';
    import MeetupFilter from '../components/Meetup/MeetupFilter.svelte';
    import Button from '../components/UI/component/Button.svelte';
    import EditMeetup from '../components/Meetup/EditMeetup.svelte';
    import LoadingSpinner from '../components/UI/component/LoadingSpinner.svelte';

    export let fetchedMeetups;

	let editMode;
	let editedId;
    let isLoading;
    let unsubscribe;

    let favsOnly = false;

    $: filterMeetups = favsOnly
        ? fetchedMeetups.filter(m => m.isFavorite)
        : fetchedMeetups;

    onMount(() => {
        meetups.setMeetups(fetchedMeetups);
        unsubscribe = meetups.subscribe((items) => {
            fetchedMeetups = items;
        });
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    })

    function setFilter(event) {
        favsOnly = event.detail === 1;
    }

    function savedMeetup(event) {
        editMode = null;
        editedId = null;
    }

    function closeModal() {
        editMode = null;
        editedId = null;
    }

    function startEdit(event) {
        editMode = 'edit';
        editedId = event.detail;
    }

    function startAdd() {
        editMode = 'edit';
    }
</script>

<style>
    #meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    #meetup-controls {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    #no-meetups {
        margin: 1rem;
    }

    @media (min-width: 768px) {
        #meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>

<svelte:head>
	<title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
    <EditMeetup id={editedId}
        on:save={savedMeetup}
        on:cancel={closeModal} />
{/if}

{#if isLoading}
    <LoadingSpinner />
{:else}
    <section id="meetup-controls">
        <MeetupFilter on:select={setFilter} />
        
        <Button on:click="{startAdd}">New Meetup</Button>
    </section>

    {#if !filterMeetups.length}
        <p id="no-meetups">No meetup found, you can start adding some.</p>
    {/if}
    <section id="meetups">
        {#each filterMeetups as meetup (meetup.id)}
            <div transition:scale animate:flip={{ duration: 300 }}>
                <MeetupItem 
                    id={meetup.id}
                    title={meetup.title}
                    subTitle={meetup.subTitle}
                    imageUrl={meetup.imageUrl}
                    description={meetup.description}
                    address={meetup.address}
                    email={meetup.contactEmail}
                    isFav={meetup.isFavorite}
                    on:edit={startEdit} />
                    <!-- on:showdetails -->
            </div>
        {/each}
    </section>
{/if}
