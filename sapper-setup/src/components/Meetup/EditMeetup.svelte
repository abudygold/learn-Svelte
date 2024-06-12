<script>
    import meetups from '../../meetups-store';
    import { createEventDispatcher } from 'svelte';
	import TextInput from '../UI/component/TextInput.svelte';
	import Button from '../UI/component/Button.svelte';
    import Modal from '../UI/dialog/Modal.svelte';
    import { isEmpty, isValidEmail } from '../../helpers/validation';

    export let id = null;

    let title = '';
    let subTitle = '';
    let address = '';
    let email = '';
    let description = '';
    let imageUrl = '';

    if (id) {
        const unsubscribe = meetups.subscribe(items => {
            const selectedMeetup = items.find(i => i.id === id);

            title = selectedMeetup.title;
            subTitle = selectedMeetup.subTitle;
            address = selectedMeetup.address;
            email = selectedMeetup.contactEmail;
            description = selectedMeetup.description;
            imageUrl = selectedMeetup.imageUrl;
        });

        unsubscribe();
    }

    const dispatch = createEventDispatcher();

    $: titleValid = !isEmpty(title);
    $: subTitleValid = !isEmpty(subTitle);
    $: addressValid = !isEmpty(address);
    $: descriptionValid = !isEmpty(description);
    $: imageUrlValid = !isEmpty(imageUrl);
    $: emailValid = isValidEmail(email);
    $: formIsValid = 
        titleValid &&
        subTitleValid &&
        addressValid &&
        descriptionValid &&
        imageUrlValid &&
        emailValid;

    function submitForm() {
        const meetupData = {
            title: title,
            subTitle: subTitle,
            description: description,
            imageUrl: imageUrl,
            contactEmail: email,
            address: address,
        };

        if (id) {
            fetch(`https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/meetups/${id}.json`, {
                method: 'PATCH',
                body: JSON.stringify(meetupData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error('An error occured, please try again!');
                }

                meetups.updateMeetup(id, meetupData);
            }).catch((err) => console.log(err))
        } else {
            fetch('https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/meetups.json', {
                method: 'POST',
                body: JSON.stringify({...meetupData, isFavorite: false}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error('An error occured, please try again!');
                }

                return resp.json();
            }).then((data) => {
                meetups.addMeetup({...meetupData, isFavorite: false, id: data.name});
            }).catch((err) => console.log(err));
        }

        dispatch('save')
    }

    function deleteMeetup() {
        fetch(`https://svelte-course-97cff-default-rtdb.asia-southeast1.firebasedatabase.app/meetups/${id}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            meetups.deleteMeetup(id);
        }).catch((err) => console.log(err));
        
        dispatch('save');
    }

    function cancel() {
        dispatch('cancel');
    }
</script>

<style>
	form {
		width: 100%;
	}
</style>

<Modal title="{id ? 'Edit Meetup Data' : 'Add Meetup Data'}" on:cancel>
    <form autocomplete="off"
        on:submit|preventDefault="{submitForm}">
        <TextInput
            id='title'
            label='Title'
            valid={titleValid}
            validityMessage='Please enter a valid title.'
            value={title}
            on:input={event => (title = event.target.value)} />

        <TextInput
            id='subTitle'
            label='Sub Title'
            valid={subTitleValid}
            validityMessage='Please enter a valid sub title.'
            value={subTitle}
            on:input={event => (subTitle = event.target.value)} />

        <TextInput
            id='address'
            label='Address'
            valid={addressValid}
            validityMessage='Please enter a valid address.'
            value={address}
            on:input={event => (address = event.target.value)} />

        <TextInput
            id='imageUrl'
            label='Image URL'
            valid={imageUrlValid}
            validityMessage='Please enter a valid image url.'
            value={imageUrl}
            on:input={event => (imageUrl = event.target.value)} />

        <TextInput
            id='email'
            label='E-Mail'
            type='email'
            valid={emailValid}
            validityMessage='Please enter a valid email address.'
            value={email}
            on:input={event => (email = event.target.value)} />

        <TextInput
            id='description'
            label='Description'
            valid={descriptionValid}
            validityMessage='Please enter a valid description.'
            controlType="textarea"
            bind:value={description} />
    </form>
    
    <div slot="footer">
        <Button type="button"
            mode="outline"
            on:click={cancel}>Cancel</Button>

        <Button type="button"
            on:click={submitForm}
            disabled="{!formIsValid}">Save</Button>

        {#if id}
            <Button type="button"
                on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>