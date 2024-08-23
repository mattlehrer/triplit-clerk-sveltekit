import { getContext, setContext } from 'svelte';
import type { TriplitClient } from '@triplit/client';
import type { schema } from '../../../../triplit/schema';

const _contextKey = '$$_triplit';

interface TriplitContext {
	onlineDb: TriplitClient<typeof schema>;
	offlineDb: TriplitClient<typeof schema>;
}

export const useTriplitContext = (): TriplitContext => {
	const ctx = getContext(_contextKey);
	if (!ctx) {
		throw new Error(
			'No Triplit data was found in Svelte context. Did you forget to wrap your component with TriplitProvider?',
		);
	}

	return ctx as TriplitContext;
};

export const setTriplitContext = (context: TriplitContext): void => {
	setContext(_contextKey, context);
};
