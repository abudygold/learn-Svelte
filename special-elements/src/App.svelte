<script>
	import Product from './Product.svelte';
	import CartItem from './CartItem.svelte';
	import FamilyNode from './FamilyNode.svelte';

	let y;
	let title = 'My App';

	$: console.log(y);

	let familyStructure = [
		{
			isParent: true,
			name: 'Abdullah',
			children: [
				{
					isParent: true,
					name: 'Ibrahim',
					children: [
						{
							isParent: false,
							name: 'No Name'
						}
					]
				}
			]
		},
		{
			isParent: false,
			name: 'Hilwa'
		}
	]

	let renderComponent = {cmp: Product, title: 'Test Product', id: 'p1'};

	function toggle() {
		if (renderComponent.cmp === Product) {
			renderComponent = {cmp: CartItem, title: 'Another Product', id: 'p2'};
			return;
		}
		
		renderComponent = {cmp: Product, title: 'Test Product', id: 'p1'};
	}

	function switchTitle() {
		title = 'A New Title';
	}
</script>

<style>
	div {
		height: 3000px;
	}
</style>

<svelte:window bind:scrollY={y} />
<svelte:body on:mouseenter />

<svelte:head>
	<title>{title}</title>
</svelte:head>

<button on:click="{switchTitle}">Switch Title</button>

<div>
	<button on:click="{toggle}">Toggle Display</button>
	
	<svelte:component this="{renderComponent.cmp}"
		title="{renderComponent.title}"
		id="{renderComponent.id}" />
	
	{#each familyStructure as familyMember}
		<FamilyNode member={familyMember} />
	{/each}
</div>
