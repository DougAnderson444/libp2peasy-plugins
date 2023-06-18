<script>
	export let data;
</script>

<div class="flex-basis-full flex-row border border-dashed border-current my-2 p-2 rounded-sm">
	<slot />
	{#if data && data.length > 0}
		{#each data as item}
			<div class="flex-1 flex-row">{item}</div>
		{/each}
	{/if}
</div>
