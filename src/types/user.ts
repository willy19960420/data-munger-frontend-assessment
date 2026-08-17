export type UserStatus = 'active' | 'inactive';

export interface User {
	id: number;
	name: string;
	email: string;
	avatar: string;
	status: UserStatus;
	created_at: string;
}

export interface UserListSearchParams {
	name?: string;
	email?: string;
	status?: UserStatus;
}

export interface UserListRequest extends UserListSearchParams {
	page?: number;
	limit?: number;
}

export interface Pagination {
	total: number;
	current_page: number;
	per_page: number;
	total_pages: number;
}

export interface GetUserListResponse {
	data: User[];
	pagination?: Pagination;
}

export interface ApiErrorResponse {
	code?: string;
	message: string;
}