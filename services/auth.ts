export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to change password');
  }

  return response.json();
}; 