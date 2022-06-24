<script>
	import { onMount } from "svelte";
	let cpuUsage = 69;
	let ramUsage = 69;

	async function updateInfo() {
		cpuUsage = await eApi.hardware.cpuUsage();
			ramUsage = await eApi.hardware.ramUsage();
	}

	updateInfo();
	onMount(() => {
		setInterval(updateInfo, 2000);
	})
</script>

<div id="StatusBar">
	<div class="HardwareInfo">
		<span class="cpuUsage">
			{#if cpuUsage}
				CPU: {cpuUsage}%
			{:else}
				Error
			{/if}
		</span>
		<span class="ramUsage">
			{#if ramUsage && ramUsage.freeMemPercentage}
				RAM: {ramUsage.freeMemPercentage}%
			{:else}
				Error
			{/if}
		</span>
	</div>
</div>

<style>
	#StatusBar {
		user-select: none;
		display: block;
		height: var(--CodeEditorSBHeight);
		width: 100%;
		color: var(--fg);
		background-color: var(--bg2);
	}

	#StatusBar .HardwareInfo {
		float: right;
	}

	#StatusBar .HardwareInfo span {
		display: inline-block;
		margin-top: 0.42rem;
		margin-right: 0.5rem;
	}
</style>