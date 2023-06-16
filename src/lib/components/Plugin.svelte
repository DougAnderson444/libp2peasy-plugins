<script>
	// ttodo
</script>

<!-- Two column Flex Layout, Plugins on the left and activity on the right -->
<div class="flex flex-row w-full border-dashed border-current border">
	<div class="flex-initial flex-row">
		Plugin
		<slot name="meta" />
	</div>
	<div class="flex-1 flex-row bg-green-50/10">
		Activity
		<slot name="activity" />
	</div>
</div>

<style>
	div {
		@apply p-1;
	}
</style>
