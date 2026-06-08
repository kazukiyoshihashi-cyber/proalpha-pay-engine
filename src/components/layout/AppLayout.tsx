import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calculator, Percent, Upload, Undo2, Users, Building, Settings, FileText } from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { name: '給与計算', href: '/payroll/run', icon: Calculator },
  { name: '計算式設定', href: '/master/rate-formulas', icon: Percent },
  { name: 'CSVアップロード', href: '/commission/upload', icon: Upload },
  { name: '戻入処理', href: '/clawback/pending', icon: Undo2 },
];

const secondaryNav = [
  { name: 'スタッフ管理', href: '/master/staff', icon: Users },
  { name: '保険会社・商品', href: '/master/insurance-companies', icon: Building },
  { name: 'レポート', href: '/reports/monthly', icon: FileText },
  { name: 'システム設定', href: '/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="flex w-64 flex-col bg-primary text-primary-foreground">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
          <span className="text-xl font-serif font-bold tracking-wider text-secondary">PROα</span>
          <span className="ml-2 text-sm text-primary-foreground/80">Pay Engine</span>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 py-6">
            <div className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider mb-2">Main Menu</div>
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive ? 'bg-white/10 text-white' : 'text-primary-foreground/80 hover:bg-white/5 hover:text-white',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-secondary' : 'text-primary-foreground/50 group-hover:text-secondary',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}

            <div className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider mb-2 mt-8">Master & Settings</div>
            {secondaryNav.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive ? 'bg-white/10 text-white' : 'text-primary-foreground/80 hover:bg-white/5 hover:text-white',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-secondary' : 'text-primary-foreground/50 group-hover:text-secondary',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User profile */}
        <div className="flex shrink-0 border-t border-white/10 p-4">
          <div className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <div className="inline-block h-9 w-9 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary font-bold">安</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">安東 弘敏</p>
                <p className="text-xs font-medium text-primary-foreground/50">ADMIN</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
