<script>
	import { onMount } from "svelte";
	export let items = [];
	export let activeTabIndex = 0;
	export let onChange = () => {}

	var handleClick = () => {}

	onMount(() => {
		console.log("Tabs Mounted...")
		handleClick = (currIndex) => {
			activeTabIndex = currIndex;
			onChange(currIndex);
		}
	})
</script>

<ul>
{#each items as item, index}
	<li class={`${item.isSaved == true ? '' : 'italic'}${index == activeTabIndex ? ' active' : ''}`}>
		<span on:click={handleClick(index)}>{item.fileName}</span>
	</li>
{/each}
</ul>

<style>
	ul {
		height: var(--CodeEditorTabHeight);
		background-color: var(--bg);
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
	}

	li {
		font-style: normal;
		position: relative;
		margin-bottom: -1px;
	}

	li.italic {
		font-style: italic;
	}

	span {
		border: 1px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.35rem 1rem;
		cursor: pointer;
		color: var(--fg);
		background-color: var(--bg);
		transition: color 0.1s linear;
	}

	span:hover {
		border-color: var(--bg2);
	}

	li.active > span {
		background-color: var(--bg1);
		border-color: var(--bg2);
	}
</style>