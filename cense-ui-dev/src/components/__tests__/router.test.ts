import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import router from '@/router';
import useAuthStore from '@/stores/auth';

vi.mock('@/stores/auth', () => ({
  default: vi.fn(),
}));

describe('Router', () => {
  let mockAuthStore: { isAuthenticated: boolean; ProfileComplete: boolean };

  beforeEach(() => {
    // Reset mock implementation before each test
    vi.resetAllMocks();

    // Mock the auth store
    mockAuthStore = {
      isAuthenticated: false,
      ProfileComplete: false,
    };

    // Provide the mock implementation
    (useAuthStore as unknown as Mock).mockReturnValue(mockAuthStore);
  });

  it('redirects unauthenticated users to login for protected routes', async () => {
    mockAuthStore.isAuthenticated = false;

    await router.push('/profile'); // Use the actual router
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('login');
  });

  it('redirects users with incomplete profiles to complete-profile', async () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.ProfileComplete = false;

    await router.push('/profile');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('complete-profile');
  });


  it('allows navigation to public routes', async () => {
    mockAuthStore.isAuthenticated = false;

    await router.push('/');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('home');
  });



  it('does not redirect when navigating to public routes without auth', async () => {
    mockAuthStore.isAuthenticated = false;

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('login');
  });

  it('does redirect to 404 if path does not exist', async () => {
    mockAuthStore.isAuthenticated = false;

    await router.push('/notexistingpath');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('not-found');
  });
});
