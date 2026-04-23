'use client';

import React, { useState, Suspense, useCallback, useEffect, useRef } from 'react';
import {
  Filter,
  Trophy,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useSearchParams } from 'next/navigation';
import { screeningApi } from '@/lib/api/screening';
import { jobsApi } from '@/lib/api/jobs';
import toast from 'react-hot-toast';

function ScreeningResultsContent() {
  const [activeCandidateId, setActiveCandidateId] = useState<string | number>('');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  interface MappedResult {
    id: string;
    name: string;
    score: number;
    isBest: boolean;
    barColor: string;
    matchAnalysis: string;
    role: string;
    stats: { skills: number; experience: number; education: number };
  }

  const [results, setResults] = useState<MappedResult[]>([]);
  const [jobInfo, setJobInfo] = useState<{ title?: string; company?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [topLimit, setTopLimit] = useState('10');

  const pollingRef = useRef(0);

  const displayResults = results
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, topLimit === 'all' ? undefined : parseInt(topLimit, 10));

  const fetchData = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      const [versionsResponse, job] = await Promise.all([
        screeningApi.getResultVersions(jobId).catch(() => []),
        jobsApi.getJobById(jobId).catch(() => null)
      ]);

      setJobInfo(job ?? null);

      let resultsData = null;
      let processing = false;

      if (Array.isArray(versionsResponse) && versionsResponse.length > 0) {
        const latest = versionsResponse.reduce((a, b) =>
          b.version > a.version ? b : a
        );

        processing = latest.status !== 'completed';
        setIsPolling(processing);

        try {
          resultsData = await screeningApi.getResults(jobId, latest.version);
        } catch {
          return;
        }
      }

      if (!resultsData || !resultsData.rankedCandidates) {
        setResults([]);
        return;
      }

      const mapped = resultsData.rankedCandidates.map((c: any, i: number) => {
        const profile = c.profileId || {};
        const score = c.score || 0;

        return {
          id: profile._id || `temp-${i}`,
          name: profile.firstName
            ? `${profile.firstName} ${profile.lastName}`
            : `Candidate ${i + 1}`,
          score,
          isBest: i === 0,
          barColor: score >= 90 ? 'bg-emerald-500' : 'bg-blue-500',
          matchAnalysis: c.recommendation || '',
          role: profile.headline || 'Applicant',
          stats: {
            skills: score,
            experience: score,
            education: score
          }
        };
      });

      setResults(mapped);
      if (mapped.length > 0) setActiveCandidateId(mapped[0].id);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  // Auto polling
  useEffect(() => {
    if (!jobId) return;

    fetchData();

    const interval = setInterval(() => {
      pollingRef.current += 1;
      if (pollingRef.current < 20) {
        fetchData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchData, jobId]);

  const activeCandidate = results.find(c => c.id === activeCandidateId);

  const handleDownloadReport = () => {
    if (!activeCandidate) return;

    const blob = new Blob([activeCandidate.matchAnalysis], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${activeCandidate.name}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-dark text-cream min-h-screen">
      <TopNav />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-black mb-6">
            Screening Results
          </h1>

          {loading && results.length === 0 ? (
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}
              <Card className="p-4 space-y-4">
                <input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-dark border"
                />

                {displayResults.map((c, i) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveCandidateId(c.id)}
                    className="cursor-pointer p-3 border rounded"
                  >
                    {c.name} — {c.score}%
                  </div>
                ))}
              </Card>

              {/* RIGHT */}
              <div className="lg:col-span-2">
                <Card className="p-6 space-y-4">

                  <h2 className="text-2xl font-bold">
                    {activeCandidate?.name}
                  </h2>

                  <p>{activeCandidate?.matchAnalysis}</p>

                  <button onClick={handleDownloadReport}>
                    <Download />
                  </button>

                </Card>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScreeningResultsContent />
    </Suspense>
  );
}