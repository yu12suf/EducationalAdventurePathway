import Link from 'next/link';
import { 
  FaSearch, 
  FaLanguage, 
  FaFileAlt, 
  FaUsers, 
  FaMoneyBillWave, 
  FaWifi, 
  FaRocket, 
  FaCheckCircle,
  FaArrowRight,
  FaGraduationCap,
  FaGlobe,
  FaChartLine
} from 'react-icons/fa';
import { MdOutlineSchool, MdOutlineRateReview } from 'react-icons/md';
import { IoIosTimer } from 'react-icons/io';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="block text-gray-900">Educational Adventure</span>
                <span className="block text-blue-600 mt-2">Pathway</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl lg:mx-0">
                Your all‑in‑one platform to discover scholarships, master English, 
                prepare winning documents, and connect with mentors — even offline.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    Get Started <FaRocket />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg shadow-md flex items-center gap-2 transition">
                    Sign In <FaArrowRight />
                  </button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 justify-center lg:justify-start">
                <FaCheckCircle className="text-green-500" /> 
                <span>No credit card required — start your journey for free</span>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Placeholder for an illustration – you can add an actual image later */}
              <div className="bg-blue-100 rounded-2xl p-8 shadow-xl border border-blue-200">
                <FaGraduationCap className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 italic">"Finally a platform that guides me through every step!"</p>
                <p className="mt-2 font-semibold">— Ahmed, Scholarship Recipient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider">Trusted by students from</p>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-gray-400 text-lg font-medium">
            <span>Ethiopia</span>
            <span>Kenya</span>
            <span>Nigeria</span>
            <span>Ghana</span>
            <span>Uganda</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to <span className="text-blue-600">succeed</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI, mentorship, and smart tools to prepare you for international education.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-blue-100">
              <FaSearch className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">AI Scholarship Matching</h3>
              <p className="mt-2 text-gray-600">
                Our engine scans thousands of scholarships and matches you with opportunities based on your profile, goals, and achievements.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-indigo-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-indigo-100">
              <FaLanguage className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">English Proficiency Assessment</h3>
              <p className="mt-2 text-gray-600">
                Take adaptive tests for reading, listening, grammar, and vocabulary. Get a CEFR score and a personalized learning path.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-green-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-green-100">
              <FaFileAlt className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Document Preparation Assistance</h3>
              <p className="mt-2 text-gray-600">
        Create competitive SOPs, CVs, and LORs with AI‑powered feedback — we guide, you write. Never start from scratch.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-purple-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-purple-100">
              <FaUsers className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Expert Counselor Mentorship</h3>
              <p className="mt-2 text-gray-600">
                Connect with verified counselors who have walked the path. Book sessions, get personalized advice, and stay on track.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-yellow-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-yellow-100">
              <FaMoneyBillWave className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Financial Proof Builder</h3>
              <p className="mt-2 text-gray-600">
                Never be rejected due to incorrect financial documents. Generate correctly formatted affidavits and support letters for visas and scholarships.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-red-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-red-100">
              <FaWifi className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Offline‑First</h3>
              <p className="mt-2 text-gray-600">
                Study materials, document drafts, and progress are stored locally. Sync when you're back online — perfect for unstable connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your journey in <span className="text-blue-600">three simple steps</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900">Create your profile</h3>
              <p className="mt-2 text-gray-600">
                Tell us about your academic background, goals, and target countries. The more you share, the better we match.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full text-indigo-600 text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900">Assess & prepare</h3>
              <p className="mt-2 text-gray-600">
                Take our English assessment, start document drafts, and explore matched scholarships. Our AI guides you.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-600 text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900">Apply with confidence</h3>
              <p className="mt-2 text-gray-600">
                Submit your polished documents, track deadlines, and get feedback from counselors — all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What students say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="text-gray-700 italic">
                "The English assessment helped me realise my weak points. I improved my score by a full band!"
              </p>
              <p className="mt-4 font-semibold">— Meron T., Addis Ababa</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="text-gray-700 italic">
                "Without the counselor sessions, I would have missed the DAAD deadline. Lifesaver!"
              </p>
              <p className="mt-4 font-semibold">— John K., Nairobi</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="text-gray-700 italic">
                "Offline access meant I could prepare during power outages. A truly thoughtful design."
              </p>
              <p className="mt-4 font-semibold">— Fatima A., Kampala</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start your educational adventure today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already using our platform to achieve their dreams.
          </p>
          <Link href="/register">
            <button className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg flex items-center gap-2 mx-auto transition transform hover:scale-105">
              Create Free Account <FaArrowRight />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Educational Adventure Pathway</h4>
              <p className="text-sm">Empowering Ethiopian and African students to access international education.</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Educational Adventure Pathway. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};