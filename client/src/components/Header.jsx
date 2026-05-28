import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, LogOut, Search, LayoutDashboard, ClipboardList } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { useGetCart } from "../hooks/cartHook";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cart } = useGetCart();
  const userObj = user?.user; 
  const role = userObj?.role; 
  const navigate = useNavigate();

  const isAdmin = isAuthenticated && role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 1. Admin Alert Banner (Renders above layout without breaking navigation structures) */}
      {isAdmin && (
        <div className="bg-red-600 text-white text-center py-1 text-xs font-semibold tracking-wide">
          Admin Access Mode — Store Management Active
        </div>
      )}

      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        
        {/* Logo */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter">
            STORE <span className="text-xs font-medium text-muted-foreground">{isAdmin && "(Admin)"}</span>
          </span>
        </Link>

        {/* Search Bar - Hidden for admins since they track metadata directly via dashboard panels */}
        {!isAdmin && (
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
        )}

        {/* Global Navigation links wrapper */}
        <nav className="flex items-center gap-2 ml-auto">
          {/* Base Navigation Anchor Route adjustment */}
          <Button variant="ghost" asChild>
            <NavLink to={isAdmin ? "/admin" : "/"}>
              {isAdmin ? "Dashboard" : "Home"}
            </NavLink>
          </Button>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <NavLink to="/signin">Sign In</NavLink>
              </Button>
              <Button asChild>
                <NavLink to="/signup">Sign Up</NavLink>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Cart Button - Excluded from Admin views */}
              {!isAdmin && (
                <Button variant="outline" size="icon" className="relative rounded-full" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                      {cart?.summary?.totalItems || 0}
                    </span>
                  </Link>
                </Button>
              )}

              {/* Profile Dropdown Component Container */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full select-none">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarFallback className="bg-neutral-950 text-primary-foreground font-semibold">
                        {userObj?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none truncate max-w-[130px]">{userObj?.name}</p>
                        {isAdmin && (
                          <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {userObj?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />

                  {/* 2. Contextual Routing Logic Blocks inside Action Menus */}
                  {isAdmin ? (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="focus:text-primary">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/orders-history')} className="focus:text-primary">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;