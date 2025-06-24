import { useAuthStore } from "../stores/useAuthStore.js";
import { Link } from "react-router-dom";
import { LogOut, Coffee, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="border-b border-base-300/40 fixed w-full top-0 z-40 backdrop-blur-xl bg-base-100/80">
      <div className="container mx-auto px-8 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo section */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-4 hover:opacity-80 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                <Coffee className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-base-content">
                Yappuccino
              </h1>
            </Link>
          </div>

          {/* Navigation actions */}
          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-base-200/40 hover:bg-base-300/60 transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-base-300/30"
            >
              <div className="p-1.5 rounded-lg bg-base-300/30 group-hover:bg-primary/20 transition-all duration-200">
                <Settings className="w-4 h-4 text-base-content group-hover:text-primary" />
              </div>
              <span className="hidden sm:inline font-medium text-sm text-base-content">
                Settings
              </span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-base-200/40 hover:bg-base-300/60 transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-base-300/30"
                >
                  <div className="p-1.5 rounded-lg bg-base-300/30 group-hover:bg-primary/20 transition-all duration-200">
                    <User className="w-4 h-4 text-base-content group-hover:text-primary" />
                  </div>
                  <span className="hidden sm:inline font-medium text-sm text-base-content">
                    Profile
                  </span>
                </Link>

                <button
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-error/10 hover:bg-error/20 transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-error/20"
                  onClick={logout}
                >
                  <div className="p-1.5 rounded-lg bg-error/20 group-hover:bg-error/30 transition-all duration-200">
                    <LogOut className="w-4 h-4 text-error" />
                  </div>
                  <span className="hidden sm:inline font-medium text-sm text-error">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
