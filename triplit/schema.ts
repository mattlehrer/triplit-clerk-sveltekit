import { Schema as S, type ClientSchema, type Entity, type Roles } from '@triplit/client';

// This is your schema definition.
//
// For all of the supported types and options, check the documentation:
//   https://triplit.com/docs/schemas/types
//
// Whenever you change your schema while the sync server is running
// you'll need to run
//
//   `triplit schema push`
//
// Read more about schema management:
//  https://www.triplit.dev/docs/schemas/updating

export const roles: Roles = {
	admin: {
		match: {
			role: 'admin',
		},
	},
	org_admin: {
		match: {
			sub: '$userId',
			org_id: '$orgId',
			org_role: 'org:admin',
		},
	},
	org_member: {
		match: {
			sub: '$userId',
			org_id: '$orgId',
			org_role: 'org:member',
		},
	},
	personal_user: {
		match: {
			sub: '$userId',
			org_id: undefined, // this is ignored by Triplit but here for clarity of what's coming from Clerk
			org_role: 'personal',
		},
	},
};

export const schema = {
	todos: {
		schema: S.Schema({
			id: S.Id(),
			created_by_clerk_id: S.String({ nullable: true }),
			organization_id: S.String({ nullable: true }),
			text: S.String(),
			completed: S.Boolean({ default: false }),
			created_at: S.Date({ default: S.Default.now() }),
		}),
		permissions: {
			admin: {
				insert: { filter: [true] },
				read: { filter: [true] },
				update: { filter: [true] },
				delete: { filter: [true] },
			},
			org_member: {
				read: {
					filter: [['organization_id', '=', '$role.orgId']],
				},
				update: {
					filter: [['organization_id', '=', '$role.orgId']],
				},
				postUpdate: {
					filter: [['organization_id', '=', '$role.orgId']],
				},
			},
			org_admin: {
				insert: {
					filter: [
						['created_by_clerk_id', '=', '$role.userId'],
						['organization_id', '=', '$role.orgId'],
					],
				},
				read: {
					filter: [['organization_id', '=', '$role.orgId']],
				},
				update: {
					filter: [['organization_id', '=', '$role.orgId']],
				},
				postUpdate: {
					filter: [['organization_id', '=', '$role.orgId']],
				},
				delete: { filter: [['organization_id', '=', '$role.orgId']] },
			},
			personal_user: {
				insert: {
					filter: [
						['created_by_clerk_id', '=', '$role.userId'],
						['organization_id', '=', null],
					],
				},
				read: {
					filter: [
						['created_by_clerk_id', '=', '$role.userId'],
						['organization_id', '=', null],
					],
				},
				update: {
					filter: [
						['created_by_clerk_id', '=', '$role.userId'],
						['organization_id', '=', null],
					],
				},
				postUpdate: {
					filter: [
						['created_by_clerk_id', '=', '$role.userId'],
						['organization_id', '=', null],
					],
				},
				delete: {
					filter: [
						['created_by_clerk_id', '=', '$role.userId'],
						['organization_id', '=', null],
					],
				},
			},
		},
	},
} satisfies ClientSchema;

// Use the `Entity` type to extract clean types for your collections
export type Todo = Entity<typeof schema, 'todos'>;
