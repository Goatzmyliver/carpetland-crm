"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FollowUp {
  id: string;
  customer_name: string;
  created_at: string;
  days_ago: number;
}

export function FollowUpReminders() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowUps() {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            id,
            created_at,
            customers (name)
          `)
          .eq('status', 'sent')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const now = new Date();
        const formattedFollowUps = data
          .map(quote => {
            const createdAt = new Date(quote.created_at);
            const diffTime = Math.abs(now.getTime() - createdAt.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return {
              id: quote.id,
              customer_name: quote.customers?.name || 'Unknown',
              created_at: createdAt.toISOString().split('T')[0],
              days_ago: diffDays
            };
          })
          .filter(quote => quote.days_ago >= 3) // Only show quotes sent 3+ days ago
          .slice(0, 5); // Limit to 5 items

        setFollowUps(formattedFollowUps);
      } catch (error) {
        console.error('Error fetching follow-ups:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowUps();
  }, []);

  const handleFollowUp = async (id: string) => {
    try {
      // In a real implementation, you might:
      // 1. Update the quote with a follow-up date
      // 2. Send an email to the customer
      // 3. Create a notification for the sales person
      
      // For now, we'll just update the follow-up date
      const { error } = await supabase
        .from('quotes')
        .update({ follow_up_date: new Date().toISOString().split('T')[0] })
        .eq('id', id);
        
      if (error) throw error;
      
      // Remove this item from the list
      setFollowUps(followUps.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error updating follow-up:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Reminders</CardTitle>
        <CardDescription>Quotes requiring follow-up</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading reminders...</div>
        ) : followUps.length === 0 ? (
          <div className="text-center py-4">No follow-ups needed</div>
        ) : (
          <div className="space-y-2">
            {followUps.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{item.customer_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Quote sent {item.days_ago} days ago
                  </div>
                </div>
                <Button size="sm" onClick={() => handleFollowUp(item.id)}>
                  Follow Up
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}