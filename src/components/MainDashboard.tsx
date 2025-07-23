import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, LogOut, Settings, User, Search } from 'lucide-react';
import AlertDialog from './AlertDialog';
import CustomerForm from './CustomerForm';

interface Customer {
  id: string;
  name: string;
  phone: string;
  carNumber: string;
  serviceDate: string;
  status: string;
  isRentalCar: boolean;
  rentalCarNumber?: string;
  advisorId: string;
  expectedEndTime?: string;
  entryReason?: string;
  notes?: string;
}

interface MainDashboardProps {
  currentUser: { id: string; name: string };
  onLogout: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ currentUser, onLogout }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Customer | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // בדיקה אם יש התראות פעילות
  const hasAlert = (customer: Customer) => {
    const today = new Date();
    const serviceDate = new Date(customer.serviceDate);
    const daysDiff = Math.ceil((serviceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    // התראה לתאריך שירות
    const dateAlert = daysDiff <= 0 && customer.status !== 'מוכן';
    
    // התראה לשעת סיום
    const timeAlert = customer.expectedEndTime ? checkTimeAlert(customer.expectedEndTime) : false;
    
    return dateAlert || timeAlert;
  };

  // בדיקה אם עברה שעת הסיום הצפויה
  const checkTimeAlert = (expectedTime: string) => {
    if (!expectedTime) return false;
    const now = new Date();
    const [hours, minutes] = expectedTime.split(':').map(Number);
    const expectedDateTime = new Date();
    expectedDateTime.setHours(hours, minutes, 0, 0);
    return now > expectedDateTime;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...updates } : c));
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  // פילטור לקוחות לפי חיפוש
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.carNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // קבלת צבע הסטטוס
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ממתין לכניסה': return 'text-gray-600 bg-gray-100';
      case 'בעבודה': return 'text-orange-600 bg-orange-100';
      case 'טסט': return 'text-blue-600 bg-blue-100';
      case 'מוכן': return 'text-green-600 bg-green-100';
      case 'רחיצה': return 'text-cyan-600 bg-cyan-100';
      case 'ממתין לחלק': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="bg-gradient-primary shadow-elegant p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">מערכת ניהול שירותי רכב</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              <span>{currentUser.name}</span>
            </div>
            <Button onClick={onLogout} variant="ghost" className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4 ml-2" />
              יציאה
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">רשימת לקוחות</h2>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="חיפוש לפי שם או מספר רכב..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 w-64"
              />
            </div>
            <Button 
              className="bg-gradient-primary hover-lift shadow-elegant"
              onClick={() => setIsCustomerFormOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              לקוח חדש
            </Button>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>לקוחות פעילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">שם לקוח</th>
                    <th className="text-right p-3">טלפון</th>
                    <th className="text-right p-3">מספר רכב</th>
                    <th className="text-right p-3">תאריך שירות</th>
                    <th className="text-right p-3">צפי סיום</th>
                    <th className="text-right p-3">סיבת כניסה</th>
                    <th className="text-right p-3">סטטוס</th>
                    <th className="text-right p-3">התראות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-muted-foreground">
                        {searchTerm ? 'לא נמצאו תוצאות חיפוש' : 'אין לקוחות במערכת. הוסף לקוח ראשון!'}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(customer => (
                      <tr key={customer.id} className="border-b hover:bg-muted/50 transition-smooth">
                        <td 
                          className="p-3 font-bold text-lg cursor-pointer hover:text-primary"
                          onClick={() => setSelectedAlert(customer)}
                        >
                          {customer.name}
                        </td>
                        <td className="p-3">{customer.phone}</td>
                        <td className="p-3 flex items-center gap-2">
                          {customer.carNumber}
                          {hasAlert(customer) && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
                        </td>
                        <td className="p-3 font-mono text-left">{customer.serviceDate}</td>
                        <td className="p-3">{customer.expectedEndTime || '-'}</td>
                        <td className="p-3">{customer.entryReason || '-'}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {hasAlert(customer) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs shadow-alert bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                              onClick={() => setSelectedAlert(customer)}
                            >
                              הצג התראה
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {selectedAlert && (
        <AlertDialog
          customer={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onUpdateCustomer={updateCustomer}
        />
      )}

      <CustomerForm
        isOpen={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSave={addCustomer}
        currentUser={currentUser}
      />
    </div>
  );
};

export default MainDashboard;