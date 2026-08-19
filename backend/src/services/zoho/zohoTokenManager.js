let cachedAccessToken = null;
let tokenExpiresAt = 0; // Timestamp in ms
let activeRefreshPromise = null;

/**
 * Checks if configuration values are set to local mock values.
 */
export const isMockMode = () => {
  const mockEnv = process.env.ZOHO_MOCK;
  if (mockEnv === 'true') return true;

  const clientId = process.env.ZOHO_CLIENT_ID;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  // If credentials are empty or contain default placeholder strings, auto-enable mock
  if (!clientId || !refreshToken || 
      clientId.includes('your_') || 
      refreshToken.includes('your_')) {
    return true;
  }
  return false;
};

/**
 * Retrieves a valid Zoho CRM access token, automatically refreshing it if expired.
 * Ensures concurrent requests share the same refresh operation to avoid spamming the refresh API.
 * 
 * @returns {Promise<string>} Valid Zoho Access Token
 */
export const getAccessToken = async () => {
  if (isMockMode()) {
    return 'mock_access_token_12345';
  }

  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer

  if (cachedAccessToken && now < (tokenExpiresAt - bufferMs)) {
    return cachedAccessToken;
  }

  // If a refresh is already underway, await that existing promise
  if (activeRefreshPromise) {
    console.log('[Zoho Token Manager] Awaiting active token refresh operation...');
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      console.log('[Zoho Token Manager] Access token expired or missing. Refreshing...');

      const accountsUrl = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';
      const clientId = process.env.ZOHO_CLIENT_ID;
      const clientSecret = process.env.ZOHO_CLIENT_SECRET;
      const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
      const redirectUri = process.env.ZOHO_REDIRECT_URI;

      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('Missing Zoho CRM OAuth configuration variables in environment');
      }

      const params = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || '',
        grant_type: 'refresh_token'
      });

      const response = await fetch(`${accountsUrl}/oauth/v2/token?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Zoho token refresh failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Zoho Accounts error: ${data.error}`);
      }

      if (!data.access_token) {
        throw new Error('Access token was missing in Zoho OAuth response payload');
      }

      cachedAccessToken = data.access_token;
      // expires_in is in seconds, convert to millisecond epoch
      const expiresInMs = (data.expires_in || 3600) * 1000;
      tokenExpiresAt = Date.now() + expiresInMs;

      console.log(`[Zoho Token Manager] Token refreshed successfully. Expires in ${data.expires_in || 3600}s.`);
      return cachedAccessToken;
    } catch (error) {
      console.error('[Zoho Token Manager] Critical error refreshing access token:', error.message);
      throw error;
    } finally {
      // Clear refresh lock
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
};

/**
 * Resets the cached token manually (useful for forcing refresh on auth/expired token error)
 */
export const invalidateAccessToken = () => {
  console.log('[Zoho Token Manager] Access token explicitly invalidated.');
  cachedAccessToken = null;
  tokenExpiresAt = 0;
};
