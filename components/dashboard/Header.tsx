import type { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useState } from "react";
export default function Header({
  user,
  onLogout,
}: { user: User | null; onLogout: () => void }) {
  const [hiddenLogout,setHiddenLogout] = useState<boolean>(true)
  return (
    <header className="flex items-center justify-between px-6 bg-slate-800 py-4 text-white shadow-sm sticky top-0">
      <h1 className="text-xl font-semibold ">Chloe</h1>
      <div 
        onMouseLeave={()=>setHiddenLogout(true)}
        className="relative flex items-center gap-4 sm:text-sm text-xs">
        
        <div 
        className={`absolute top-8 right-4 bg-slate-900 p-5 rounded-xl ${hiddenLogout ? "hidden" : "block"}`}>
        {user?.email && <span className="text-white">{user.email}</span>}
        <button 
          
          onClick={onLogout} className="flex w-full  justify-center flex-row gap-2 p-3 bg-red-600 rounded-2xl my-3 cursor-pointer">
            Log out <LogOut size={15} className="my-auto"/>
        </button>
        </div>
        <button
        onMouseEnter={()=>setHiddenLogout(false)}
        
        className="rounded-full p-2 hover:bg-gray-200 transition text-red-500"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}