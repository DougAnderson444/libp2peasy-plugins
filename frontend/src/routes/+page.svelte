<script>
</script>

<!--
    // Closest tailwindcss color to #41FF00 would be
   -->
<main class="flex flex-col h-screen p-2 bg-neutral-800 text-[#41FF00] font-mono">
	<div class="flex-1">
		<h1 class="text-4xl font-semibold">Libp2peasy 🍋✊ Plugins Demo</h1>
	</div>
	<!-- Two column Flex Layout, Plugins on the left and activity on the right -->
	<div class="flex flex-row h-full border-dashed border-current border">
		<div class="flex flex-row">Plugin</div>
		<div class="flex-1 flex-row bg-green-50/10">Activity</div>
	</div>
	<div class="flex flex-row h-full border-dashed border-current border">
		<div class="flex-1 flex-row">Plugin</div>
		<div class="flex-1 flex-row">Activity</div>
	</div>
	<div class="flex flex-row border-dashed border-current border">
		<div class="flex-1 flex-row">Add Plugin from IPFS</div>
	</div>
</main>

<style>
	div {
		@apply m-1 p-2;
		/* background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%2310FD3EFF' stroke-width='2' stroke-dasharray='6%2c 24' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e"); */
	}
</style>
