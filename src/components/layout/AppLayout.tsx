import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calculator, Zap, Upload, Undo2,
  Users, Building, Settings, FileText, Beaker, Shield, Receipt
} from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { name: '給与計算', href: '/payroll/run', icon: Calculator },
  { name: '給与明細・根拠', href: '/payslip', icon: Receipt },
  { name: 'CSVアップロード', href: '/commission/upload', icon: Upload },
  { name: '戻入処理', href: '/clawback/pending', icon: Undo2 },
];

const engineNav = [
  { name: 'ANDO Engine', href: '/engine', icon: Zap },
  { name: 'What-if シミュレーション', href: '/simulation', icon: Beaker },
];

const masterNav = [
  { name: 'スタッフ管理', href: '/master/staff', icon: Users },
  { name: '保険会社・商品', href: '/master/insurance', icon: Building },
  { name: 'レポート', href: '/reports/monthly', icon: FileText },
  { name: '監査ログ', href: '/audit', icon: Shield },
  { name: 'システム設定', href: '/settings', icon: Settings },
];

function NavItem({ item, currentPath }: { item: { name: string; href: string; icon: React.ElementType }; currentPath: string }) {
  const isActive = currentPath.startsWith(item.href);
  return (
    <Link
      to={item.href}
      className={cn(
        isActive ? 'bg-white/10 text-white' : 'text-primary-foreground/70 hover:bg-white/5 hover:text-white',
        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
      )}
    >
      <item.icon className={cn(
        isActive ? 'text-secondary' : 'text-primary-foreground/40 group-hover:text-secondary',
        'mr-3 flex-shrink-0 h-4 w-4 transition-colors'
      )} />
      {item.name}
    </Link>
  );
}

function NavSection({ label, items, currentPath }: { label: string; items: typeof navigation; currentPath: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-primary-foreground/40 uppercase tracking-widest px-3 mb-1">{label}</div>
      {items.map(item => <NavItem key={item.name} item={item} currentPath={currentPath} />)}
    </div>
  );
}

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="flex w-60 flex-col bg-primary text-primary-foreground shrink-0">
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center px-5 border-b border-white/10">
          <span className="text-lg font-serif font-bold tracking-wider text-secondary">PROα</span>
          <span className="ml-2 text-xs text-primary-foreground/60 font-medium">AlphaPay</span>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto py-4 px-3 space-y-5">
          <NavSection label="メイン" items={navigation} currentPath={location.pathname} />
          <NavSection label="ANDO Engine" items={engineNav} currentPath={location.pathname} />
          <NavSection label="マスタ・設定" items={masterNav} currentPath={location.pathname} />
        </div>

        {/* User */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <span className="text-secondary font-bold text-sm">安</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">安東 弘敏</p>
              <p className="text-xs text-primary-foreground/50">MASTER ADMIN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
