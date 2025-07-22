import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  currentUser: { id: string; name: string };
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carNumber: '',
    serviceDate: new Date(),
    status: 'ממתין לשירות',
    isRentalCar: false,
    rentalCarNumber: ''
  });

  const handleSave = () => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      carNumber: formData.carNumber,
      serviceDate: format(formData.serviceDate, 'yyyy-MM-dd'),
      status: formData.status,
      isRentalCar: formData.isRentalCar,
      rentalCarNumber: formData.isRentalCar ? formData.rentalCarNumber : undefined,
      advisorId: currentUser.id
    };

    onSave(newCustomer);
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      carNumber: '',
      serviceDate: new Date(),
      status: 'ממתין לשירות',
      isRentalCar: false,
      rentalCarNumber: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הוספת לקוח חדש</DialogTitle>
          <DialogDescription>
            מלא את פרטי הלקוח. שדות ריקים מותרים.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">שם לקוח</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="הזן שם לקוח"
            />
          </div>

          <div>
            <Label htmlFor="phone">טלפון</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="הזן מספר טלפון"
            />
          </div>

          <div>
            <Label htmlFor="carNumber">מספר רכב</Label>
            <Input
              id="carNumber"
              value={formData.carNumber}
              onChange={(e) => setFormData({ ...formData, carNumber: e.target.value })}
              placeholder="הזן מספר רכב"
            />
          </div>

          <div>
            <Label>תאריך שירות</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {format(formData.serviceDate, 'dd/MM/yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.serviceDate}
                  onSelect={(date) => date && setFormData({ ...formData, serviceDate: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>סטטוס</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ממתין לשירות">ממתין לשירות</SelectItem>
                <SelectItem value="בטיפול">בטיפול</SelectItem>
                <SelectItem value="הושלם">הושלם</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="rental"
              checked={formData.isRentalCar}
              onCheckedChange={(checked) => setFormData({ ...formData, isRentalCar: checked })}
            />
            <Label htmlFor="rental">רכב שכור</Label>
          </div>

          {formData.isRentalCar && (
            <div>
              <Label htmlFor="rentalCarNumber">מספר רכב שכור</Label>
              <Input
                id="rentalCarNumber"
                value={formData.rentalCarNumber}
                onChange={(e) => setFormData({ ...formData, rentalCarNumber: e.target.value })}
                placeholder="הזן מספר רכב שכור"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              שמור לקוח
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              ביטול
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;