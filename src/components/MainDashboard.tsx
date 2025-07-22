import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LogOut, Settings, User } from 'lucide-react';
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
}

interface MainDashboardProps {
  currentUser: { id: string; name: string };
  onLogout: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ currentUser, onLogout }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Customer | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);

  // בדיקה אם יש התראות פעילות
  const hasAlert = (customer: Customer) => {
    const today = new Date();
    const serviceDate = new Date(customer.serviceDate);
    const daysDiff = Math.ceil((serviceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 0 && customer.status !== 'הושלם';
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...updates } : c));
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
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
          <Button 
            className="bg-gradient-primary hover-lift shadow-elegant"
            onClick={() => setIsCustomerFormOpen(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            לקוח חדש
          </Button>
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
                    <th className="text-right p-3">סטטוס</th>
                    <th className="text-right p-3">התראות</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        אין לקוחות במערכת. הוסף לקוח ראשון!
                      </td>
                    </tr>
                  ) : (
                    customers.map(customer => (
                      <tr key={customer.id} className="border-b hover:bg-muted/50 transition-smooth">
                        <td className="p-3 font-medium">{customer.name}</td>
                        <td className="p-3">{customer.phone}</td>
                        <td className="p-3 flex items-center gap-2">
                          {customer.carNumber}
                          {hasAlert(customer) && <span className="alert-dot"></span>}
                        </td>
                        <td className="p-3">{customer.serviceDate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            customer.status === 'הושלם' ? 'bg-accent/20 text-accent' :
                            customer.status === 'בטיפול' ? 'bg-primary/20 text-primary' :
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {hasAlert(customer) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs shadow-alert"
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