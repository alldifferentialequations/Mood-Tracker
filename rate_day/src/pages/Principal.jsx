import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";


function Header(){
    const { logout } = useContext(UserContext);
    const [logoutabrir, setLogout] = useState(false);

    const logoutdiv = <div className="absolute flex flex-col justify-center items-center -left-4 border border-green-600">
        <div class="w-4 h-4 bg-blue-700 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]"></div>
        <div className="px-2 bg-blue-700">
            <button className="w-max" onClick={logout}>Log out</button>
        </div>
    </div>
    

    const menu = <button>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 16H28M4 8H28M4 24H28" stroke="#B3B3B3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>;

    const usuarioboton = 
        <button className="relative border border-red-600" onClick={() => setLogout(!logoutabrir)}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="white"/>
                <path d="M33.3333 35V31.6667C33.3333 29.8986 32.6309 28.2029 31.3807 26.9526C30.1304 25.7024 28.4347 25 26.6666 25H13.3333C11.5652 25 9.86949 25.7024 8.61925 26.9526C7.369 28.2029 6.66663 29.8986 6.66663 31.6667V35M26.6666 11.6667C26.6666 15.3486 23.6819 18.3333 20 18.3333C16.3181 18.3333 13.3333 15.3486 13.3333 11.6667C13.3333 7.98477 16.3181 5 20 5C23.6819 5 26.6666 7.98477 26.6666 11.6667Z" stroke="#1E1E1E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {logoutabrir ? logoutdiv : ""}
        </button>;
  

    {/*header*/}
    return (
        <div className="flex justify-between items-center absolute top-0 w-full h-[70px] px-[20px] bg-black">
            {menu}
            <p className="w-max h-max text-white text-3xl font-inter">MoodApp</p>
            {usuarioboton}
        </div>
    );
}

function Dia({item}){
    const { usuario, login, usingColor, anadir, del } = useContext(UserContext);

    //Funcion para encontrar el dia guardado :V
    const diaGuardado = usuario["dias"].find(
        (d) => {
            const fecha = d.fecha;
            const separacion = fecha.split("-");
            const anio = separacion[0];
            const mes = separacion[1];
            const dia = separacion[2];

            return (Number(anio) === item.anio && Number(mes) === item.mes && Number(dia) === item.dia);
        }
    );

    // 2. Buscar si el mood existe para obtener su color
    const moodAsociado = usuario["moods"].find((m) => m.id_mood === diaGuardado?.id_mood);
    const colorActual = diaGuardado ? moodAsociado?.color : null;

    //Funcion para modificar un dia :v
    async function enviar_dia(){
        const fecha = `${item.anio}-${item.mes}-${item.dia}`; 
        const url = "http://localhost:9906/principal/dia";
        const urlGet = `http://localhost:9906/principal/dia/${usuario.id}`;
        const datos = {fecha: fecha, id_usuario: usuario.id, id_mood: usingColor.id};

        try {
            //Si anadir es true y un mood fue seleccionada se procede a enviar un dia a la base de datos
            if (anadir && usingColor.id) {
                //Si ya el dia tiene un color entonces se actualiza
                if (colorActual) {
                    const solicitud = await fetch(url, {
                        method: "PATCH",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("Token")}`
                        },
                        body: JSON.stringify(datos) 
                    });

                    const respuesta = await solicitud.json();
                    console.log(respuesta.Mensaje);

                    if (!solicitud.ok) {
                        throw new Error(respuesta.Mensaje);
                    } else {
                        //Ahora se actualizan los dias
                        const request = await fetch(urlGet, {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("Token")}`
                            }
                        })

                        const response = await request.json();

                        if (!request.ok) {
                            throw new Error(response.Mensaje);
                        } else {
                            //Actualizo los datos en la variable usuario
                            const { dias, ...datos } = usuario;
                            login({...datos, dias: response.Resultados});
                            return;
                        }
                    }
                //Sino se crea
                } else {
                    const solicitud = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("Token")}`
                        },
                        body: JSON.stringify(datos) 
                    });

                    const respuesta = await solicitud.json();
                    console.log(respuesta.Mensaje);

                    if (!solicitud.ok) {
                        throw new Error(respuesta.Mensaje);
                    } else {
                        //Ahora se actualizan los dias
                        const request = await fetch(urlGet, {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("Token")}`
                            }
                        })

                        const response = await request.json();

                        if (!request.ok) {
                            throw new Error(response.Mensaje);
                        } else {
                            //Actualizo los datos en la variable usuario
                            const { dias, ...datos } = usuario;
                            login({...datos, dias: response.Resultados});
                            return;
                        }
                    }
                }
            //Si del es verdadero entonces se borra el dia de la base de datos
            } else if (del) {
                const solicitud = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("Token")}`
                    },
                    body: JSON.stringify(datos) 
                });

                const respuesta = await solicitud.json();
                console.log(respuesta.Mensaje);

                if (!solicitud.ok) {
                    throw new Error(respuesta.Mensaje);
                } else {
                    //Ahora se actualizan los dias
                    const request = await fetch(urlGet, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("Token")}`
                    }
                    })

                    const response = await request.json();

                    if (!request.ok) {
                        throw new Error(response.Mensaje);
                    } else {
                        //Actualizo los datos en la variable usuario
                        const { dias, ...datos } = usuario;
                        login({...datos, dias: response.Resultados});
                        return;
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <button onClick={() => {enviar_dia()}} key={item} style={item.actual ? {} : {pointerEvents: "none"}} className={`h-10 flex items-center justify-center bg-white`}>
                <span style={item.actual ? { backgroundColor: colorActual } : {}} className={`text-lg font-medium font-inter w-9 h-9 flex items-center justify-center rounded-[6px] ${!item.actual ? 'text-gray-300' : 'text-black'}`}>
                    {item.dia}
                </span>
            </button>
        </>
    )
}

