/* app es la aplicacion en si y BrowserWindow es para crear ventanas  */
const { app, BrowserWindow, Menu } = require('electron');
// Modulos
const url = require('url');
const path = require('path');

// Solo funciona cuando esta en produccion
if (process.env.NODE_ENV !== 'production') {
    // Reinicia automaticamente cuando hay un cambio
    require('electron-reload')(__dirname, {
        //Reinicia cuando cambio algun proceso de electron.
        electron: path.join(__dirname, '../node_modules', 'bin', 'electron')

    })
}

// Variables globales
let NewClientWindow
let mainWindow // La ventana debe de tener un alcance global para cuando se elimine se queden limpios los recursos

app.on('ready', () => {



    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        //titleBarStyle: 'customButtonsOnHover',frame: false, //Estos dos me sirven para ocultar la barra de titulo con los botones de cerrar minimizar y agrandar.
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file', // le digo con que tido de protocolo va a trabajar, en este caso va a ser un archivo.
        slashes: true
    }))

    // este me deja personalizar las ventanas con un template.
    const mainMenu = Menu.buildFromTemplate(tempalteMenu);
    // para poder integrar
    Menu.setApplicationMenu(mainMenu);
    //Cuando la ventana principal se cierra, la aplicacion flinaliza. 
    mainWindow.on('closed', () => {
        app.quit();
    });

});
// es un arreglo de objetos. Cada objeto es una ventana.
const tempalteMenu = [{
        label: 'Menu', // Titulo de la pestaña
        submenu: [ // este contiene los objetos de la ventana
            {
                label: 'Nuevo Paciente', // subtitulo de la ventana
                //accelerator: 'Ctrl+N', // Acceso rapido (Combinacion de teclas)
                //verifica si esta usando Windows, Linux o MAC.
                accelerator: process.platform == 'darwin' ? 'command+N' : 'Ctrl+N', // Si esta usando Mac ejecuta command+Q de caso contrario ejecuta Ctrl+Q
                click() { // este es un evento. (Si hace click sucede algo)
                    createNewClientWindow(); // Llamo a la funcion para crear dicha ventana.
                }
            },
            {
                label: 'Remover',
                click() {

                }
            },
            {
                label: 'Finalizar aplicación',
                // para finalizar con una combinacion de teclas
                // pero primero verfica si esta usando Windows, Linux o MAC.
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q', // si esta usando Mac ejecuta command+Q de caso contrario ejecuta Ctrl+Q
                click() {
                    app.quit();
                }
            },
        ]
    },
    {
        label: 'Help',
        submenu: [{
            label: 'Ayuda de Diosito activado'
        }]
    }

];

function createNewClientWindow() {
    // NewClientWindow es una variable global que cree más arriba.
    NewClientWindow = new BrowserWindow({
        width: 300,
        height: 200,
        //title: 'Nuevo producto'
        //titleBarStyle: 'customButtonsOnHover',frame: false,
    });

    NewClientWindow.setMenu(null); // Desactivo el boton de ventana que tiene por defecto.

    NewClientWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'views/new-product.html'),
            protocol: 'file', // le digo con que tido de protocolo va a trabajar, en este caso va a ser un archivo.
            slashes: true
        }))
        // para limpiar la ventana creada cuando se cierra.
    NewClientWindow.on('closed', () => {
        NewClientWindow = null;
    })
};
//Validadcion
// si el sistema operativo es MAC. Hace que se vea igual que Windows eliminando la pestaña que se genera por defecto en MAC OS.
if (process.platform === 'darwin') {
    tempalteMenu.unshift({
        label: app.getName()
    });
}