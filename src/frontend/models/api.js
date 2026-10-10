export const getHeaders = () => {
  const token = localStorage.getItem('uniport_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const safeJson = async (res) => {
  try {
    const text = await res.text();
    if (!text || !text.trim()) return {};
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) {
      return {
        error: res.status === 404
          ? 'آدرس درخواستی یافت نشد.'
          : res.status === 401 || res.status === 403
          ? 'دسترسی غیرمجاز یا اطلاعات کاربری نادرست است.'
          : 'خطای سرور. لطفاً دوباره تلاش نمایید.',
        code: 'NON_JSON_RESPONSE',
      };
    }
    return JSON.parse(trimmed);
  } catch (err) {
    return {
      error: 'خطایی در ارتباط با سرور رخ داده است. لطفاً دوباره تلاش فرمایید.',
      code: 'SERVER_RESPONSE_ERROR',
    };
  }
};

const handleAuthFailure = (res) => {
  if (res && res.status === 401) {
    localStorage.removeItem('uniport_token');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uniport_auth_expired'));
    }
  }
};

export const api = {
  // Authentication Actions
  auth: {
    async register(payload) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const err = new Error(data.error || 'Registration failed');
        err.code = data.code;
        throw err;
      }
      return data;
    },

    async verifyOTP(payload) {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const err = new Error(data.error || 'Verification failed');
        err.code = data.code;
        err.attemptsRemaining = data.attemptsRemaining;
        throw err;
      }
      return data;
    },

    async verifyLink(token, email) {
      const res = await fetch(`/api/auth/verify-link?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const err = new Error(data.error || 'Link verification failed');
        err.code = data.code;
        throw err;
      }
      return data;
    },

    async resendOTP(payload) {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const err = new Error(data.error || 'Failed to resend verification code');
        err.code = data.code;
        throw err;
      }
      return data;
    },

    async login(payload) {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const errMsg = data.message || data.error || 'اطلاعات ورود اشتباه است.';
        const err = new Error(errMsg);
        err.requireVerification = data.requireVerification;
        err.email = data.email;
        err.otpCode = data.otpCode;
        err.message = errMsg;
        err.code = data.code;
        throw err;
      }
      return data;
    },

    async forgotPassword(payload) {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const err = new Error(data.error || 'Failed to send recovery code');
        err.code = data.code;
        throw err;
      }
      return data;
    },

    async resetPassword(payload) {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        const err = new Error(data.error || 'Password reset failed');
        err.code = data.code;
        throw err;
      }
      return data;
    },

    async me() {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error('Session credentials expired');
      }
      return await safeJson(res);
    }
  },

  // Student Enrollment Actions
  student: {
    async submitForm(payload) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      try {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await res.json();
        if (!res.ok) {
          handleAuthFailure(res);
          throw new Error(data.error || 'Form submission failure');
        }
        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Submission timed out. Please verify your internet connection and try again.');
        }
        throw err;
      }
    },

    async getStatus() {
      const res = await fetch('/api/students/my', {
        method: 'GET',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error(data.error || 'Failed to fetch personal registration status');
      }
      return data;
    }
  },

  // Administrative Control Actions
  admin: {
    async getApplications() {
      const res = await fetch('/api/students', {
        method: 'GET',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error(data.error || 'Failed to fetch student registry list');
      }
      return data;
    },

    async getApplicationDetails(id) {
      const res = await fetch(`/api/students/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error(data.error || 'Failed to fetch registration details');
      }
      return data;
    },

    async updateStatus(id, payload) {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error(data.error || 'Failed to update student workflow status');
      }
      return data;
    },

    async deleteApplication(id) {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error(data.error || 'Failed to delete applicant record');
      }
      return data;
    },

    async getStats() {
      const res = await fetch('/api/stats', {
        method: 'GET',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        handleAuthFailure(res);
        throw new Error(data.error || 'Failed to fetch registry stats');
      }
      return data;
    }
  },

  // Notifications Actions
  notifications: {
    async getAll() {
      const token = localStorage.getItem('uniport_token');
      if (!token) {
        return { notifications: [], unreadCount: 0 };
      }
      try {
        const res = await fetch('/api/notifications', {
          method: 'GET',
          headers: getHeaders(),
        });
        if (!res.ok) {
          if (res.status === 401) {
            return { notifications: [], unreadCount: 0 };
          }
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to fetch notifications');
        }
        const data = await res.json().catch(() => ({ notifications: [], unreadCount: 0 }));
        return {
          notifications: Array.isArray(data?.notifications) ? data.notifications : [],
          unreadCount: typeof data?.unreadCount === 'number' ? data.unreadCount : 0,
        };
      } catch (err) {
        return { notifications: [], unreadCount: 0 };
      }
    },

    async markRead(id) {
      try {
        const res = await fetch(`/api/notifications/${id}/read`, {
          method: 'PUT',
          headers: getHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Failed to update notification');
        return data;
      } catch (err) {
        return { success: false };
      }
    },

    async markAllRead() {
      try {
        const res = await fetch('/api/notifications/read-all', {
          method: 'PUT',
          headers: getHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Failed to update notifications');
        return data;
      } catch (err) {
        return { success: false };
      }
    },

    async deleteNotif(id) {
      try {
        const res = await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Failed to delete notification');
        return data;
      } catch (err) {
        return { success: false };
      }
    }
  }
};
