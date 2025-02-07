import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Heart, Moon, Droplets } from 'lucide-react';

const GoogleFitDashboard = () => {
  const [status, setStatus] = useState({
    authState: 'checking', // checking, authenticated, unauthenticated
    dataState: 'idle', // idle, loading, success, error
    error: null
  });
  
  const [fitbitData, setFitbitData] = useState({
    heartRate: [],
    sleep: [],
    spo2: null,
    activities: []
  });

  // Check URL for authorization code on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      handleCodeExchange(code);
    } else {
      // Check if we have a stored user ID
      const userId = localStorage.getItem('fitbit_user_id');
      if (userId) {
        setStatus(prev => ({ ...prev, authState: 'authenticated' }));
        fetchFitbitData(userId);
      } else {
        setStatus(prev => ({ ...prev, authState: 'unauthenticated' }));
      }
    }
  }, []);

  const handleCodeExchange = async (code) => {
    try {
      setStatus(prev => ({ ...prev, authState: 'checking' }));
      
      console.log('Exchanging code for token...');
      const response = await fetch('http://localhost:4200/api/fitbit/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      console.log('Token exchange successful');
      
      localStorage.setItem('fitbit_user_id', data.userId);
      setStatus(prev => ({ ...prev, authState: 'authenticated' }));
      fetchFitbitData(data.userId);
      
      // Remove code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Auth error:', error);
      setStatus(prev => ({ 
        ...prev, 
        authState: 'unauthenticated',
        error: 'Authentication failed. Please try again.'
      }));
    }
  };

  const fetchFitbitData = async (userId) => {
    try {
      setStatus(prev => ({ ...prev, dataState: 'loading' }));
      console.log('Fetching Fitbit data...');

      // Fetch heart rate data
      const heartResponse = await fetch('http://localhost:4200/api/fitbit/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          endpoint: '1/user/-/heart/date/today/1d/1min.json'
        })
      });

      if (!heartResponse.ok) {
        throw new Error('Failed to fetch heart rate data');
      }

      const heartData = await heartResponse.json();
      console.log('Heart rate data received:', heartData);

      // Fetch sleep data
      const sleepResponse = await fetch('http://localhost:4200/api/fitbit/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          endpoint: '1.2/user/-/sleep/date/today.json'
        })
      });

      if (!sleepResponse.ok) {
        throw new Error('Failed to fetch sleep data');
      }

      const sleepData = await sleepResponse.json();
      console.log('Sleep data received:', sleepData);

      setFitbitData({
        heartRate: heartData['activities-heart-intraday']?.dataset || [],
        sleep: sleepData.sleep || [],
        spo2: null, // We'll add this later
        activities: []
      });

      setStatus(prev => ({ ...prev, dataState: 'success' }));
    } catch (error) {
      console.error('Data fetch error:', error);
      setStatus(prev => ({ 
        ...prev, 
        dataState: 'error',
        error: 'Failed to fetch Fitbit data. Please try again.'
      }));
    }
  };

  const handleLogin = () => {
    const CLIENT_ID = '23Q6RN'; // Replace with your client ID
    const REDIRECT_URI = 'http://localhost:5173/googlefitapi';
    const scope = 'activity heartrate sleep oxygen_saturation';
    const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
    window.location.href = authUrl;
  };

  // Render loading state
  if (status.authState === 'checking' || status.dataState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-lg">Loading Fitbit data...</p>
        <p className="text-sm text-gray-500">
          {status.authState === 'checking' ? 'Authenticating...' : 'Fetching your health data...'}
        </p>
      </div>
    );
  }

  // Render error state
  if (status.error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-lg text-red-500">{status.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render unauthenticated state
  if (status.authState === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Connect Fitbit Account
        </button>
      </div>
    );
  }

  // Render dashboard
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Heart Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" />
            Heart Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fitbitData.heartRate.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fitbitData.heartRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ff0000" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No heart rate data available</p>
          )}
        </CardContent>
      </Card>

      {/* Sleep Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="text-blue-500" />
            Sleep
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fitbitData.sleep.length > 0 ? (
            fitbitData.sleep.map((sleep, index) => (
              <div key={index} className="mb-2">
                <p>Duration: {Math.round(sleep.duration / 3600000)} hours</p>
                <p>Efficiency: {sleep.efficiency}%</p>
              </div>
            ))
          ) : (
            <p>No sleep data available</p>
          )}
        </CardContent>
      </Card>

      <button
        onClick={() => fetchFitbitData(localStorage.getItem('fitbit_user_id'))}
        className="col-span-2 mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Refresh Data
      </button>
    </div>
  );
};

export default GoogleFitDashboard;