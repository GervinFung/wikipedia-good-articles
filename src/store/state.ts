import { writable, type Writable } from 'svelte/store';

import { Optional } from '@poolofdeath20/util';

import { getArticle } from '../logic/get-article';

class State {
	private static readonly instance = new State({
		link: writable(Optional.none<string>()),
	});

	public static readonly get = () => {
		return this.instance;
	};

	private constructor(
		private readonly props: Readonly<{
			link: Writable<Optional<string>>;
		}>
	) {}

	readonly link = () => {
		return this.props.link;
	};

	readonly updateLink = async () => {
		return getArticle().then((link) => {
			this.link().set(link);

			return link;
		});
	};

	readonly setLink = (link: string | Optional<string>) => {
		return this.link().set(
			typeof link === 'string' ? Optional.some(link) : link
		);
	};
}

export default State;