function Calendario(){
    const [fechaActual, setFechaActual] = useState(new Date()); // Se crea una objeto fecha que es igual a la fecha actual del sistema

    const anio = fechaActual.getFullYear(); //Se obtiene el año
    const mes = fechaActual.getMonth(); //Se obtiene el mes

    // Nombres de los meses y días de la semana
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const diasSemana = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // 1. Obtener información del mes actual
    const primerDiaMes = new Date(anio, mes, 1).getDay(); // Qué día de la semana empieza (0 = Domingo)
    const totalDiasMes = new Date(anio, mes + 1, 0).getDate(); // Cuántos días tiene el mes

    // 2. Obtener los días de relleno del mes anterior
    const MesAnterior = new Date(anio, mes - 1, 1);
    const totalDiasMesAnterior = new Date(anio, mes, 0).getDate(); //Dias del mes anterior
    const mesMesAnterior = MesAnterior.getMonth();
    const diasMesAnterior = [];
    //Si el primer dia del mes en el que se está comienza el Domingo entonces no se calculan dias del anterior mes
    for (let i = primerDiaMes - 1; i >= 0; i--) {
        diasMesAnterior.push({anio: anio , mes: mesMesAnterior, dia: totalDiasMesAnterior - i, actual: false });
    }

    // 3. Obtener los días del mes actual
    const diasMesActual = [];
    for (let i = 1; i <= totalDiasMes; i++) {
        diasMesActual.push({anio: anio , mes: mes, dia: i, actual: true });
    }

    // 4. Obtener los días de relleno del mes siguiente para completar la cuadrícula (múltiplo de 7)
    const MesSiguiente = new Date(anio, mes + 1, 1);
    const mesMesSiguiente = MesSiguiente.getMonth();
    const celdasTotales = diasMesAnterior.length + diasMesActual.length;
    const diasMesSiguiente = [];
    const restoCeldas = (6*7) - celdasTotales;
    for (let i = 1; i <= restoCeldas; i++) {
        diasMesSiguiente.push({anio: anio , mes: mesMesSiguiente, dia: i, actual: false });
    }

    // Combinamos todos los días en una sola lista para el renderizado
    const todosLosDias = [...diasMesAnterior, ...diasMesActual, ...diasMesSiguiente];

    // Funciones para cambiar de mes
    const mesAnterior = () => setFechaActual(new Date(anio, mes - 1, 1));
    const mesSiguiente = () => setFechaActual(new Date(anio, mes + 1, 1));

    const left_arrow = <button onClick={mesAnterior}>      
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 36L18 24L30 12" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>;
    const right_arrow = <button onClick={mesSiguiente}>   
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 36L30 24L18 12" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>;

    return (
        <div className="h-max w-full flex flex-col justify-center items-center">
                {/*Frame 64*/}
                <div className="w-full h-max flex flex-col justify-center items-center gap-y-[16px]">
                    {/*AñoyMes*/}
                    <div className="w-full h-max flex justify-center items-center">
                        {left_arrow}
                        {/*Frame 9 */}
                        <div className="w-max h-full flex justify-center items-center gap-x-[10px]">
                            <p className="h-full flex justify-center items-center font-normal font-inter text-3xl">{meses[mes]}</p>
                            <p className="h-full flex justify-center items-center font-normal font-inter text-3xl">{anio}</p>
                        </div>
                        {right_arrow}
                    </div>

                    {/*Linea */}
                    <div className="w-full border border-black/25"></div>

                    {/*Calendario */}
                    <div className="w-full h-[272px] grid grid-cols-7 grid-rows-7">
                        {diasSemana.map((dia, index) => {
                            return (
                                <div key={index} className="h-10 flex items-center justify-center">
                                    <span className={`text-lg font-medium font-inter w-9 h-9 flex items-center justify-center rounded-[6px]`}>
                                        {dia}
                                    </span>
                                </div>
                            )
                        })}

                        {todosLosDias.map((item) => {

                            const uniqueKey = `${item.anio}-${item.mes}-${item.dia}-${item.actual}`;
                            return (
                                <Dia key={uniqueKey} item={item} ></Dia>
                            );
                        })}
                    </div>
                </div>
            </div>
    )
}

