import { useState, useContext } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { UserContext } from '../UserContext';

function Circle(){
  return <svg className="absolute lg:w-[300px] lg:h-[200px] w-[200px] h-[150px] -left-10 -bottom-10"  viewBox="0 0 203 152" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20.5" cy="182.5" r="182.5" fill="url(#paint0_linear_101_69)"/>
  <defs>
    <linearGradient id="paint0_linear_101_69" x1="20.5" y1="0" x2="20.5" y2="365" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8A2BE2"/>
      <stop offset="1" stop-color="#0000FF"/>
    </linearGradient>
  </defs>
</svg>
}

function RectanguloDeformado(){
  return <svg className="absolute lg:w-[350px] h-[270px] w-[260px] h-[220px] -top-10 -right-10" viewBox="0 0 262 223" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M171.759 -179.796C271.347 -209.004 382.565 -178.001 489.301 -103.872C596.038 -29.7425 779.49 70.3924 419.429 188.36C59.3682 306.328 308.447 78.2478 101.886 112.436C-104.675 146.624 46.5706 -143.08 171.759 -179.796Z" fill="url(#paint0_linear_101_70)"/>
  <defs>
  <linearGradient id="paint0_linear_101_70" x1="-54.2121" y1="23.6288" x2="-142.834" y2="394.277" gradientUnits="userSpaceOnUse">
  <stop stop-color="#8A2BE2"/>
  <stop offset="1" stop-color="#0000FF"/>
  </linearGradient>
  </defs>
</svg>
}

function Texto_registro({texto}){
  return <div> 
    <p className="xl:text-5xl text-4xl font-medium font-sans text-shadow-lg">{texto}</p>
  </div>
}

function Message_login(){
  return <p className='text-gray-500'>You don't have an account? <Link className='text-[rgb(58,3,94)]' to="/registro">Sign Up</Link></p>
}


function Campo_email({error, cambiarError}){
  const texto_error = <div className='flex justify-start items-center ps-3'>
    <p className='text-sm text-red-500'>{error}</p>
  </div>

  function cambiar_texto(e) {
    if (e.target.value.trim().includes("@") && e.target.value.trim().includes(".com")) {
      cambiarError("");
    } else { 
      cambiarError('Formato de correo inválido');
    }
  }

  return <div className='flex flex-col gap-y-1'>
      <div className={`lg:h-[60px] lg:w-[300px] h-[50px] w-[280px] flex justify-start items-center gap-x-4 ${error !== "" ? "border-2 border-red-500" : "border-0"} rounded-[20px] ps-5 shadow-[0px_0px_10px_3px] shadow-shadow-campos/25`}>
        <label className="h-[30px] w-[30px]" htmlFor="email">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.75 10C22.7083 10 21.8229 9.63542 21.0938 8.90625C20.3646 8.17708 20 7.29167 20 6.25C20 5.20833 20.3646 4.32292 21.0938 3.59375C21.8229 2.86458 22.7083 2.5 23.75 2.5C24.7917 2.5 25.6771 2.86458 26.4062 3.59375C27.1354 4.32292 27.5 5.20833 27.5 6.25C27.5 7.29167 27.1354 8.17708 26.4062 8.90625C25.6771 9.63542 24.7917 10 23.75 10ZM5 25C4.3125 25 3.72396 24.7552 3.23438 24.2656C2.74479 23.776 2.5 23.1875 2.5 22.5V7.5C2.5 6.8125 2.74479 6.22396 3.23438 5.73438C3.72396 5.24479 4.3125 5 5 5H17.625C17.5417 5.41667 17.5 5.83333 17.5 6.25C17.5 6.66667 17.5417 7.08333 17.625 7.5C17.7708 8.16667 18.0104 8.78646 18.3438 9.35938C18.6771 9.93229 19.0833 10.4375 19.5625 10.875L15 13.75L5 7.5V10L15 16.25L21.5938 12.125C21.9479 12.25 22.3021 12.3438 22.6562 12.4062C23.0104 12.4688 23.375 12.5 23.75 12.5C24.4167 12.5 25.0729 12.3958 25.7188 12.1875C26.3646 11.9792 26.9583 11.6667 27.5 11.25V22.5C27.5 23.1875 27.2552 23.776 26.7656 24.2656C26.276 24.7552 25.6875 25 25 25H5Z" fill="#1D1B20"/>
          </svg>
        </label>
        <input onChange={cambiar_texto} className="placeholder-black placeholder:text-xl placeholder:font-medium placeholder:font-sans" type="email" id="email" name="email" required placeholder="Email"></input>
    </div>
    {error !== '' ? texto_error : ""}
  </div>
}

function Campo_password({error, cambiarError}){
  const texto_error = <div className='flex justify-start items-center ps-3'>
    <p className='text-sm text-red-500'>{error}</p>
  </div>

  function cambiar_texto(e){
    if (!(e.target.value.trim().length < 8)) {
      cambiarError("");
    } else { 
      cambiarError('La contraseña debe tener mínimo 8 caracteres');
    }
  }

  return <div className='flex flex-col items-center gap-y-1'>
      <div className={`lg:h-[60px] lg:w-[300px] h-[50px] w-[280px] flex justify-start items-center gap-x-4 ${error ? "border-2 border-red-500" : "border-0"} rounded-[20px] ps-5 shadow-[0px_0px_10px_3px] shadow-shadow-campos/25`}>
        <label className="h-[30px] w-[30px]" htmlFor="password">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.75 13.75V8.75C8.75 7.0924 9.40848 5.50268 10.5806 4.33058C11.7527 3.15848 13.3424 2.5 15 2.5C16.6576 2.5 18.2473 3.15848 19.4194 4.33058C20.5915 5.50268 21.25 7.0924 21.25 8.75V13.75M6.25 13.75H23.75C25.1307 13.75 26.25 14.8693 26.25 16.25V25C26.25 26.3807 25.1307 27.5 23.75 27.5H6.25C4.86929 27.5 3.75 26.3807 3.75 25V16.25C3.75 14.8693 4.86929 13.75 6.25 13.75Z" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </label>
        <input onChange={cambiar_texto} className="placeholder-black placeholder:text-xl placeholder:font-medium placeholder:font-sans" type="password" id="password" name="password" required placeholder="Password"></input>
    </div>
    {error !== '' ? texto_error : ""}
  </div>
}

function Boton_Login({error}){
  const texto_error = <div className='flex justify-center items-center mt-1'>
    <p className='text-sm text-red-500'>{error}</p>
  </div>

  return <div>
      <div className="lg:h-[50px] lg:w-[300px] h-[40px] w-[280px] flex justify-center items-center rounded-[20px]  bg-gradient-to-r from-botones-registro-morado to-botones-registro-azul">
        <button type="submit" className="h-full w-full font-bold text-white lg:text-2xl text-xl font-sans rounded-[20px]">Log In</button>
    </div>
    {error !== "" ? texto_error : ""}
  </div>
}



function Form(){
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorForm, setError] = useState("");
  const { login } = useContext(UserContext);

  //Para ir a la pagina principal
  const navigate = useNavigate();

  async function obtener_datos(evento){
    evento.preventDefault();
    const url = "http://localhost:9906/login";

    //Se obtiene un array de pares de claves y valores de los campos del formulario
    const datos = evento.target;
    const datosFormulario = new FormData(datos);
    const datosUsuario = Object.fromEntries(datosFormulario.entries());

    try {
      //Verifico que el usuario ya exista
      let mensaje = await fetch(url, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(datosUsuario)
      });

      const respuesta = await mensaje.json();

      //Si existe pues pido sus moods para enviarlo con sus datos
      if (mensaje.status === 200) {
        localStorage.setItem("Token", respuesta.token);
        
        const urlmood = `${url}/mood/${respuesta["id"]}`;

        const pedir_moods = await fetch (urlmood, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("Token")}`
          }
        })

        const respuesta_moods = await pedir_moods.json();
        const array_moods = respuesta_moods.Resultados;

        //Si los moods se traen exitosamente entonces
        //Ahora se traen los dias
        if (!pedir_moods.ok) {
            throw new Error(respuesta_moods.Mensaje);
        } else {
          const urldia = `${url}/dia/${respuesta["id"]}`;

          const pedir_dias = await fetch(urldia, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("Token")}`
            }
          })

          const respuesta_dias = await pedir_dias.json();

          if (!pedir_dias.ok) {
            throw new Error(respuesta_dias.Mensaje);
          } else {
            login({...respuesta, "moods": array_moods, "dias": respuesta_dias.Resultados});
            navigate("/principal");
            return;
          }
        }
      }

      //Sino pues tiro un error
      if (!mensaje.ok) {
        if (Object.hasOwn(respuesta, "errores")) {
          for (let i = 0; i < respuesta.errores.length; i++) {
            if (respuesta.errores[i].path === "email") {
              setEmailError(respuesta.errores[i].msg);
            } else if (respuesta.errores[i].path === "password") {
              setPasswordError(respuesta.errores[i].msg);
            } 
          }
        }
        throw new Error(respuesta.Mensaje);
      }

      //Para los errores :v (no tocar)
      setError("");
      return;
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  }

  return <form noValidate onSubmit={obtener_datos} className="flex flex-col justify-center items-center gap-y-9">
      <Texto_registro texto={"Log in"}></Texto_registro>
      <div className="flex flex-col justify-center items-center gap-y-7">
        <Campo_email error={emailError} cambiarError={setEmailError}></Campo_email>
        <Campo_password error={passwordError} cambiarError={setPasswordError}></Campo_password>
      </div>
      <Boton_Login error={errorForm}></Boton_Login>
      <Message_login></Message_login>
    </form>
}

export default function InicioSesion(){
    return <div className='relative h-screen w-screen flex justify-center items-center overflow-hidden px-5'>
        <Circle></Circle>
        <RectanguloDeformado></RectanguloDeformado>
        <Form></Form>
    </div>
}