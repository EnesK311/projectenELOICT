import { describe, it, expect, vi, type Mock } from 'vitest';
import {
  getMyChats,
  getMessages,
  getAvailableUsers,
  makeChatBetweenUsers,
} from '@/services/chatService';
import { myAxios } from '@/instances/myAxios';


// Mock the `myAxios` instance
vi.mock('@/instances/myAxios', () => ({
  myAxios: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('chatService', () => {
  it('fetches the list of chats', async () => {
    const mockResponse = { data: { data: [{ chatId: '1', users: [] }, { chatId: '2', users: [] }] } };
    (myAxios.get as Mock).mockResolvedValue(mockResponse);

    const response = await getMyChats();

    expect(myAxios.get).toHaveBeenCalledWith('/chats');
    expect(response).toEqual(mockResponse);
  });

  it('fetches messages for a specific chat', async () => {
    const mockResponse = { data: { data: [{ messageId: '1', content: 'Hello' }] } };
    (myAxios.get as Mock).mockResolvedValue(mockResponse);

    const chatId = 'chat1';
    const response = await getMessages(chatId);

    expect(myAxios.get).toHaveBeenCalledWith(`/chats/${chatId}/messages`);
    expect(response).toEqual(mockResponse);
  });

  it('fetches the list of available users', async () => {
    const mockResponse = { data: { data: [{ userId: '1', firstname: 'John' }] } };
    (myAxios.get as Mock).mockResolvedValue(mockResponse);

    const response = await getAvailableUsers();

    expect(myAxios.get).toHaveBeenCalledWith('/chats/available-users');
    expect(response).toEqual(mockResponse);
  });

  it('creates a new chat between users', async () => {
    const mockResponse = { data: { data: { chatId: '3', users: [{ userId: '1', firstname: 'John' }] } } };
    (myAxios.post as Mock).mockResolvedValue(mockResponse);

    const recipientId = 'user2';
    const response = await makeChatBetweenUsers(recipientId);

    expect(myAxios.post).toHaveBeenCalledWith('/chats', { recipientId });
    expect(response).toEqual(mockResponse);
  });


});
