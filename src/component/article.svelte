<script lang="ts">
	import State from '../store/state';

	let src = '';

	let isFindingNew: undefined | boolean = undefined;

	State.get()
		.link()
		.subscribe((value) => {
			src = value.unwrapOrGet('');
		});

	export { isFindingNew };
</script>

{#if src}
	{#if isFindingNew}
		<div id="loader">
			<p>Finding another good articles...</p>
		</div>
	{:else}
		<iframe title="Wikipedia | Good Articles" {src}>
			Your webview doesn't support iframes
		</iframe>
	{/if}
{:else}
	<div id="container">
		<img alt="Wikipedia Logo" src="/icons/wikipedia.png" />
		<p>Wikipedia | Good Articles</p>
	</div>
{/if}

<style>
	iframe {
		position: fixed;
		top: 55px;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		border: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	#loader {
		position: fixed;
		top: 55px;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		border: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80vh;
		gap: 36px;
	}

	img {
		width: 100px;
		height: 100px;
	}

	p {
		font-family: 'Courier New', Courier, monospace;
		font-size: 1.5em;
	}
</style>
