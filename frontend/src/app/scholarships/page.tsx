'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { scholarshipService } from '@/services/scholarship.service';
import { Scholarship } from '@/types/scholarship';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FaSearch, FaFilter, FaTimes, FaBookmark, FaRegBookmark } from 'react-icons/fa';

export default function ScholarshipsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    country: searchParams.get('country') || '',
    degreeLevel: searchParams.get('degreeLevel') || '',
    field: searchParams.get('field') || '',
    fundingType: searchParams.get('fundingType') || '',
    keyword: searchParams.get('keyword') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Fetch saved scholarships if logged in
  useEffect(() => {
    if (user) {
      scholarshipService.getSavedScholarships().then(res => {
        const ids = res.data.map((s: any) => s.scholarship._id);
        setSavedIds(new Set(ids));
      }).catch(console.error);
    }
  }, [user]);

  // Fetch scholarships when filters or page change
  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };
        // Add studentId if logged in to get match scores
        if (user) {
          params.studentId = user.id;
        }
        // Remove empty filters
        Object.keys(params).forEach(key => !params[key] && delete params[key]);

        const data = await scholarshipService.getScholarships(params);
        setScholarships(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch scholarships', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [filters, pagination.page, user]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/scholarships?${params.toString()}`, { scroll: false });
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 }); // reset to first page
  };

  const clearFilters = () => {
    setFilters({ country: '', degreeLevel: '', field: '', fundingType: '', keyword: '' });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSaveToggle = async (scholarshipId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      if (savedIds.has(scholarshipId)) {
        await scholarshipService.unsaveScholarship(scholarshipId);
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(scholarshipId);
          return next;
        });
      } else {
        await scholarshipService.saveScholarship(scholarshipId);
        setSavedIds(prev => new Set(prev).add(scholarshipId));
      }
    } catch (error) {
      console.error('Failed to toggle save', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Discover Scholarships</h1>
          <p className="mt-2 text-gray-600">
            Find opportunities matching your profile from around the world.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Search by keyword..."
              // icon prop removed because Input doesn't support it
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto"
          >
            <FaFilter className="mr-2" /> Filters
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter Scholarships</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <Input
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  placeholder="e.g., Germany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
                <select
                  name="degreeLevel"
                  value={filters.degreeLevel}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All levels</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="master">Master's</option>
                  <option value="phd">PhD</option>
                  <option value="postdoc">Postdoc</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <Input
                  name="field"
                  value={filters.field}
                  onChange={handleFilterChange}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funding Type</label>
                <select
                  name="fundingType"
                  value={filters.fundingType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="full">Fully Funded</option>
                  <option value="partial">Partially Funded</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No scholarships found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200"
                >
                  <Link href={`/scholarships/${scholarship._id}`}>
                    <div className="p-6 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                          {scholarship.title}
                        </h2>
                        {scholarship.matchScore !== undefined && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {scholarship.matchScore}% Match
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {scholarship.provider} · {scholarship.country}
                      </p>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {scholarship.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {scholarship.fundingType === 'full' ? 'Fully Funded' : scholarship.fundingType}
                        </span>
                        {scholarship.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-gray-400">
                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {scholarship.views} views
                    </span>
                    <button
                      onClick={() => handleSaveToggle(scholarship._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title={savedIds.has(scholarship._id) ? 'Remove from saved' : 'Save scholarship'}
                    >
                      {savedIds.has(scholarship._id) ? (
                        <FaBookmark className="h-5 w-5" />
                      ) : (
                        <FaRegBookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}