'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaSearch, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaSignOutAlt,
  FaBookOpen,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isStudent = user.role === 'student';
  const isCounselor = user.role === 'counselor';
  const profileCompleted = user.profileCompleted || false; // assume this exists

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">EduPathway</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg font-medium">
              <FaUserGraduate className="mr-3 text-blue-600" /> Dashboard
            </Link>
            {isStudent && (
              <>
                <Link href="/scholarships" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <FaSearch className="mr-3" /> Find Scholarships
                </Link>
                <Link href="/documents" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <FaFileAlt className="mr-3" /> My Documents
                </Link>
                <Link href="/counselors" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <FaChalkboardTeacher className="mr-3" /> Counselors
                </Link>
              </>
            )}
            {isCounselor && (
              <>
                <Link href="/sessions" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <FaCalendarAlt className="mr-3" /> Sessions
                </Link>
                <Link href="/students" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <FaUsers className="mr-3" /> My Students
                </Link>
                <Link href="/availability" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <FaCalendarAlt className="mr-3" /> Availability
                </Link>
              </>
            )}
            <Link href="/profile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <FaUserGraduate className="mr-3" /> Profile
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </nav>
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar (mobile) */}
        <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">EduPathway</h1>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              {isStudent 
                ? 'Continue your journey to international education.' 
                : 'Help students achieve their dreams.'}
            </p>
          </div>

          {/* Profile Completion Alert (if incomplete) */}
          {!profileCompleted && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <FaExclamationCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your profile is incomplete.{' '}
                    <Link href={isStudent ? '/profile-setup' : '/counselor-profile-setup'} className="font-medium underline hover:text-yellow-600">
                      Complete it now
                    </Link>{' '}
                    to unlock full features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isStudent ? (
              <>
                <StatCard
                  icon={<FaSearch className="text-blue-600" />}
                  label="Matched Scholarships"
                  value="24"
                  change="+6 new"
                  positive
                />
                <StatCard
                  icon={<FaFileAlt className="text-green-600" />}
                  label="Documents Ready"
                  value="3/5"
                  subtext="Complete 2 more"
                />
                <StatCard
                  icon={<FaCalendarAlt className="text-purple-600" />}
                  label="Upcoming Deadlines"
                  value="4"
                  subtext="Next: Apr 15"
                />
                <StatCard
                  icon={<FaChalkboardTeacher className="text-orange-600" />}
                  label="Counselor Sessions"
                  value="2"
                  subtext="1 pending"
                />
              </>
            ) : (
              <>
                <StatCard
                  icon={<FaUsers className="text-blue-600" />}
                  label="Assigned Students"
                  value="12"
                  subtext="+2 this week"
                  positive
                />
                <StatCard
                  icon={<FaCalendarAlt className="text-green-600" />}
                  label="Upcoming Sessions"
                  value="5"
                  subtext="Next: Today 3pm"
                />
                <StatCard
                  icon={<FaMoneyBillWave className="text-purple-600" />}
                  label="Earnings (MTD)"
                  value="$340"
                  subtext="+$120 from last month"
                  positive
                />
                <StatCard
                  icon={<FaCheckCircle className="text-orange-600" />}
                  label="Pending Verifications"
                  value="3"
                  subtext="Awaiting approval"
                />
              </>
            )}
          </div>

          {/* Two‑column layout for main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity / Upcoming Events */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {isStudent ? 'Recent Scholarships' : 'Upcoming Sessions'}
                </h2>
                <div className="space-y-3">
                  {isStudent ? (
                    <>
                      <ActivityItem
                        title="DAAD Scholarship 2026"
                        subtitle="Deadline: May 31, 2026 · Match: 92%"
                        status="high"
                      />
                      <ActivityItem
                        title="Chevening Scholarship"
                        subtitle="Deadline: Nov 1, 2026 · Match: 78%"
                        status="medium"
                      />
                      <ActivityItem
                        title="Mastercard Foundation"
                        subtitle="Deadline: Dec 15, 2026 · Match: 65%"
                        status="low"
                      />
                    </>
                  ) : (
                    <>
                      <ActivityItem
                        title="Session with Meron T."
                        subtitle="Today, 3:00 PM - Video call"
                        status="upcoming"
                      />
                      <ActivityItem
                        title="Session with John K."
                        subtitle="Tomorrow, 10:00 AM - Audio call"
                        status="upcoming"
                      />
                      <ActivityItem
                        title="Document review for Fatima A."
                        subtitle="Pending · Submitted yesterday"
                        status="pending"
                      />
                    </>
                  )}
                  <Link href="#" className="block text-center text-sm text-blue-600 hover:underline pt-2">
                    View all
                  </Link>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {isStudent ? (
                    <>
                      <QuickActionButton
                        icon={<FaSearch />}
                        label="Find Scholarships"
                        href="/scholarships"
                      />
                      <QuickActionButton
                        icon={<FaFileAlt />}
                        label="Upload Document"
                        href="/documents/upload"
                      />
                      <QuickActionButton
                        icon={<FaChalkboardTeacher />}
                        label="Book Counselor"
                        href="/counselors"
                      />
                      <QuickActionButton
                        icon={<FaBookOpen />}
                        label="English Assessment"
                        href="/assessment"
                      />
                    </>
                  ) : (
                    <>
                      <QuickActionButton
                        icon={<FaCalendarAlt />}
                        label="Set Availability"
                        href="/availability"
                      />
                      <QuickActionButton
                        icon={<FaUsers />}
                        label="View Students"
                        href="/students"
                      />
                      <QuickActionButton
                        icon={<FaFileAlt />}
                        label="Review Documents"
                        href="/documents/review"
                      />
                      <QuickActionButton
                        icon={<FaMoneyBillWave />}
                        label="Earnings"
                        href="/earnings"
                      />
                    </>
                  )}
                </div>
              </section>
            </div>

            {/* Right column (1/3 width) */}
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email verified</span>
                    {user.emailVerified ? (
                      <span className="text-green-600 flex items-center"><FaCheckCircle className="mr-1" /> Yes</span>
                    ) : (
                      <span className="text-yellow-600 flex items-center"><FaExclamationCircle className="mr-1" /> No</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile completion</span>
                    <span className="font-medium">{profileCompleted ? '100%' : 'Incomplete'}</span>
                  </div>
                  {isStudent && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nationality</span>
                        <span className="font-medium">Ethiopian</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target level</span>
                        <span className="font-medium">Master's</span>
                      </div>
                    </>
                  )}
                  {isCounselor && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verification</span>
                        <span className="font-medium text-yellow-600">Pending</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hourly rate</span>
                        <span className="font-medium">$20</span>
                      </div>
                    </>
                  )}
                </div>
                <Link href="/profile" className="block mt-4 text-center text-sm text-blue-600 hover:underline">
                  Edit profile
                </Link>
              </div>

              {/* Help & Support */}
              <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Need help?</h2>
                <p className="text-sm text-blue-700 mb-4">
                  Our support team is here to assist you with any questions.
                </p>
                <Button variant="primary" size="sm" fullWidth>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, subtext, change, positive }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="text-3xl">{icon}</div>
        {change && (
          <span className={`text-xs font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

function ActivityItem({ title, subtitle, status }: any) {
  const statusColors: Record<string, string> = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-gray-500',
    upcoming: 'text-blue-600',
    pending: 'text-orange-600',
  };
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <span className={`text-xs font-semibold ${statusColors[status] || 'text-gray-500'}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}

function QuickActionButton({ icon, label, href }: any) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-center"
    >
      <div className="text-2xl text-blue-600 mb-2">{icon}</div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </Link>
  );
}