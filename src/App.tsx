/**
 * TIPO DE ARCHIVO: TSX (TypeScript + React)
 * DESCRIPCIÓN: Componente principal - Sistema de gestión Ferretería El Tornillo
 * LENGUAJE: TypeScript con JSX (se compila a JavaScript para el navegador)
 * NOTA: Este archivo NO se ejecuta directamente, se compila automáticamente
 */

import { useState } from "react";
import { POSHeader } from "./components/POSHeader";
import { EmployeeManagement } from "./components/EmployeeManagement";
import { InventoryManagement } from "./components/InventoryManagement";
import { InventoryReports } from "./components/InventoryReports";
import { NotificationsModule, PasswordRecoveryRequest } from "./components/NotificationsModule";
import { Login, UserData, UserRole } from "./components/Login";
import { EditProfile } from "./components/EditProfile";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import {
  Users,
  Package,
  Menu,
  LogOut,
  UserCog,
  BarChart3,
  Bell,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

type Module = "inventory" | "employees" | "reports" | "notifications";

// Definir qué módulos puede acceder cada rol
const rolePermissions: Record<UserRole, Module[]> = {
  admin: ["inventory", "employees", "reports", "notifications"],
  cashier: ["inventory", "reports"],
  warehouse: ["inventory", "reports"],
};

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeModule, setActiveModule] = useState<Module>("inventory");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [passwordRecoveryRequests, setPasswordRecoveryRequests] = useState<
    PasswordRecoveryRequest[]
  >([]);

  const pendingRecoveryRequests = passwordRecoveryRequests.filter(
    (r) => r.status === "pendiente"
  );

  const allModules = [
    {
      id: "inventory" as Module,
      name: "Inventario",
      icon: Package,
    },
    {
      id: "reports" as Module,
      name: "Reportes",
      icon: BarChart3,
    },
    {
      id: "employees" as Module,
      name: "Empleados",
      icon: Users,
    },
    {
      id: "notifications" as Module,
      name: "Notificaciones",
      icon: Bell,
      badge: pendingRecoveryRequests.length,
    },
  ];

  // Filtrar módulos según el rol del usuario
  const modules = user
    ? allModules.filter((module) =>
        rolePermissions[user.role].includes(module.id)
      )
    : [];

  // Actualizar el badge de notificaciones dinámicamente
  const modulesWithBadges = modules.map((module) => {
    if (module.id === "notifications") {
      return { ...module, badge: pendingRecoveryRequests.length };
    }
    return module;
  });

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    // Establecer el primer módulo disponible para el usuario
    const firstModule = rolePermissions[userData.role][0];
    setActiveModule(firstModule);
  };

  const confirmLogout = () => {
    toast.success("Sesión cerrada correctamente. ¡Hasta pronto!");
    setUser(null);
    setActiveModule("inventory");
    setSidebarOpen(true);
    setShowLogoutDialog(false);
  };

  const handleUpdateProfile = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  const handlePasswordRecoveryRequest = (request: PasswordRecoveryRequest) => {
    setPasswordRecoveryRequests([...passwordRecoveryRequests, request]);
  };

  const handleApproveRecoveryRequest = (id: string, newPassword: string) => {
    setPasswordRecoveryRequests(
      passwordRecoveryRequests.map((r) =>
        r.id === id ? { ...r, status: "aprobada" as const } : r
      )
    );
    // Aquí se actualizaría la contraseña del usuario en el sistema real
    console.log(`Nueva contraseña asignada: ${newPassword} para solicitud ${id}`);
  };

  const handleRejectRecoveryRequest = (id: string) => {
    setPasswordRecoveryRequests(
      passwordRecoveryRequests.map((r) =>
        r.id === id ? { ...r, status: "rechazada" as const } : r
      )
    );
  };

  // Si no hay usuario logueado, mostrar pantalla de login
  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Login 
          onLogin={handleLogin}
          onPasswordRecoveryRequest={handlePasswordRecoveryRequest}
        />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toaster position="top-right" />
      <POSHeader />

      {/* Diálogo de confirmación de cierre de sesión */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sí, cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de edición de perfil */}
      {user.role !== "admin" && (
        <EditProfile
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          user={user}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } bg-card border-r transition-all duration-300 flex-shrink-0 flex flex-col`}
        >
          <div className="p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {sidebarOpen && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-sm">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role === "admin"
                    ? "Administrador"
                    : user.role === "cashier"
                    ? "Supervisor"
                    : "Almacenista"}
                </p>
              </div>
            )}
          </div>
          <nav className="p-2 flex-1">
            {modulesWithBadges.map((module) => {
              const Icon = module.icon;
              const hasBadge = module.badge && module.badge > 0;
              return (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  className={`w-full justify-start mb-1 ${
                    !sidebarOpen && "justify-center"
                  } relative`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <Icon className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
                  {sidebarOpen && <span>{module.name}</span>}
                  {hasBadge && sidebarOpen && (
                    <Badge variant="destructive" className="ml-auto">
                      {module.badge}
                    </Badge>
                  )}
                  {hasBadge && !sidebarOpen && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full" />
                  )}
                </Button>
              );
            })}
          </nav>
          <div className="p-2 border-t space-y-1">
            {user.role !== "admin" && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  !sidebarOpen && "justify-center"
                }`}
                onClick={() => setShowEditProfile(true)}
              >
                <UserCog className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
                {sidebarOpen && <span>Editar Perfil</span>}
              </Button>
            )}
            <Button
              variant="ghost"
              className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
                !sidebarOpen && "justify-center"
              }`}
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
              {sidebarOpen && <span>Cerrar Sesión</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeModule === "inventory" && <InventoryManagement user={user} />}
          {activeModule === "reports" && <InventoryReports />}
          {activeModule === "employees" && <EmployeeManagement />}
          {activeModule === "notifications" && (
            <NotificationsModule
              requests={passwordRecoveryRequests}
              onApproveRequest={handleApproveRecoveryRequest}
              onRejectRequest={handleRejectRecoveryRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
}