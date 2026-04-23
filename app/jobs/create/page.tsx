'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Download
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

import { jobsApi } from '@/lib/api/jobs';
import { profilesApi } from '@/lib/api/profiles';
import { Job } from '@/lib/api/types';
import { TalentProfile } from '@/lib/types/profile';

export default function Dashboard() {

  interface Stat {
    label: string;
    value: string;
    change: string;
    trend: string;
    icon: React.ElementType;
    color: string;
  }

  interface Applicant {
    id: string;
    name: string;
    role: string;
    match: number;
    status: string;
    avatar: string;
  }

  const [stats, setStats] = useState<Stat[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleDownloadCSV = async () => {
    try {
      setCsvError(null);
      setCsvDownloading(true);
      await profilesApi.downloadApplicantsCSV();
    } catch (err: any) {
      console.error('CSV download failed:', err);
      setCsvError('Failed to download CSV. Please try again.');
    } finally {
      setCsvDownloading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ✅ Safe Jobs Fetch
        let jobs: Job[] = [];
        try {
          jobs = await jobsApi.getJobs();
        } catch (jobsErr) {
          console.error('Dashboard: Failed to fetch jobs:', jobsErr);
        }

        // ✅ Safe Profiles Fetch
        let profilesResponse: { data: TalentProfile[]; total: number } = { data: [], total: 0 };
        try {
          profilesResponse = await profilesApi.getProfiles({ limit: 5 });
        } catch (profilesErr: any) {
          const status = profilesErr?.response?.status;

          if (status === 401) {
            console.warn('Session expired — redirecting...');
            return;
          }

          console.error('Dashboard: Failed to fetch profiles:', profilesErr);
        }

        // ✅ Stats
        const activeJobs = jobs.filter(
          (j) => j.status !== 'closed' && j.status !== 'archived'
        ).length;

        const totalApplicants = profilesResponse.total || 0;

        const profilesWithScores = profilesResponse.data.filter(
          (p: any) => p.aiScore && p.aiScore > 0
        ).length;

        const totalProfiles = profilesResponse.total || 0;

        const screeningProgress =
          totalProfiles > 0
            ? Math.round((profilesWithScores / totalProfiles) * 100)
            : 0;

        setStats([
          {
            label: 'Total Applicants',
            value: totalApplicants.toLocaleString(),
            change: '+5.2%',
            trend: 'up',
            icon: Users,
            color: 'text-cream'
          },
          {
            label: 'Active Jobs',
            value: activeJobs.toString(),
            change: '+1',
            trend: 'up',
            icon: Briefcase,
            color: 'text-emerald-500'
          },
          {
            label: 'Screening Progress',
            value: `${screeningProgress}%`,
            change: '+12%',
            trend: 'up',
            icon: ClipboardCheck,
            color: 'text-amber-500'
          }
        ]);

        // ✅ Recent Applicants
        const mappedApplicants = (profilesResponse.data || [])
          .slice(0, 3)
          .map((p: TalentProfile) => ({
            id: p._id || '',
            name: `${p.firstName} ${p.lastName}`,
            role: p.headline || 'Applicant',
            match: p.aiScore || 0,
            status:
              p.aiScore && p.aiScore >= 90
                ? 'High Match'
                : p.aiScore && p.aiScore > 0
                ? 'In Review'
                : 'Not Screened',
            avatar:
              `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}` || '?'
          }));

        setRecentApplicants(mappedApplicants);

      } catch (error) {
        console.error('Dashboard: Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-cream/10 pb-12">
          <h1 className="text-5xl font-black text-cream">
            Recruitment Intelligence
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} variant="glass" className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <stat.icon className="w-5 h-5 text-cream" />
                <div className="text-md font-bold text-cream/80">
                  {stat.label}
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <div className={`text-4xl font-black ${stat.color}`}>
                  {loading ? '...' : stat.value}
                </div>
                {!loading && (
                  <div className="text-xs text-emerald-500 flex items-center">
                    <ArrowUpRight size={12} /> {stat.change}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Applicants */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-cream font-bold">
              Recent applicants
            </h2>
            <Link href="/applicants">View All</Link>
          </div>

          {loading ? (
            <p className="text-cream">Loading...</p>
          ) : recentApplicants.map((app) => (
            <Link key={app.id} href={`/applicants/${app.id}`}>
              <Card className="p-4 mb-3 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-cream font-bold">{app.name}</h3>
                    <p className="text-cream/50">{app.role}</p>
                  </div>
                  <Badge>{app.status}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <button
            onClick={handleDownloadCSV}
            disabled={csvDownloading}
            className="w-full py-3 bg-cream text-dark rounded"
          >
            {csvDownloading ? 'Downloading…' : 'Download CSV'}
          </button>

          {csvError && (
            <p className="text-red-400 text-xs mt-2">{csvError}</p>
          )}
        </Card>

      </div>
    </div>
  );
}