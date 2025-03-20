"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Quote {
  id: string;
  customer_name: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export function RecentQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            customers (name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const formattedQuotes = data.map(quote => ({
          id: quote.id,
          customer_name: quote.customers?.name || 'Unknown',
          created_at: new Date(quote.created_at).toISOString().split('T')[0],
          total_amount: quote.total_amount,
          status: quote.status
        }));

        setQuotes(formattedQuotes);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quotes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-4">No quotes found</div>
        ) : (
          <div className="space-y-2">
            {quotes.map(quote => (
              <div key={quote.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{quote.customer_name}</div>
                  <div className="text-sm text-muted-foreground">Quote #{quote.id.substring(0, 8)} • {quote.created_at}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">${quote.total_amount.toFixed(2)}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    quote.status === "approved" ? "bg-green-100 text-green-800" :
                    quote.status === "sent" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href="/quotes">View All Quotes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}