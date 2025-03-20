import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // First, check if customer already exists
    const { data: existingCustomers, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', data.email)
      .limit(1);
      
    if (customerError) {
      throw customerError;
    }
    
    let customerId;
    
    if (existingCustomers && existingCustomers.length > 0) {
      // Customer exists, use their ID
      customerId = existingCustomers[0].id;
    } else {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null
        })
        .select('id')
        .single();
        
      if (createError) {
        throw createError;
      }
      
      customerId = newCustomer.id;
    }
    
    // Create enquiry
    const { data: enquiry, error: enquiryError } = await supabase
      .from('enquiries')
      .insert({
        customer_id: customerId,
        source: data.source || 'website',
        status: 'new',
        notes: data.message || null
      })
      .select()
      .single();
      
    if (enquiryError) {
      throw enquiryError;
    }
    
    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    console.error('Error processing enquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process enquiry' },
      { status: 500 }
    );
  }
}