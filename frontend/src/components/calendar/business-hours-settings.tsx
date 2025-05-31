import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Clock, Save, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { useLanguage } from '../../lib/translations';
import { businessSettingsService, BusinessHours, BusinessSettings } from '../../services/business-settings';
import { toast } from '../../lib/toast';

interface BusinessHoursSettingsProps {
  onClose: () => void;
  onSave?: () => void;
}

export function BusinessHoursSettings({ onClose, onSave }: BusinessHoursSettingsProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [hours, settings] = await Promise.all([
        businessSettingsService.getBusinessHours(user.id),
        businessSettingsService.getBusinessSettings(user.id)
      ]);
      setBusinessHours(hours);
      setBusinessSettings(settings);
    } catch (error) {
      console.error('Error loading business data:', error);
      toast.error(t('notifications.error.loadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleHourChange = (dayOfWeek: number, field: keyof BusinessHours, value: any) => {
    setBusinessHours(prev => prev.map(hour => 
      hour.day_of_week === dayOfWeek 
        ? { ...hour, [field]: value }
        : hour
    ));
  };

  const handleSettingsChange = (field: keyof BusinessSettings, value: any) => {
    if (businessSettings) {
      setBusinessSettings(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSave = async () => {
    if (!user || !businessSettings) return;

    try {
      setSaving(true);
      
      // Update business hours
      await businessSettingsService.updateBusinessHours(businessHours);
      
      // Update business settings
      await businessSettingsService.updateBusinessSettings(businessSettings);
      
      toast.success(t('notifications.success.settingsUpdated'));
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast.error(t('notifications.error.saveSettings'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.business.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.business.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">{t('settings.business.name')}</Label>
              <Input
                id="businessName"
                value={businessSettings?.business_name || ''}
                onChange={(e) => handleSettingsChange('business_name', e.target.value)}
                placeholder={t('settings.business.namePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="defaultDuration">{t('settings.business.defaultDuration')}</Label>
              <Input
                id="defaultDuration"
                type="number"
                min="15"
                max="480"
                step="15"
                value={businessSettings?.default_appointment_duration || 60}
                onChange={(e) => handleSettingsChange('default_appointment_duration', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="slotInterval">{t('settings.business.slotInterval')}</Label>
              <Input
                id="slotInterval"
                type="number"
                min="5"
                max="60"
                step="5"
                value={businessSettings?.slot_interval || 30}
                onChange={(e) => handleSettingsChange('slot_interval', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="advanceBooking">{t('settings.business.advanceBooking')}</Label>
              <Input
                id="advanceBooking"
                type="number"
                min="1"
                max="365"
                value={businessSettings?.advance_booking_days || 30}
                onChange={(e) => handleSettingsChange('advance_booking_days', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('settings.businessHours.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.businessHours.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((hour) => (
              <div key={hour.day_of_week} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-24">
                  <span className="font-medium">
                    {businessSettingsService.getDayName(hour.day_of_week, language)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hour.is_open}
                    onCheckedChange={(checked) => handleHourChange(hour.day_of_week, 'is_open', checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {hour.is_open ? t('settings.businessHours.open') : t('settings.businessHours.closed')}
                  </span>
                </div>

                {hour.is_open && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('settings.businessHours.from')}</Label>
                      <Input
                        type="time"
                        value={hour.open_time}
                        onChange={(e) => handleHourChange(hour.day_of_week, 'open_time', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('settings.businessHours.to')}</Label>
                      <Input
                        type="time"
                        value={hour.close_time}
                        onChange={(e) => handleHourChange(hour.day_of_week, 'close_time', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              {t('common.saving')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t('common.save')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
