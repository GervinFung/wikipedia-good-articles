<script lang="ts">
	import Navigation from '../component/bar/navigation.svelte';
	import Article from '../component/article.svelte';

	let isFindingNew = true;
</script>

<main>
	<Navigation bind:isFindingNew />
	<Article bind:isFindingNew />
</main>
