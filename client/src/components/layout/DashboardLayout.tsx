import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Users,
  Wrench,
  FileText,
  Settings,
  LogOut,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/button';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Manager'] },
    { name: 'Service Requests', href: '/requests', icon: FileText, roles: ['Admin', 'Manager'] },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, roles: ['Admin', 'Manager'] },
    { name: 'Customers', href: '/customers', icon: Users, roles: ['Admin', 'Manager'] },
    { name: 'Technicians', href: '/technicians', icon: Wrench, roles: ['Admin', 'Manager'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const allowedNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Smart Field</h1>
          <p className="text-sm text-muted-foreground mt-1">Service Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {allowedNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b bg-background flex items-center px-6 md:hidden">
          <span className="font-bold text-lg">Smart Field</span>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
