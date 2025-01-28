import Link from "next/link"
import { Home, Users, Briefcase, Clock } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-background text-white p-4">
      <h1 className="text-2xl font-bold mb-8">Flik Admin</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/users" className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded">
              <Users size={20} />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link href="/workspaces" className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded">
              <Briefcase size={20} />
              <span>Workspaces</span>
            </Link>
          </li>
          <li>
            <Link href="/trials" className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded">
              <Clock size={20} />
              <span>Trials & Access</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

