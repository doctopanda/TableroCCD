import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import $ from 'jquery';
import 'datatables.net-dt';

// --- CONFIGURACIÓN DE SUPABASE ---
// NOTA: Mueve estas claves a un archivo .env.local en un proyecto real
const SUPABASE_URL = 'https://pmgehnnjgbfcrkjdpkml.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ2Vobm5qZ2JmY3JramRwa21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzUyNTUsImV4cCI6MjA2NTc1MTI1NX0.3rCrfOG_Jh-saeSiMQ64UfLqDLqiaSponusx87muE-g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DATOS INICIALES (ESTÁTICOS) ---
const municipalityData = {
  "DSB 01": { name: "DSB 01 Hermosillo", municipalities: [ { name: "Aconchi" }, { name: "Arivechi" }, { name: "Bacadéhuachi" }, { name: "Bacanora" }, { name: "Banámichi" }, { name: "Baviácora" }, { name: "Carbó" }, { name: "La Colorada" }, { name: "Cumpas" }, { name: "Divisaderos" }, { name: "Granados" }, { name: "Hermosillo" }, { name: "Huásabas" }, { name: "Huépac" }, { name: "Mazatán" }, { name: "Moctezuma" }, { name: "Nácori Chico" }, { name: "Nacozari de García" }, { name: "Ónavas" }, { name: "Opodepe" }, { name: "Rayón" }, { name: "Sahuaripa" }, { name: "San Felipe de Jesús" }, { name: "San Javier" }, { name: "San Miguel de Horcasitas" }, { name: "San Pedro de la Cueva" }, { name: "Soyopa" }, { name: "Suaqui Grande" }, { name: "Tepache" }, { name: "Ures" }, { name: "Villa Hidalgo" }, { name: "Villa Pesqueira" } ] },
  "DSB 02": { name: "DSB 02 Caborca", municipalities: [ { name: "Altar" }, { name: "Átil" }, { name: "Caborca" }, { name: "Oquitoa" }, { name: "Pitiquito" }, { name: "Sáric" }, { name: "Tubutama" } ] },
  "DSB 03": { name: "DSB 03 Santa Ana", municipalities: [ { name: "Agua Prieta" }, { name: "Arizpe" }, { name: "Bacerac" }, { name: "Bacoachi" }, { name: "Bavispe" }, { name: "Benjamín Hill" }, { name: "Cananea" }, { name: "Cucurpe" }, { name: "Fronteras" }, { name: "Huachinera" }, { name: "Imuris" }, { name: "Magdalena" }, { name: "Naco" }, { name: "Nogales" }, { name: "Santa Ana" }, { name: "Santa Cruz" }, { name: "Trincheras" } ] },
  "DSB 04": { name: "DSB 04 Ciudad Obregón", municipalities: [ { name: "Bácum" }, { name: "Cajeme" }, { name: "Empalme" }, { name: "Guaymas" }, { name: "Quiriego" }, { name: "Rosario" }, { name: "Yécora" }, { name: "San Ignacio Río Muerto" } ] },
  "DSB 05": { name: "DSB 05 Navojoa", municipalities: [ { name: "Álamos" }, { name: "Etchojoa" }, { name: "Huatabampo" }, { name: "Navojoa" }, { name: "Benito Juárez" } ] },
  "DSB 06": { name: "DSB 06 San Luis Río Colorado", municipalities: [ { name: "Puerto Peñasco" }, { name: "San Luis Río Colorado" }, { name: "General Plutarco Elías Calles" } ] }
};
const availableFolders = { 
    "Plan_distrital_de_Participacion_Social": "Plan Distrital de Participación Social", 
    "Indicadores_PAE": "Indicadores PAE", 
    "Diagnostico_Participativo": "Diagnóstico Participativo", 
    "Tablero_de_Desiertos": "Tablero de Desiertos", 
    "Tablero_de_Brechas": "Tablero de Brechas", 
    "Canales_endemicos": "Canales Endémicos" 
};

// --- COMPONENTE PARA TABLAS (DataTables) ---
function DataTable({ id, data, columns }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      data: data,
      columns: columns,
      responsive: true,
      destroy: true, // Permite reinicializar la tabla
      language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' }
    });

    return () => {
      table.destroy();
    };
  }, [data, columns]);

  return <table id={id} ref={tableRef} className="display w-full"></table>;
}


// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function App() {
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [view, setView] = useState('login'); // login, register, app

    useEffect(() => {
        // Cargar sesión existente
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchUserProfile(session.user);
            } else {
                setView('login');
            }
        });

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchUserProfile(session.user);
            } else {
                setUserProfile(null);
                setView('login');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = useCallback(async (user) => {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile && profile.aprobado) {
            setUserProfile(profile);
            setView('app');
        } else {
             if (!profile) alert("Error: No se encontró un perfil para este usuario.");
             else if (!profile.aprobado) alert("Tu cuenta aún no ha sido aprobada.");
             await supabase.auth.signOut();
             setView('login');
        }
    }, []);


    if (view === 'login' || view === 'register') {
        return <AuthScreen view={view} setView={setView} />;
    }
    
    if (view === 'app' && userProfile) {
        return <MainApp userProfile={userProfile} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-2xl font-bold text-gray-700">Cargando...</div>
        </div>
    );
}

