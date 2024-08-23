<script lang="ts">
	import type { TriplitClient } from '@triplit/client';
	import { schema, type Todo } from '../../triplit/schema';
	export let todo: Todo;
	export let client: TriplitClient<typeof schema>;
</script>

<div class="todo">
	<input
		type="checkbox"
		checked={todo.completed}
		onchange={async () =>
			// Update the todo's completed status
			// `triplit.update` is an async function that takes the entity type
			//  the entity ID, and a callback function that updates the entity
			await client.update('todos', todo.id, async (entity) => {
				entity.completed = !todo.completed;
			})}
	/>
	{todo.text}
	<button
		class="x-button"
		onclick={async () => {
			// Delete the todo
			await client.delete('todos', todo.id);
		}}
	>
		❌
	</button>
</div>
