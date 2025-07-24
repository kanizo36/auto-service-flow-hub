import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userId: string, userName: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // משתמשים מוגדרים מראש
  const users = [
    { id: 'manager', name: 'מנהל', password: '33' },
    { id: 'advisor34', name: 'יועץ שירות 34', password: '34' },
    { id: 'advisor12', name: 'יועץ שירות 12', password: '12' },
    { id: 'advisor13', name: 'יועץ שירות 13', password: '13' },
    { id: 'advisor39', name: 'יועץ שירות 39', password: '39' },
  ];

  const handleLogin = () => {
    if (!userId || !password) {
      setError('אנא מלא את כל השדות');
      return;
    }

    const user = users.find(u => u.id === userId && u.password === password);
    if (user) {
      onLogin(user.id, user.name);
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary-glow/10">
      <Card className="w-full max-w-md mx-4 shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-3 rounded-full">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            מערכת ניהול שירותי רכב
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            היכנס עם הפרטים שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">שם משתמש</Label>
            <select
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">בחר משתמש...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="הכנס סיסמה"
              className="text-center"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-elegant hover-lift"
            size="lg"
          >
            <LogIn className="w-4 h-4 ml-2" />
            כניסה למערכת
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;