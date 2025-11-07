// Credenciales de admin (fijas por ahora)
const ADMIN_nameuser = 'admin';
const ADMIN_PASS = 'admin1234';



// 🧹 Limpiar credenciales anteriores al entrar al login
document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('adminLogged');
  localStorage.removeItem('nameuser');
  localStorage.removeItem('email');
  localStorage.removeItem('token'); // por si en un futuro usás JWT u otro tipo
  localStorage.clear();
  console.log('Sesión anterior eliminada.');
});


// 🔹 Funciones para mostrar y ocultar formularios
function mostrarRegistro() {
  document.getElementById("login-box").classList.add("oculto");
  document.getElementById("register-box").classList.remove("oculto");
  document.getElementById("login-text").classList.add("oculto");
  document.getElementById("register-text").classList.remove("oculto");
}

function mostrarLogin() {
  document.getElementById("register-box").classList.add("oculto");
  document.getElementById("login-box").classList.remove("oculto");
  document.getElementById("register-text").classList.add("oculto");
  document.getElementById("login-text").classList.remove("oculto");
}

async function login() {
  const nameuser = document.getElementById("loginnameuser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (!nameuser || !pass) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Si es admin
  if (nameuser === ADMIN_nameuser && pass === ADMIN_PASS) {
    localStorage.setItem('adminLogged', 'true');
    alert(`Bienvenido, ${nameuser} (Admin)`);
    window.location.replace("admin.html");
    return;
  }

  // Si es usuario común
  try {
    const res = await fetch('https://backend-cantina.onrender.com/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nameuser, pass })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Error en el login');

    // ✅ Guardamos sesión del usuario
    localStorage.setItem('nameuser', data.nameuser);
    localStorage.setItem('email', data.email);
    localStorage.setItem('nameuserLogged', 'true');

    alert(`Bienvenido ${data.nameuser}`);
    window.location.replace('home.html'); // o index.html, según tu estructura
  } catch (err) {
    console.error('Error en login:', err);
    alert('Usuario o contraseña incorrectos');
  }
}


// ✍️ Registro de usuarios (DB)
async function registrar() {
    const nameuser = document.getElementById("regnameuser").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    const email = document.getElementById("regEmail").value.trim();

    if (!nameuser || !pass || !email) {
        alert("Completa todos los campos para registrarte.");
        return;
    }

    try {
        const res = await fetch('https://backend-cantina.onrender.com/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nameuser, pass, email })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Error al registrar');
        }

        alert(`Usuario ${nameuser} registrado con éxito`);
        mostrarLogin();
    } catch (err) {
        alert(err.message);
    }
}

// 🔒 Logout
function logout() {
    localStorage.removeItem('adminLogged');
    localStorage.removeItem('nameuserLogged');
    window.location.replace('login.html');
}

// ✅ Protección del panel de admin
function protegerAdmin() {
    if (localStorage.getItem('adminLogged') !== 'true') {
        alert('Debes iniciar sesión como admin');
        window.location.replace('login.html');
    }
}

// ✅ Protección de páginas de usuario
function protegerUsuario() {
    if (!localStorage.getItem('nameuserLogged')) {
        alert('Debes iniciar sesión para acceder');
        window.location.replace('login.html');
    }
}
