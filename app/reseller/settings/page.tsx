'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { BusinessSettings } from '@/components/reseller/settings/BusinessSettings';
import { OrderSettings } from '@/components/reseller/settings/OrderSettings';
import { PaymentSettings } from '@/components/reseller/settings/PaymentSettings';
import { NotificationSettings } from '@/components/reseller/settings/NotificationSettings';
import { SecuritySettings } from '@/components/reseller/settings/SecuritySettings';

export default function SettingsPage() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      const response = await fetch('/api/reseller/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch store settings');
      }
      const data = await response.json();
      setStore(data);
    } catch (error) {
      console.error('Failed to fetch store settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings: any) => {
    try {
      const response = await fetch('/api/reseller/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const updatedStore = await response.json();
      setStore(updatedStore);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <BusinessSettings store={store} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderSettings store={store} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings store={store} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings store={store} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}