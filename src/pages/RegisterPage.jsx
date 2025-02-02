import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="p-8 shadow-xl rounded-2xl bg-gray-800 text-center max-w-sm w-full sm:w-96">
        <h1 className="text-lg font-semibold text-gray-100 mb-6">
          Are you a User or an Organisation?
        </h1>
        <div className="flex flex-col gap-6">
          <Link to="/user/register">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
              I'm a User
            </button>
          </Link>
          <Link to="/organisation/register">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-400">
              I'm an Organisation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
