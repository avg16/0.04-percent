import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 shadow-lg rounded-2xl bg-white text-center max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Are you a User or an Organisation?</h1>
        <div className="flex flex-col gap-4">
          <Link to="/user/register">
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg">I'm a User</button>
          </Link>
          <Link to="/organisation/register">
            <button className="w-full bg-green-500 text-white py-2 rounded-lg">I'm an Organisation</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
