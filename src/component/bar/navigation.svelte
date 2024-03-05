<script lang="ts" type="module">
	import { onMount } from 'svelte';

	import { isFalsy } from '@poolofdeath20/util';

	import State from '../../store/state';
	import History from '../../store/history';
	import Pointer from '../../store/pointer';

	const setLink = async (pointer: number) => {
		return (await Pointer.get()).add(pointer).then(async () => {
			return (await History.get()).at(pointer).then((link) => {
				link.ifSome(({ link }) => {
					State.get().setLink(link);
				});
			});
		});
	};

	const traverseCount = {
		left: 0,
		right: 0,
	};

	const currentPointer = async () => {
		return (await Pointer.get()).pointer().then((pointer) => {
			return pointer
				.map(({ pointer }) => {
					return pointer;
				})
				.unwrapOrGet(0);
		});
	};

	const currentPointerAndCount = async () => {
		return currentPointer().then(async (pointer) => {
			return (await History.get()).count().then((count) => {
				return {
					count,
					pointer,
				};
			});
		});
	};

	const updateCanTraverse = async () => {
		await currentPointerAndCount().then(({ pointer }) => {
			traverseCount.left = pointer;
		});

		await currentPointerAndCount().then(({ count, pointer }) => {
			traverseCount.right = count - 1 - pointer;
		});
	};

	const updateLink = async () => {
		return State.get()
			.updateLink()
			.then(async (link) => {
				link.map((await History.get()).add).ifSome(async (list) => {
					list.then((list) => {
						return list.length - 1;
					})
						.then((await Pointer.get()).add)
						.then(updateCanTraverse);
				});
			});
	};

	onMount(async () => {
		if (await (await History.get()).isEmpty()) {
			await updateLink();
		} else {
			await currentPointer().then(setLink).then(updateCanTraverse);
		}
	});
</script>

<div id="container">
	<div id="buttons">
		<button
			disabled={isFalsy(traverseCount.left)}
			on:click={() => {
				currentPointer().then((pointer) => {
					if (traverseCount.left) {
						setLink(pointer - 1).then(updateCanTraverse);
					}
				});
			}}>Left ({traverseCount.left})</button
		>
		<button
			disabled={isFalsy(traverseCount.right)}
			on:click={() => {
				currentPointer().then((pointer) => {
					if (traverseCount.right) {
						setLink(pointer + 1).then(updateCanTraverse);
					}
				});
			}}
			>Right ({traverseCount.right})
		</button>
		<button
			on:click={() => {
				State.get()
					.updateLink()
					.then(async (link) => {
						link.map((await History.get()).add).ifSome(
							async (list) => {
								list.then((list) => {
									return list.length - 1;
								})
									.then((await Pointer.get()).add)
									.then(updateCanTraverse);
							}
						);
					});
			}}>Next</button
		>
	</div>
</div>

<style>
	#container {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		border-bottom: 1px solid #121212;
	}

	#buttons {
		display: flex;
		gap: 24px;
		margin-bottom: 8px;
	}

	button {
		font-family: 'Courier New', Courier, monospace;
		padding: 8px 16px;
		border: 1px solid #121212;
		border-radius: 4px;
		background-color: transparent;
		cursor: pointer;
	}

	button:hover {
		background-color: whitesmoke;
	}
</style>
