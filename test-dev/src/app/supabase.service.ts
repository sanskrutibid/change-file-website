import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  
  private supabaseUrl = 'https://oafnmnngahdxifwrheco.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZm5tbm5nYWhkeGlmd3JoZWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODc4MjIsImV4cCI6MjA3NDM2MzgyMn0.2xG8SX2C5GsCVl6ySZCYkXL-2klfFKbvvBuRF7Y-dt0';
  private supabase: SupabaseClient;



  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }


// Upload single file
async uploadFile(file: File, bucket: string, path: string) {
  const { data, error } = await this.supabase
    .storage
    .from(bucket)
    .upload(path, file, {
      upsert: true // ✅ overwrite if same file name
    });

  if (error) {
    console.error('Upload error:', error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

// Get public URL
getPublicUrl(bucket: string, path: string) {
  const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? null;
}


  // Insert application data
  async insertApplication(data: any) {
    return await this.supabase.from('applications').insert([data]);
  }

  async initiatePayUPayment(paymentData: any): Promise<string> {
  // Call your backend or Supabase Function to generate hash and PayU URL
  // Example: POST /payu-initiate with paymentData
  const response = await fetch('https://your-backend.com/payu-initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });

  const result = await response.json();
  return result.paymentUrl; // PayU redirect URL
}

}
