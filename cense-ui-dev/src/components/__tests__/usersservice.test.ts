import { describe, it, expect, vi, type Mock } from 'vitest';
import {
  getAllUsers,
  getUserById,
  getAllSwipeUsers,
  swipe,
  getHistory,
} from '@/services/userService';
import { myAxios } from '@/instances/myAxios';

vi.mock('@/instances/myAxios', () => ({
  myAxios: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('userService', () => {
  it('fetches all users with filters', async () => {
    const filters = {
      term: 'developer',
      distance: 10,
      knowledge: ['JavaScript', 'TypeScript'],
      functionTitle: 'Engineer',
      sort: 'asc',
    };

    const mockResponse = { data: { success: true, users: [] } };
    (myAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    const response = await getAllUsers(filters);

    expect(myAxios.get).toHaveBeenCalledWith('/users', {
      params: {
        Term: 'developer',
        Distance: 10,
        Knowledge: ['JavaScript', 'TypeScript'],
        FunctionTitle: 'Engineer',
        Sort: 'asc',
      },
      paramsSerializer: expect.any(Function),
    });

    // Test paramsSerializer output
    const paramsSerializer = (myAxios.get as Mock).mock.calls[0][1].paramsSerializer;
    const queryString = paramsSerializer({
      Knowledge: ['JavaScript', 'TypeScript'],
    });
    expect(queryString).toBe('Knowledge=JavaScript&Knowledge=TypeScript');

    expect(response).toEqual(mockResponse);
  });

  it('fetches a user by ID', async () => {
    const userId = '123';
    const mockResponse = {
      data: { success: true, data: { id: userId, name: 'John Doe' } },
    };

    (myAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    const response = await getUserById(userId);

    expect(myAxios.get).toHaveBeenCalledWith(`/users/info/${userId}`);
    expect(response).toEqual(mockResponse);
  });

  it('handles errors when fetching a user by ID', async () => {
    const userId = '404';
    const mockError = new Error('User not found');

    (myAxios.get as Mock).mockRejectedValueOnce(mockError);

    await expect(getUserById(userId)).rejects.toThrow('User not found');
  });

  it('fetches swipeable users by knowledge', async () => {
    const knowledge = ['React', 'Node.js'];
    const mockResponse = { data: { success: true, users: [] } };

    (myAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    const response = await getAllSwipeUsers(knowledge);

    expect(myAxios.get).toHaveBeenCalledWith('/users', {
      params: {
        Knowledge: ['React', 'Node.js'],
        IsSwipe: true,
      },
      paramsSerializer: expect.any(Function),
    });

    // Test paramsSerializer output
    const paramsSerializer = (myAxios.get as Mock).mock.calls[0][1].paramsSerializer;
    const queryString = paramsSerializer({
      Knowledge: ['React', 'Node.js'],
    });
    expect(queryString).toBe('Knowledge=React&Knowledge=Node.js');

    expect(response).toEqual(mockResponse);
  });

  it('adds a swipe action', async () => {
    const targetUserId = '456';
    const isApproved = true;
    const mockResponse = { data: { success: true } };

    (myAxios.post as Mock).mockResolvedValueOnce(mockResponse);

    const response = await swipe(targetUserId, isApproved);

    expect(myAxios.post).toHaveBeenCalledWith('/swipe/add', {
      targetUserId,
      isApproved,
    });
    expect(response).toEqual(mockResponse);
  });

  it('fetches swipe history', async () => {
    const mockResponse = { data: { success: true, history: [] } };

    (myAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    const response = await getHistory();

    expect(myAxios.get).toHaveBeenCalledWith('/swipe/history');
    expect(response).toEqual(mockResponse);
  });
});
