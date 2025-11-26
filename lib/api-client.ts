// API Client with Automatic Token Refresh
// Wraps fetch to automatically refresh JWT tokens on API calls

interface FetchOptions extends RequestInit {
  skipRefresh?: boolean; // Skip token refresh for this request
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success?: boolean;
}

/**
 * Enhanced fetch wrapper that automatically refreshes tokens
 * Use this instead of fetch for authenticated API calls
 */
export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipRefresh, ...fetchOptions } = options;

  // Default headers
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Always include credentials for cookies
  const requestOptions: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'include',
  };

  try {
    // Make the request
    const response = await fetch(url, requestOptions);

    // If request is successful and not skipping refresh, refresh token
    if (response.ok && !skipRefresh && !url.includes('/api/auth/')) {
      // Silently refresh token in background (fire and forget)
      refreshTokenInBackground();
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Refresh token in background without blocking the request
 */
let refreshInProgress = false;
let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function refreshTokenInBackground() {
  const now = Date.now();

  // Prevent multiple simultaneous refresh requests
  if (refreshInProgress) return;

  // Don't refresh more than once every 5 minutes
  if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) return;

  refreshInProgress = true;
  lastRefreshTime = now;

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.refreshed) {
        console.log('✅ Token refreshed in background');
      }
    }
  } catch (error) {
    console.error('Background token refresh failed:', error);
  } finally {
    refreshInProgress = false;
  }
}

/**
 * Helper for GET requests
 */
export async function apiGet<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const response = await apiFetch(url, { ...options, method: 'GET' });
  return response.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

/**
 * Helper for PUT requests
 */
export async function apiPut<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const response = await apiFetch(url, { ...options, method: 'DELETE' });
  return response.json();
}

/**
 * Helper for PATCH requests
 */
export async function apiPatch<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<T> {
  const response = await apiFetch(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

/**
 * Manually trigger token refresh
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.refreshed === true;
    }
    return false;
  } catch (error) {
    console.error('Manual token refresh failed:', error);
    return false;
  }
}

/**
 * Check token status and expiration
 */
export async function checkTokenStatus(): Promise<{
  isValid: boolean;
  expiresAt: Date | null;
  minutesUntilExpiry: number | null;
}> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isValid: true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        minutesUntilExpiry: data.minutesUntilExpiry,
      };
    }

    return {
      isValid: false,
      expiresAt: null,
      minutesUntilExpiry: null,
    };
  } catch (error) {
    console.error('Token status check failed:', error);
    return {
      isValid: false,
      expiresAt: null,
      minutesUntilExpiry: null,
    };
  }
}

/**
 * Usage Examples:
 *
 * // GET request
 * const data = await apiGet('/api/quotations');
 *
 * // POST request
 * const result = await apiPost('/api/quotations', { name: 'Test' });
 *
 * // Manual token refresh
 * const refreshed = await refreshToken();
 *
 * // Check token status
 * const status = await checkTokenStatus();
 */
