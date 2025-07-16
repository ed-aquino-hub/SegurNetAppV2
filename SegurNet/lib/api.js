
const API_URL = 'http://192.168.1.45:3000'; 


export async function loginUsuario(data) {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Respuesta inesperada del servidor: ${text}`);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.mensaje || 'Credenciales inválidas');
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function registrarUsuario(usuario) {
  const response = await fetch(`${API_URL}/usuarios/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el registro');
  }

  return await response.json();
}

export async function registrarHistorial(data) {
  try {
    const response = await fetch(`${API_URL}/api/historial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al registrar historial');
    }

    return await response.json();
  } catch (error) {
    console.error("❌ registrarHistorial falló:", error);
    throw error;
  }
}







