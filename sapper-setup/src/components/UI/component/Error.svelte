<script>
    import Modal from '../dialog/Modal.svelte';

    export let message;
</script>

<Modal title="An error occured!" on:cancel>
    <p>{message}</p>
</Modal>
