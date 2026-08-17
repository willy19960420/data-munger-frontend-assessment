import { useQuery } from '@tanstack/react-query';

import type {
	GetUserListResponse,
	UserListRequest,
} from '@/types/user';

import apiService from '@/services/apiServices';

export const useQueryData = (
	params: UserListRequest,
) => {
	return useQuery<GetUserListResponse>({
		queryKey: ['user-list', params],
		queryFn: () => apiService.user.getUserList(params),
	});
};