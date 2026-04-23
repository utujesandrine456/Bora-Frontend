'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  MapPin,
  User,
  Check,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { profilesApi } from '@/lib/api/profiles';
import toast from 'react-hot-toast';
import { TalentProfile } from '@/lib/types/profile';

interface Applicant {
  id: number;
  dbId: string | undefined;
  name: string;
  role: string | undefined;
  location: string | undefined;
  score: number;
  status: string;
  date: string;
  avatar: string;
  screened: boolean;
  jobStatus: string;
}

export default function ApplicantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await profilesApi.getProfiles({ limit: 1000 });

      const mapped = response.data.map((p: TalentProfile, index: number) => ({
        id: index + 1,
        dbId: p._id,
        name: `${p.firstName} ${p.lastName}`,
        role: p.headline,
        location: p.location,
        score: p.aiScore || 0,
        status: p.aiScore ? 'Screened' : (p.availability?.status || 'New'),
        date: 'Recently',
        avatar: `${p.firstName[0]}${p.lastName[0]}`,
        screened: !!p.aiScore,
        jobStatus: (p as any).jobStatus || 'Open'
      }));

      setApplicants(mapped);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (applicant.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, applicants]);

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-cream/10 pb-8">
          <h1 className="text-5xl font-black text-cream">Applicants List</h1>
        </div>

        {/* Filters */}
        <div className="flex gap-6 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/30" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark border border-cream/20 rounded-md text-cream"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 border border-cream/20 text-cream"
          >
            <Filter /> Filters
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-cream">Loading...</p>
          ) : filteredApplicants.length > 0 ? (
            filteredApplicants.map((applicant) => {
              const id = applicant.dbId || applicant.id;

              return (
                <div
                  key={id}
                  onClick={() => setSelectedId(id)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`p-6 ${
                      selectedId === id
                        ? 'border-cream bg-cream/10'
                        : 'border-cream/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      
                      {/* Left */}
                      <div>
                        <h3 className="text-xl text-cream font-bold">
                          {applicant.name}
                        </h3>
                        <p className="text-cream/50">{applicant.role}</p>
                        <p className="text-cream/40 flex items-center gap-1">
                          <MapPin size={14} /> {applicant.location}
                        </p>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col gap-3">
                        
                        {applicant.screened && (
                          <Link href={`/screening/results?jobId=all`}>
                            <button className="px-4 py-2 bg-emerald-500 text-dark rounded">
                              <Sparkles size={14} /> Results
                            </button>
                          </Link>
                        )}

                        <Link href={`/applicants/${id}`}>
                          <button className="px-4 py-2 bg-cream text-dark rounded">
                            View Details
                          </button>
                        </Link>

                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className="text-center text-cream/50">
              <User size={40} />
              <p>No applicants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}