<script context="module">
    export async function preload(page) {
        const meetupId = page.params.id;

        return this.fetch(`https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/meetups/${meetupId}.json`)
			.then((resp) => {
				if (!resp.ok) {
					throw new Error('Fetching meetups failed, please try again later!');
				}

				return resp.json();
			}).then((meetupData) => {
                return { loadedMeetup: { ...meetupData, id: meetupId } }
			}).catch(() => {
                this.error(404, 'Could not fetch meetups!');
			})
    }
</script>

<script>
    import meetups from '../meetups-store';
    import Button from '../components/UI/component/Button.svelte';

    export let loadedMeetup;
</script>

<style>
    section {
        margin-top: 4rem;
    }

    .image {
        width: 100%;
        height: 25rem;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image {
        background: #e7e7e7;
    }

    .content {
        text-align: center;
        width: 80%;
        margin: auto;
    }

    h1 {
        font-size: 2rem;
        font-family: 'Roboto Slab', sans-serif;
        margin: 0.5rem 0;
    }

    h2 {
        font-size: 1.25rem;
        color: #6b6b6b;
    }

    p {
        font-size: 1.5rem;
    }

</style>

<section>
    <div class="image">
        <img
            src="{loadedMeetup.imageUrl}"
            alt="{loadedMeetup.title}">
    </div>

    <div class="content">
        <h1>{loadedMeetup.title}</h1>
        <h2>{loadedMeetup.subTitle} - {loadedMeetup.address}</h2>
        <p>{loadedMeetup.description}</p>

        <Button href="mailto:{loadedMeetup.contactEmail}">Contact</Button>
        <Button mode="outline" href="/">Close</Button>
    </div>
</section>
