<script>
    import { createEventDispatcher } from 'svelte';
    import { scale } from 'svelte/transition';
    import meetups from '../../meetups-store';
    import Button from '../UI/component/Button.svelte';
    import Badge from '../UI/component/Badge.svelte';

    export let id;
    export let title;
    export let subTitle;
    export let imageUrl;
    export let description;
    export let address;
    export let email;
    export let isFav;

    const dispatch = createEventDispatcher();

    function toggleFavorite() {
      fetch(`https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/meetups/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({isFavorite: !isFav}),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then((resp) => {
        if (!resp.ok) {
            throw new Error('An error occured, please try again!');
        }

        meetups.toggleFavorite(id);
      }).catch((err) => console.log(err));
    }
</script>

<style>
    article {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
      border-radius: 5px;
      background: white;
      margin: 1rem;
    }
  
    header,
    .content,
    footer {
      padding: 1rem;
    }
  
    .image {
      width: 100%;
      height: 14rem;
    }
  
    .image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    h1 {
      font-size: 1.25rem;
      margin: 0.5rem 0;
      font-family: "Roboto Slab", sans-serif;
    }
  
    h1.is-favorite {
      background: #01a129;
      color: white;
      padding: 0 0.5rem;
      border-radius: 5px;
    }
  
    h2 {
      font-size: 1rem;
      color: #808080;
      margin: 0.5rem 0;
    }
  
    p {
      font-size: 1.25rem;
      margin: 0;
    }
  
    div {
      text-align: right;
    }

    .content {
        height: 4rem;
    }
</style>

<article transition:scale>
    <header>
        <h1>
            {title}
            {#if isFav}
              <Badge>Favorite</Badge>
            {/if}
        </h1>
        <h2>{subTitle}</h2>
        <p>{address}</p>
    </header>

    <div class="image">
        <img src="{imageUrl}" alt="">
    </div>

    <div class="content">
        <p>{description}</p>
    </div>

    <footer>
        <Button mode="outline" type="button" on:click={() => dispatch('edit', id)}>Edit</Button>

        <Button href='mailto:{email}'>Contact</Button>
            
        <Button
          mode='outline'
          color='{isFav ? null : 'success'}'
          type='button'
          on:click={toggleFavorite}>
          {isFav ? 'Unfavorite' : 'Favorite'}
        </Button>

        <!-- <Button type='button' on:click={() => dispatch('showdetails', id)}>Show Details</Button> -->
        <Button href="/{id}">Show Details</Button>
    </footer>
</article>
