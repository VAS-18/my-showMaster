import { useState } from 'react';

const TokenDebugger = () => {
  const [tokenInfo, setTokenInfo] = useState(null);

  const analyzeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTokenInfo({ error: 'No token found in localStorage' });
      return;
    }

    try {
      // Decode JWT payload (this is just base64 decoding, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setTokenInfo({
        token: token.substring(0, 20) + '...', // Show first 20 chars
        payload: payload,
        isExpired: payload.exp < Date.now() / 1000
      });
    } catch (error) {
      setTokenInfo({ error: 'Invalid token format' });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Token Debugger</h2>
      <button 
        onClick={analyzeToken}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Analyze Current Token
      </button>
      
      {tokenInfo && (
        <div className="mt-4 p-4 bg-white rounded border">
          {tokenInfo.error ? (
            <p className="text-red-600">{tokenInfo.error}</p>
          ) : (
            <div>
              <p><strong>Token:</strong> {tokenInfo.token}</p>
              <p><strong>Username:</strong> {tokenInfo.payload.sub}</p>
              <p><strong>Issued:</strong> {new Date(tokenInfo.payload.iat * 1000).toLocaleString()}</p>
              <p><strong>Expires:</strong> {new Date(tokenInfo.payload.exp * 1000).toLocaleString()}</p>
              <p><strong>Expired:</strong> {tokenInfo.isExpired ? 'Yes' : 'No'}</p>
              <p><strong>Note:</strong> User roles are loaded from database when token is validated, not stored in token</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenDebugger;