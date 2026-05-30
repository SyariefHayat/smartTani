'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { FarmSettings } from './FarmSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { User, Sprout, Bell, Shield } from 'lucide-react';

export function FarmerSettingsManagement() {
  return (
    <div className="w-full text-slate-900 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Settings</h1>
          <p className="text-sm text-slate-500">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>

        <div className="h-[1px] w-full bg-slate-200" />

        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6 w-full items-start">
          {/* Sidebar Nav Card */}
          <div className="w-full md:w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <TabsList className="flex flex-row md:flex-col h-auto bg-transparent p-0 gap-1 items-start w-full overflow-x-auto md:overflow-x-visible">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
              >
                <User className="h-4 w-4 shrink-0" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="farm"
                className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
              >
                <Sprout className="h-4 w-4 shrink-0" />
                <span>Usaha Tani</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
              >
                <Bell className="h-4 w-4 shrink-0" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
              >
                <Shield className="h-4 w-4 shrink-0" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Active Content Panel */}
          <div className="flex-1 w-full">
            <TabsContent value="profile" className="m-0 focus-visible:outline-none">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="farm" className="m-0 focus-visible:outline-none">
              <FarmSettings />
            </TabsContent>

            <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="security" className="m-0 focus-visible:outline-none">
              <SecuritySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
