"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StockItem {
  id: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
}

export function LowStockAlert() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLowStockItems() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, current_stock, minimum_stock')
          .lt('current_stock', supabase.raw('minimum_stock'))
          .order('name')
          .limit(5);

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching low stock items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLowStockItems();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alert</CardTitle>
        <CardDescription>Items below minimum stock level</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading inventory...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">No low stock items</div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-red-600">
                  {item.current_stock}/{item.minimum_stock} remaining
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href="/inventory">Manage Inventory</Link>
        </Button>
      </CardContent>
    </Card>
  );
}