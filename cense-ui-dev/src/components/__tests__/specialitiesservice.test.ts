import { describe, it, expect, vi, type Mock } from 'vitest';
import { getAllSpecialities } from '@/services/specialities';
import { myAxios } from '@/instances/myAxios';

// Mock the `myAxios` instance
vi.mock('@/instances/myAxios', () => ({
  myAxios: {
    get: vi.fn(),
  },
}));

describe('specialitiesService', () => {
  it('fetches all specialities', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: '1', category: 1, specialityType: 'Type 1' },
          { id: '2', category: 2, specialityType: 'Type 2' },
        ],
      },
    };
    (myAxios.get as Mock).mockResolvedValue(mockResponse);

    const response = await getAllSpecialities();

    expect(myAxios.get).toHaveBeenCalledWith('/specialities');
    expect(response).toEqual(mockResponse);
  });


});
