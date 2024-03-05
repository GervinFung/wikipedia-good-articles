<script lang="ts">
	import State from '../store/state';

	let link = '';

	State.get()
		.link()
		.subscribe((value) => {
			link = value.unwrapOrGet('');
		});
</script>

{#if link}
	<iframe title="Wikipedia | Good Articles" src={link}>
		Your webview doesn't support iframes
	</iframe>
{:else}
	<div>
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

	div {
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
