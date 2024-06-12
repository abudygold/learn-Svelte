import { writable } from 'svelte/store';

const meetups = writable([]);

const customMeetups = {
    subscribe: meetups.subscribe,
    setMeetups: (meetupsData) => {
        meetups.set(meetupsData);
    },
    addMeetup: (meetupData) => {
        const newMeetup = {...meetupData};

        meetups.update((items) => {
            return [newMeetup, ...items];
        });
    },
    updateMeetup: (id, meetupData) => {
        meetups.update((items) => {
            const meetupIndex = items.findIndex(i => i.id === id);
            const updatedMeetup = { ...items[meetupIndex], ...meetupData };
            const updatedMeetups = [...items];
            
            updatedMeetups[meetupIndex] = updatedMeetup;

            return updatedMeetups;
        })
    },
    deleteMeetup: (id) => {
        meetups.update((items) => {
            return items.filter(i => i.id !== id);
        });
    },
    toggleFavorite: (id) => {
        meetups.update((items) => {
            const meetupIndex = items.findIndex((meetup) => meetup.id === id);
            const updatedMeetups = [...items];

            updatedMeetups[meetupIndex].isFavorite = !updatedMeetups[meetupIndex].isFavorite;

            return updatedMeetups;
        })
    }
}

export default customMeetups;