function Pintar_mood({moodsitos, setUsingColor, usingColor}) {
    const { setAnadir, anadir, del, usuario, login } = useContext(UserContext);

    async function modificar(id, color){ 
        if (del) {
            const url = "http://localhost:9906/principal/mood";
            const urlConId = `${url}/${usuario["id"]}`;

            try {
                //Borrar el mood de la base de datos
                const solicitud = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("Token")}`
                    },
                    body: JSON.stringify({
                        id_mood: id,
                    })
                })
                const respuesta = await solicitud.json();

                //Si algo sale mal pues tiro un error :v
                if (!solicitud.ok) {
                    throw new Error(respuesta.Mensaje);
                }

                //Ahora pido sus moods para actualizar los datos del usuario en el codigo
                const pedir_moods = await fetch (urlConId, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("Token")}`
                    }
                })

                //Aqui obtengo el array que contiene los moods
                const respuesta_moods = await pedir_moods.json();
                const array_moods = respuesta_moods.Resultados;

                //Si algo sale mal tiro un error
                if (!pedir_moods.ok) {
                    throw new Error(respuesta_moods.Mensaje);
                } else {
                    //Actualizo los datos en la variable usuario
                    const { moods, ...datos } = usuario;
                    login({ ...datos, moods: array_moods });
                    return;
                }
            } catch (error) {
                console.log(error.message);
            }
        } else if (anadir && usingColor) {
            setAnadir(false);
        } else {
            setUsingColor({id: id, color: color}); 
            setAnadir(true);
            return;
        }
    }

    return ( 
        <>
            {moodsitos.map((mood) => (
                <div onClick={() => {modificar(mood.id_mood, mood.color)}} key={mood.color} className={`h-max w-full flex justify-center items-center gap-x-[10px]`}>
                    <button style={{ backgroundColor: mood.color }} className={`${usingColor.color === mood.color && anadir && !del ? "border-4 border-black" : null} h-[30px] w-[30px] rounded-[4px]`}></button>
                    <p className="w-full h-max text-start text-xl font-medium font-inter">{mood.feeling}</p>
                </div>
            ))}
        </>
    )
}

