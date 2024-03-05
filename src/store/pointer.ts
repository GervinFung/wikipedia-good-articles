import { Store } from 'tauri-plugin-store-api';

import { appCacheDir } from '@tauri-apps/api/path';

import {
	array,
	nullable,
	number,
	object,
	parse,
	string,
	transform,
} from 'valibot';

import { Optional, type DeepReadonly } from '@poolofdeath20/util';

class Pointer {
	private static readonly generate = async () => {
		return new this({
			key: 'pointer',
			store: await appCacheDir().then((directory) => {
				return new Store(`${directory}/pointer.json`);
			}),
		});
	};

	private static readonly instance = this.generate();

	public static readonly get = () => {
		return this.instance;
	};

	private constructor(
		private readonly props: DeepReadonly<{
			store: Store;
			key: 'pointer';
		}>
	) {}

	private readonly store = () => {
		return this.props.store;
	};

	private readonly key = () => {
		return this.props.key;
	};

	private readonly parse = (history: unknown) => {
		return parse(
			transform(
				nullable(
					array(
						object({
							pointer: number(),
							createdAt: transform(string(), (value) => {
								return new Date(value);
							}),
						})
					)
				),
				(value) => {
					return value ?? [];
				}
			),
			history
		);
	};

	private readonly get = async () => {
		return this.store().get(this.key()).then(this.parse);
	};

	private readonly set = (pointer: number) => {
		return async (
			histories: DeepReadonly<
				{
					pointer: number;
					createdAt: Date;
				}[]
			>
		) => {
			return this.store().set(
				this.key(),
				histories.concat({
					pointer,
					createdAt: new Date(),
				})
			);
		};
	};

	// development only
	readonly clear = async () => {
		return this.store().clear();
	};

	readonly pointer = async () => {
		return this.get()
			.then((histories) => {
				return histories.at(-1);
			})
			.then(Optional.from);
	};

	readonly add = async (pointer: number) => {
		return this.get()
			.then(this.set(pointer))
			.then(this.save)
			.then(this.get);
	};

	readonly save = async () => {
		return this.store().save();
	};
}

export default Pointer;
