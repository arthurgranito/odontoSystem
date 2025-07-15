import {
  CalendarCheck,
  CalendarIcon,
  CalendarPlus,
  Clock,
  DollarSign,
  History,
  LayoutDashboard,
  LogOut,
  Tags,
  Users,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { RiToothLine } from "react-icons/ri";
import type { Dispatch, JSX, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface SidebarProps {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: JSX.Element;
  badge?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Agendamento",
    href: "/agendamento",
    icon: <CalendarPlus className="w-5 h-5" />,
  },
  {
    name: "Consultas Agendadas",
    href: "/consultas",
    icon: <CalendarCheck className="w-5 h-5" />,
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Histórico de Consultas",
    href: "/historico",
    icon: <History className="w-5 h-5" />,
  },
  {
    name: "Tipos de Consulta",
    href: "/tipos-consulta",
    icon: <Tags className="w-5 h-5" />,
  },
  {
    name: "Escalas de Trabalho",
    href: "/escalas",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    name: "Liberação de Agenda",
    href: "/liberacao-agenda",
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  {
    name: "Faturamento",
    href: "/faturamento",
    icon: <DollarSign className="w-5 h-5" />
  }
];

const Sidebar = ({ expanded, setExpanded }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false); // Sempre começar com tema claro

  useEffect(() => {
    // Sempre iniciar com tema claro
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 z-50 ${
      expanded ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className={`flex items-center gap-3 opacity-100 transition-opacity duration-200`}>
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <RiToothLine className="w-5 h-5 text-white" />
          </div>
          {expanded && (
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Consultório Odontologia
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sistema de Gestão
              </p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {expanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title={!expanded ? item.name : undefined}
              >
                <div className={`${isActive ? 'text-cyan-600' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                  {item.icon}
                </div>
                
                {expanded && (
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                )}
                
                {expanded && item.badge && (
                  <span className="ml-auto bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        <div className="space-y-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`w-full justify-start gap-3 px-3 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${
              !expanded ? 'px-3' : ''
            }`}
            title={!expanded ? (darkMode ? 'Tema Claro' : 'Tema Escuro') : undefined}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-slate-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-500" />
            )}
            {expanded && (
              <span className="font-medium text-sm">
                {darkMode ? 'Tema Claro' : 'Tema Escuro'}
              </span>
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
              !expanded ? 'px-3' : ''
            }`}
            title={!expanded ? 'Sair' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {expanded && (
              <span className="font-medium text-sm">Sair</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;