function Mood(){
    const { usuario, login, usingColor, setUsingColor, setDelete, del, anadir, setAnadir } = useContext(UserContext);
    const [create, setCreate] = useState(false);
    const [color, setColor] = useState("#aabbcc");
    const [textoMood, setText] = useState("");
    console.log("\n");
    console.log("Create: ", create);
    console.log("Delete: ", del);
    console.log("Añadir: ", anadir);
    

    async function enviarMood(){
        const url = "http://localhost:9906/principal/mood";
        const urlConId = `${url}/${usuario["id"]}`;

        try {
            console.log("Comienzo de la verificacion de errores");

            //Agrego el nuevo mood a la base de datos
            const solicitud = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("Token")}`
                },
                body: JSON.stringify({
                    feeling: textoMood,
                    color: color,
                })
            })
            const respuesta = await solicitud.json();

            //Si algo sale mal pues tiro un error :v
            if (!solicitud.ok) {
                throw new Error(respuesta.Mensaje);
            }

            //Ahora pido sus moods para actualizar los datos del usuario en el codigo
            const pedir_moods = await fetch (urlConId, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("Token")}`
                }
            })

            //Aqui obtengo el array que contiene los moods
            const respuesta_moods = await pedir_moods.json();
            const array_moods = respuesta_moods.Resultados;

            //Si algo sale mal tiro un error
            if (!pedir_moods.ok) {
                throw new Error(respuesta_moods.Mensaje);
            } else {
                //Actualizo los datos en la variable usuario
                const { moods, ...datos } = usuario;
                login({ ...datos, moods: array_moods });
                return;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const add_button = <button onClick={() => {setCreate(false); setAnadir(!anadir); setDelete(false)}} className={`${anadir ? "border-2 border-black" : "border border-dashed"} rounded-[4px]`}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6.25V23.75M6.25 15H23.75" stroke="#1E1E1E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
    const create_button = <button onClick={() => {setCreate(!create); setAnadir(false); setDelete(false)}} className={`${create ? "border-2 border-black" : "border border-dashed"} rounded-[4px]`}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6.25V23.75M6.25 15H23.75" stroke="#1E1E1E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
    const delete_button = <button onClick={() => {setCreate(false); setAnadir(false); setDelete(!del)}} className={`${del ? "border-2 border-black" : "border border-dashed"} rounded-[4px]`}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6.25V23.75M6.25 15H23.75" stroke="#1E1E1E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>

    const equis = <button onClick={() => setCreate(false)} className="absolute top-2 right-2">
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.75 9.25L9.25 27.75M9.25 9.25L27.75 27.75" stroke="#F3F3F3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
    const CreateButtonModal = createPortal(
        // Cambiado 'relative' por 'fixed' e inserción de 'inset-0' y 'z-50'
        <div className="fixed inset-0 h-screen w-screen flex justify-center items-center bg-black/25 z-50">
            {/* Cambiado 'absolute' por 'relative' (u otra clase de tamaño) para el contenedor interno */}
            <div className="relative w-full h-[400px] flex flex-col justify-center items-center gap-y-4 rounded-lg bg-amber-400">
                {equis}
                <HexColorPicker style={{"height": "150px", "width": "150px"}} color={color} onChange={setColor} />
                <div className="flex justify-center items-center gap-x-2">
                    <div style={{"backgroundColor": color}} className={`h-[40px] w-[40px] rounded-xl`}></div>
                    <input onChange={(e) => {setText(e.target.value)}} className="border rounded-[10px] ps-2 h-10" placeholder="Mood"></input>
                </div>
                <button onClick={enviarMood} className="border-2 border-black px-4 py-2 bg-pink-500 rounded-xl text-black font-inter">Add</button>
            </div>
        </div>,
        document.body
    );

    return <>
        {create ? CreateButtonModal : ""}
        <div className="h-max w-full flex flex-col justify-center items-center gap-y-12">
                <p className="h-max w-full text-center font-bold text-3xl"></p>

                {/*Moods */}
                <div className="h-max w-full flex flex-col justify-center items-center gap-y-3">
                    <p className="w-full h-max font-bold text-3xl font-inter text-center">MOODS</p>

                    <Pintar_mood moodsitos={usuario.moods} setUsingColor={setUsingColor} usingColor={usingColor}></Pintar_mood>

                    <div className="h-max w-full flex justify-center items-center gap-x-[10px]">
                        {create_button}
                        <p className="w-full h-max text-start text-xl font-medium font-inter">Create Mood</p>
                    </div>

                    <div className="h-max w-full flex justify-center items-center gap-x-[10px]">
                        {delete_button}
                        <p className="w-full h-max text-start text-xl font-medium font-inter">Delete Mood/Day</p>
                    </div>

                    <div className="h-max w-full flex justify-center items-center gap-x-[10px]">
                        {add_button}
                        <p className="w-full h-max text-start text-xl font-medium font-inter">Add Mood</p>
                    </div>
                </div>
            </div>
    </>
}

export default function Principal() {
    const { usuario } = useContext(UserContext);
    const navigate = useNavigate();

    //Si el usuario no ha iniciado sesion pues se le envia al inicio de sesion :V
    useEffect(() => {
        if (usuario === null) {
            navigate("/");
        }
    }, [usuario, navigate]); // Siempre incluye las dependencias

    // 2. Guardián de renderizado
    if (usuario === null) {
        return null; // O simplemente return null;
    }

    return <div className="flex justify-center items-center px-5">
        {/*Header*/}
        <Header></Header>

        {/*Frame 13*/}
        <div className="sm:w-[500px] ssm:w-[400px] w-full h-full flex flex-col justify-center items-center mt-40 mb-20">
            {/*Frame 12 */}
            <Calendario></Calendario>

            {/*Frame 11 */}
            <Mood></Mood>
        </div>
    </div>
}