// src/components/navbar.tsx
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Branding */}
        <div className="font-extrabold text-3xl bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          ResuAI
        </div>

        {session?.user && (
          <div className="flex items-center gap-4">
            {/* User email */}
            <span className="text-sm text-gray-300 truncate max-w-[180px]">
              {session.user.email}
            </span>

            {/* Logout */}
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
