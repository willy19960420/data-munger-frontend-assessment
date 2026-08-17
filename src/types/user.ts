export type UserStatus = 'active' | 'inactive';

export interface UserListSearchParams {
	name?: string;
	email?: string;
	status?: UserStatus;
}

export interface UserListRequest extends UserListSearchParams {
	page: number;
	limit: number;
}