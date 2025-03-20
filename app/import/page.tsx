"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from 'lucide-react';
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    customers: number;
    products: number;
    error?: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setResults(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Process customers
        const customers = [];
        const products = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          
          // Map CSV columns to your database schema
          // This is a simplified example - you'll need to adjust based on your actual CSV structure
          if (headers.includes('Customer Name') && headers.includes('Email')) {
            const nameIndex = headers.indexOf('Customer Name');
            const emailIndex = headers.indexOf('Email');
            const phoneIndex = headers.indexOf('Phone');
            const addressIndex = headers.indexOf('Address');
            
            if (values[nameIndex] && values[emailIndex]) {
              customers.push({
                name: values[nameIndex],
                email: values[emailIndex],
                phone: phoneIndex >= 0 ? values[phoneIndex] : null,
                address: addressIndex >= 0 ? values[addressIndex] : null
              });
            }
          }
          
          // Process products if they exist in the CSV
          if (headers.includes('Product Name') && headers.includes('Cost Price')) {
            const nameIndex = headers.indexOf('Product Name');
            const costIndex = headers.indexOf('Cost Price');
            const categoryIndex = headers.indexOf('Category');
            
            if (values[nameIndex] && values[costIndex]) {
              products.push({
                name: values[nameIndex],
                cost_price: parseFloat(values[costIndex]) || 0,
                category: categoryIndex >= 0 ? values[categoryIndex] : null,
                default_markup: 20, // Default markup
                current_stock: 0,   // Default stock
                minimum_stock: 0    // Default minimum
              });
            }
          }
        }
        
        // Import customers to Supabase
        if (customers.length > 0) {
          const { error } = await supabase
            .from('customers')
            .upsert(customers, { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });
            
          if (error) throw error;
        }
        
        // Import products to Supabase
        if (products.length > 0) {
          const { error } = await supabase
            .from('products')
            .upsert(products, { 
              onConflict: 'name',
              ignoreDuplicates: false 
            });
            
          if (error) throw error;
        }
        
        setResults({
          customers: customers.length,
          products: products.length
        });
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      console.error('Import error:', error);
      setResults({
        customers: 0,
        products: 0,
        error: error.message || 'Failed to import data'
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Carpetland CRM</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Import Data</h2>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Import from Tradify</CardTitle>
            <CardDescription>
              Import your customers and products from a Tradify CSV export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <input
                type="file"
                id="csv-file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="csv-file"
                className="cursor-pointer block"
              >
                {file ? (
                  <div className="text-center">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-medium">Click to select a CSV file</p>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop your file here
                    </p>
                  </div>
                )}
              </label>
            </div>
            
            {results && (
              <div className={`p-4 rounded-md ${results.error ? 'bg-red-50' : 'bg-green-50'}`}>
                {results.error ? (
                  <p className="text-red-600">{results.error}</p>
                ) : (
                  <div>
                    <p className="font-medium text-green-600">Import successful!</p>
                    <ul className="mt-2 text-sm">
                      <li>Imported {results.customers} customers</li>
                      <li>Imported {results.products} products</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
              className="w-full"
            >
              {importing ? 'Importing...' : 'Import Data'}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}