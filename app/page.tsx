"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, MessageSquare, Package, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentQuotes } from "@/components/dashboard/recent-quotes";
import { UpcomingJobs } from "@/components/dashboard/upcoming-jobs";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { FollowUpReminders } from "@/components/dashboard/follow-up-reminders";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Carpetland CRM</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" asChild>
            <Link href="/quotes/new">
              <ClipboardList className="mr-2 h-4 w-4" />
              New Quote
            </Link>
          </Button>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard 
                title="Total Quotes" 
                value="12" 
                description="+2 from last week" 
                icon={ClipboardList} 
              />
              <StatsCard 
                title="Active Jobs" 
                value="7" 
                description="2 scheduled for this week" 
                icon={Calendar} 
              />
              <StatsCard 
                title="New Enquiries" 
                value="3" 
                description="Unprocessed leads" 
                icon={MessageSquare} 
              />
              <StatsCard 
                title="Monthly Revenue" 
                value="$24,780" 
                description="+12% from last month" 
                icon={TrendingUp} 
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <RecentQuotes />
              </Card>
              <Card className="col-span-3">
                <UpcomingJobs />
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <LowStockAlert />
              </Card>
              <Card className="col-span-2">
                <FollowUpReminders />
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quotes" className="space-y-4">
            <h3 className="text-lg font-medium">Quotes Management</h3>
            <p>This tab will contain a detailed view of all quotes with filtering and sorting options.</p>
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <h3 className="text-lg font-medium">Jobs Management</h3>
            <p>This tab will contain a calendar view and list view of all scheduled and in-progress jobs.</p>
          </TabsContent>
          
          <TabsContent value="enquiries" className="space-y-4">
            <h3 className="text-lg font-medium">Enquiries Management</h3>
            <p>This tab will show all incoming leads from your website and allow you to convert them to quotes.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}