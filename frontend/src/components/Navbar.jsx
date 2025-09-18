import { Sun, Moon } from "lucide-react"; // iconos

export default function Navbar({ user, onLogout, onToggleTheme, theme }) {
  return (
    <nav className="bg-brand text-white p-4 flex justify-between items-center shadow-md dark:bg-brand-dark">
      <div className="text-xl font-bold">Tablero CCD</div>
      <div className="flex gap-4 items-center">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded hover:bg-white/20 transition"
          title="Cambiar tema"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user && (
          <>
            <span className="italic">
              {user.email} ({user.rol})
            </span>
            <button
              onClick={onLogout}
              className="bg-danger px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
