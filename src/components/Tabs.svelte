<script>
	import { onMount } from "svelte";
	export let items = [];
	export let activeTabIndex = 0;
	export let onChange = () => {}

	var handleClick = () => {}

	onMount(() => {
		handleClick = (currIndex) => {
			activeTabIndex = currIndex;
			onChange(currIndex);
		}
	})
</script>

<ul>
{#each items as item, index}
	<li class={index === activeTabIndex ? 'active' : ''}>
		<span on:click={handleClick(index)}>{item.fileName}</span>
	</li>
{/each}
</ul>

<style>
	ul {
		height: var(--CodeEditorTabHeight);
		background-color: #333;
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
	}

	li {
		margin-bottom: -1px;
	}

	span {
		border: 1px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.35rem 1rem;
		cursor: pointer;
		color: #fff;
		background-color: #444;
	}

	span:hover {
		border-color: #777;
	}

	li.active > span {
		background-color: #555;
		border-color: #777;
	}
</style>