// --- PANTALLA DE AUTENTICACIÓN ---
function AuthScreen({ view, setView }) {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { email, password } = Object.fromEntries(new FormData(e.target));
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
    };
    
    const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setMessage('');
      const formData = Object.fromEntries(new FormData(e.target));
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre_completo: formData.nombre_completo,
            distrito: formData.distrito,
            municipio: formData.municipio,
            estado: 'Sonora',
            fecha_nacimiento: formData.fecha_nacimiento
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.');
        e.target.reset();
      }
      setLoading(false);
    };
    
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="md:w-1/2 bg-[#8C1D40] text-white flex flex-col justify-center p-12">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Centro de Datos de la Dirección General de Servicios de Salud Pública de Sonora</h1>
          <p className="text-lg text-red-100 opacity-90">Información para decisiones estratégicas en salud pública.</p>
        </div>
        <div className="md:w-1/2 bg-white flex items-center justify-center p-8">
            {view === 'login' ? (
                <LoginForm onSubmit={handleLogin} setView={setView} error={error} loading={loading} />
            ) : (
                <RegisterForm onSubmit={handleRegister} setView={setView} error={error} message={message} loading={loading} />
            )}
        </div>
      </div>
    );
}

// --- FORMULARIOS ---
function LoginForm({ onSubmit, setView, error, loading }) {
    return (
        <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600 mb-8">Bienvenido de nuevo.</p>
            <form id="login-form" onSubmit={onSubmit}>
                <div className="mb-4">
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input name="email" type="email" id="login-email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8C1D40] focus:border-[#8C1D40]" />
                </div>
                <div className="mb-6">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input name="password" type="password" id="login-password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8C1D40] focus:border-[#8C1D40]" />
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
                <button type="submit" disabled={loading} className="w-full bg-[#8C1D40] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#791937] transition duration-300 flex items-center justify-center">
                    {loading ? <Spinner /> : 'Iniciar Sesión'}
                </button>
            </form>
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">¿No tienes una cuenta? <button onClick={() => setView('register')} className="font-medium text-[#8C1D40] hover:underline">Regístrate aquí</button></p>
            </div>
        </div>
    );
}

function RegisterForm({ onSubmit, setView, error, message, loading }) {
    return (
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Solicitud de Registro</h2>
        <p className="text-gray-600 mb-8">Tu cuenta requerirá aprobación de un administrador.</p>
        <form id="register-form" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input name="nombre_completo" type="text" id="register-name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input name="email" type="email" id="register-email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input name="password" type="password" id="register-password" required minLength="8" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="register-distrito" className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
              <select name="distrito" id="register-distrito" required className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">Selecciona un distrito</option>
                <option value="DSB 01">DSB 01</option><option value="DSB 02">DSB 02</option><option value="DSB 03">DSB 03</option>
                <option value="DSB 04">DSB 04</option><option value="DSB 05">DSB 05</option><option value="DSB 06">DSB 06</option>
              </select>
            </div>
            <div>
              <label htmlFor="register-municipio" className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <input name="municipio" type="text" id="register-municipio" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
             <div>
              <label htmlFor="register-dob" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input name="fecha_nacimiento" type="date" id="register-dob" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          {message && <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
          <div className="mt-8 flex justify-between items-center">
            <button onClick={() => setView('login')} className="text-sm font-medium text-[#8C1D40] hover:underline">&larr; Volver a Iniciar Sesión</button>
            <button type="submit" disabled={loading} className="bg-[#8C1D40] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#791937] flex items-center justify-center">
               {loading ? <Spinner /> : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    );
}

// --- APLICACIÓN PRINCIPAL (POST-LOGIN) ---
function MainApp({ userProfile }) {
    const [appView, setAppView] = useState('dashboard'); // dashboard, admin
    
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar userProfile={userProfile} setAppView={setAppView} />
            <main className="flex-1 p-8 bg-gray-100">
                {appView === 'dashboard' && <Dashboard userProfile={userProfile} />}
                {appView === 'admin' && <AdminPanel userProfile={userProfile} />}
            </main>
        </div>
    );
}

// --- COMPONENTES DE LA APP ---
function Sidebar({ userProfile, setAppView }) {
    return (
        <aside className="md:w-1/4 lg:w-1/5 xl:w-1/6 bg-[#8C1D40] text-white p-6 flex flex-col">
            <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-8 border-b border-red-100 border-opacity-30 pb-4">Centro de Datos</h2>
                
                {userProfile.rol === 'administrador' && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-red-100 opacity-70 uppercase tracking-wider mb-2">Administración</h3>
                        <button onClick={() => setAppView('admin')} className="w-full text-left flex items-center px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
                            <UsersIcon /> Gestionar Usuarios
                        </button>
                         <button onClick={() => setAppView('dashboard')} className="w-full text-left flex items-center px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
                            <DashboardIcon /> Dashboard
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-6 border-t border-red-100 border-opacity-30 pt-6">
                <p className="text-sm font-medium">{userProfile.nombre_completo}</p>
                <p className="text-xs text-red-100 opacity-80">{userProfile.email}</p>
                <button onClick={() => supabase.auth.signOut()} className="w-full mt-4 text-left flex items-center px-4 py-2 text-sm text-red-100 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
                    <LogoutIcon /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}

function Dashboard({ userProfile }) {
    // Lógica para el dashboard principal
    return <div>Dashboard View - Próximamente</div>;
}

function AdminPanel({ userProfile }) {
    // Lógica para el panel de administración
    return <div>Admin Panel - Próximamente</div>;
}


// --- ÍCONOS Y SPINNERS ---
function Spinner() {
    return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
}
function UsersIcon() {
    return <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.07 10.07 0 01-3.73 2.28.75.75 0 11-1.04-1.082 8.57 8.57 0 003.022-1.922.75.75 0 01.983-.056z" /></svg>;
}
function DashboardIcon() {
    return <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
}
function LogoutIcon() {
    return <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
}
