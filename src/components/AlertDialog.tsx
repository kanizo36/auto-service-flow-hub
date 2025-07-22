import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

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

interface AlertDialogProps {
  customer: Customer;
  onClose: () => void;
  onUpdateCustomer: (customerId: string, updates: Partial<Customer>) => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ customer, onClose, onUpdateCustomer }) => {
  const [tempStatus, setTempStatus] = useState(customer.status);
  const [tempDate, setTempDate] = useState(customer.serviceDate);

  const statusOptions = [
    'ממתין לשירות',
    'בטיפול',
    'הושלם',
    'נדחה',
    'בהמתנה לחלקים'
  ];

  const handleStatusChange = (newStatus: string) => {
    setTempStatus(newStatus);
    onUpdateCustomer(customer.id, { status: newStatus });
    onClose();
  };

  const handleDateChange = (newDate: string) => {
    setTempDate(newDate);
    onUpdateCustomer(customer.id, { serviceDate: newDate });
    onClose();
  };

  const isAlertActive = () => {
    const today = new Date();
    const serviceDate = new Date(customer.serviceDate);
    const timeDiff = serviceDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff <= 0 && customer.status !== 'הושלם';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-alert shadow-alert animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 left-2 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 text-white">
            <AlertCircle className="w-6 h-6" />
            <CardTitle>התראה פעילה</CardTitle>
          </div>
          <CardDescription className="text-white/80">
            {customer.name} - רכב {customer.carNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-white">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm mb-2">תאריך שירות נוכחי:</p>
            <p className="font-semibold">
              {format(new Date(customer.serviceDate), 'dd/MM/yyyy', { locale: he })}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">שנה תאריך שירות:</Label>
            <Input
              type="date"
              value={tempDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-white/60"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">שנה סטטוס:</Label>
            <select
              value={tempStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="text-gray-800">
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-white/70 text-center">
            השינוי יישמר אוטומטית וההתראה תיעלם
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertDialog;