import React, { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import MainDashboard from '@/components/MainDashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);

  const handleLogin = (userId: string, userName: string) => {
    setCurrentUser({ id: userId, name: userName });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="rtl">
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainDashboard currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
