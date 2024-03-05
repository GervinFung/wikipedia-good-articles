import { Store } from 'tauri-plugin-store-api';

import { appCacheDir } from '@tauri-apps/api/path';

import { array, nullable, object, parse, string, transform } from 'valibot';

import { Optional, type DeepReadonly } from '@poolofdeath20/util';

class History {
	private static readonly generate = async () => {
		return new this({
			key: 'history',
			store: await appCacheDir().then((directory) => {
				return new Store(`${directory}/history.json`);
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
			key: 'history';
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
							link: string(),
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

	private readonly set = (link: string) => {
		return async (
			histories: DeepReadonly<
				{
					link: string;
					createdAt: Date;
				}[]
			>
		) => {
			return this.store().set(
				this.key(),
				histories.concat({
					link,
					createdAt: new Date(),
				})
			);
		};
	};

	// development only
	readonly clear = async () => {
		return this.store().clear();
	};

	readonly at = async (index: number) => {
		return this.get()
			.then((histories) => {
				return histories.at(index);
			})
			.then(Optional.from);
	};

	readonly add = async (link: string) => {
		return this.get().then(this.set(link)).then(this.save).then(this.get);
	};

	readonly save = async () => {
		return this.store().save();
	};

	readonly count = async () => {
		return this.get().then((histories) => {
			return histories.length;
		});
	};

	readonly isEmpty = async () => {
		return this.count().then((c) => c === 0);
	};
}

export default History;
