import { Optional } from '@poolofdeath20/util';
import { fetch, ResponseType } from '@tauri-apps/api/http';

const getArticle = async () => {
	return fetch(
		'https://en.wikipedia.org/wiki/Special:RandomInCategory/Good_articles',
		{
			body: undefined,
			method: 'GET',
			responseType: ResponseType.Text,
		}
	)
		.then((response) => {
			switch (response.ok) {
				case false: {
					return Optional.none<string>();
				}
				case true: {
					switch (typeof response.data) {
						case 'string': {
							return Optional.some(response.data);
						}
						default: {
							throw new Error(
								`Invalid response type of "${typeof response.data}" for Wikipedia Good Articles`
							);
						}
					}
				}
			}
		})
		.then((data) => {
			return data
				.flatMap((data) => {
					return Optional.from(
						data.split('\n').find((line) => {
							return line.startsWith(
								'<link rel="canonical" href="https://en.wikipedia.org/wiki'
							);
						})
					);
				})
				.flatMap((data) => {
					return Optional.from(data.split(' ').at(-1));
				})
				.flatMap((data) => {
					return Optional.from(data.split('=').at(-1));
				})
				.map((data) => {
					return data.replace('>', '').replaceAll('"', '');
				});
		});
};

export { getArticle };
