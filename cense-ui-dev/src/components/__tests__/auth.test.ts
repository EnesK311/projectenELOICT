import { setActivePinia, createPinia } from 'pinia';
import useAuthStore from '@/stores/auth';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import {
  login,
  register,
  resetPasswordWithCode,
  sendForgotPasswordEmail,
  verifyEmail,
  resendVerifyEmail,
} from '@/services/authService';

vi.mock('@/services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  getMe: vi.fn(),
  updateMe: vi.fn(),
  getMyId: vi.fn(),
  resetPasswordWithCode: vi.fn(),
  sendForgotPasswordEmail: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerifyEmail: vi.fn(),
}));

describe('useAuthStore', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
  });



  it('registers a user successfully', async () => {
    (register as Mock).mockResolvedValueOnce({ data: { success: true } });

    await authStore.registerUser({ email: 'newuser@example.com', password: 'password123' });

    expect(authStore.error).toBeNull();
    expect(authStore.isAuthenticated).toBe(false); // Registration doesn't log in the user
  });



  it('resets a user password', async () => {
    (resetPasswordWithCode as Mock).mockResolvedValueOnce({ data: { success: true } });

    await authStore.resetPassword('test@example.com', 'code123', 'newPassword123');

    expect(authStore.error).toBeNull();
  });

  it('sends forgot password email', async () => {
    (sendForgotPasswordEmail as Mock).mockResolvedValueOnce({ data: { success: true } });

    await authStore.sendForgotPasswordMail('test@example.com');

    expect(authStore.error).toBeNull();
  });

  it('confirms email verification', async () => {
    (verifyEmail as Mock).mockResolvedValueOnce({ data: { success: true } });

    await authStore.confirmEmail('user-id', 'verify-code');

    expect(authStore.error).toBeNull();
  });

  it('resends email verification', async () => {
    (resendVerifyEmail as Mock).mockResolvedValueOnce({ data: { success: true } });

    await authStore.resendEmail('test@example.com');

    expect(authStore.error).toBeNull();
  });

  it('handles login failure', async () => {
    const error = new Error('Invalid credentials');

    (login as Mock).mockRejectedValueOnce(error);

    await authStore.loginUser({ email: 'test@example.com', password: 'wrongpassword' });

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.error).toBe('Invalid credentials');
  });

  it('handles registration failure', async () => {
    const error = new Error('Email already in use');

    (register as Mock).mockRejectedValueOnce(error);

    await authStore.registerUser({ email: 'existing@example.com', password: 'password123' });

    expect(authStore.error).toBe('Email already in use');
  });
});
