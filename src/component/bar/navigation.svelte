<script lang="ts" type="module">
	import { onMount } from 'svelte';

	import { isFalsy } from '@poolofdeath20/util';

	import State from '../../store/state';
	import History from '../../store/history';
	import Pointer from '../../store/pointer';

	const traverseCount = {
		back: 0,
		next: 0,
	};

	let isFindingNew: undefined | boolean = undefined;

	const setLink = async (pointer: number) => {
		return (await Pointer.get()).add(pointer).then(async () => {
			return (await History.get()).at(pointer).then((link) => {
				link.ifSome(({ link }) => {
					State.get().setLink(link);
				});
			});
		});
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
			traverseCount.back = pointer;
		});

		await currentPointerAndCount().then(({ count, pointer }) => {
			traverseCount.next = count - 1 - pointer;
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

	export { isFindingNew };
</script>

<div id="container">
	<div id="buttons">
		<button
			disabled={isFalsy(traverseCount.back)}
			on:click={() => {
				currentPointer().then((pointer) => {
					if (traverseCount.back) {
						setLink(pointer - 1).then(updateCanTraverse);
					}
				});
			}}>Back ({traverseCount.back})</button
		>
		<button
			disabled={isFalsy(traverseCount.next)}
			on:click={() => {
				currentPointer().then((pointer) => {
					if (traverseCount.next) {
						setLink(pointer + 1).then(updateCanTraverse);
					}
				});
			}}
			>Next ({traverseCount.next})
		</button>
		<button
			on:click={() => {
				isFindingNew = true;

				State.get()
					.updateLink()
					.then(async (link) => {
						link.map((await History.get()).add).ifSome(
							async (list) => {
								list.then((list) => {
									return list.length - 1;
								})
									.then((await Pointer.get()).add)
									.then(updateCanTraverse)
									.then(() => {
										isFindingNew = false;
									});
							}
						);
					});
			}}>Find New</button
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
