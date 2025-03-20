"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Job {
  id: string;
  customer_name: string;
  scheduled_date: string;
  contractor_name: string;
  status: string;
}

export function UpcomingJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id,
            status,
            scheduled_date,
            quotes (
              customers (name)
            ),
            profiles (name)
          `)
          .eq('status', 'scheduled')
          .order('scheduled_date', { ascending: true })
          .limit(5);

        if (error) throw error;

        const formattedJobs = data.map(job => ({
          id: job.id,
          customer_name: job.quotes?.customers?.name || 'Unknown',
          scheduled_date: job.scheduled_date,
          contractor_name: job.profiles?.name || 'Unassigned',
          status: job.status
        }));

        setJobs(formattedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-4">No upcoming jobs</div>
        ) : (
          <div className="space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{job.customer_name}</div>
                  <div className="text-sm text-muted-foreground">Job #{job.id.substring(0, 8)} • {job.scheduled_date}</div>
                </div>
                <div className="text-sm">{job.contractor_name}</div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href="/jobs">View Calendar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}