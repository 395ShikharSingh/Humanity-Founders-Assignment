import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-2xl shadow-xl p-8">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to Our Hospital
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Providing quality healthcare services with experienced doctors and modern facilities.
          </p>
          <div className="space-x-4">
            <Link 
              to="/public-doctors" 
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View Doctors
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1">
          <img
            src="/converted_image.jpg"
            alt="Hospital Building"
            className="w-full h-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
          <div className="text-primary-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Expert Doctors</h3>
          <p className="text-gray-600 leading-relaxed">
            Our team of experienced doctors provides the best medical care with years of expertise.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
          <div className="text-primary-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Modern Facilities</h3>
          <p className="text-gray-600 leading-relaxed">
            State-of-the-art equipment and comfortable environment for optimal patient care.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
          <div className="text-primary-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">24/7 Support</h3>
          <p className="text-gray-600 leading-relaxed">
            Round-the-clock medical assistance and emergency care services for your peace of mind.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home; 