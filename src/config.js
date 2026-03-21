import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"
import moment from "moment-timezone"

// ─────────────────────────────
//  SISTEMA DE FECHA Y HORA
// ─────────────────────────────
global.timezone = 'America/Bogota'
global.d = new Date(new Date().toLocaleString("en-US", {timeZone: global.timezone}))
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, { weekday: 'long' })
global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' })
global.mes = d.toLocaleDateString('es', { month: 'long' })
global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

// ─────────────────────────────
//  CONFIGURACIÓN PRINCIPAL
// ─────────────────────────────

global.botNumber = "" // Agregue el número del Bot en "botNumber" si desea recibir código de 8 dígitos sin registrar el número en la consola.
global.owner = ["50765836410", "5214452773745", "5124452773745"]
global.suittag = ["50765836410","5214452773745"]
global.prems = ["5214452773745", "50765836410"]
global.prefix = [";"]
global.libreria = "Multi Device"
global.vs = "1.0"
global.languaje = 'Español'
global.nameqr = "Celest"
global.apikey = 'Arlette-Xz'
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.shirokobot = true

// ─────────────────────────────
//  CONFIG INFORMACIÓN DEL BOT
// ─────────────────────────────

global.botname = "Celest Bot"
global.textbot = "made with by 7Noonly"
global.dev = "© powered by 7Noonly "
global.author = "© made with by 7Noonly"
global.etiqueta = "7Noonly"
global.currency = "Sky-Coins"

// ─────────────────────────────
//  IMÁGENES DEL BOT
// ─────────────────────────────

global.banner = fs.readFileSync('./src/assets/banner.jpg')
global.icono = fs.readFileSync('./src/assets/menu.jpg')
global.catalogo = fs.readFileSync('./src/assets/menu.jpg')
global.logo = fs.readFileSync('./src/celest.jpg')

// ─────────────────────────────
//  CONFIG WELCOME
// ─────────────────────────────

global.welcomeConfig = {
    background: fs.readFileSync('./src/assets/welcome-bg.jpg'),
    defaultAvatar: fs.readFileSync('./src/assets/default-avatar.jpg'),
    apiBase: "https://api.siputzx.my.id/api/canvas",
    timeout: 8000
}

// ─────────────────────────────
//  REDES SOCIALES
// ─────────────────────────────

global.canalNombre = "𝘾𝙚𝙡𝙚𝙨𝙩 𝘽𝙤𝙩"
global.group = "https://whatsapp.com/channel/0029VbBJZs5G8l5EwrjizJ2H"
global.channel = "https://whatsapp.com/channel/0029VbBJZs5G8l5EwrjizJ2H"
global.github = "https://github.com/LuisCheats/Averry-Bot"
global.gmail = "averry_team@gmail.com"
global.ch = {
    ch1: "120363402648953286@newsletter"
}

// ─────────────────────────────
//  APIs
// ─────────────────────────────

global.APIs = {
    xyro: { url: "https://api.xyro.site", key: null },
    yupra: { url: "https://api.yupra.my.id", key: null },
    vreden: { url: "https://api.vreden.web.id", key: null },
    delirius: { url: "https://api.delirius.store", key: null },
    zenzxz: { url: "https://api.zenzxz.my.id", key: null },
    siputzx: { url: "https://api.siputzx.my.id", key: null },
    ephoto360: { url: "https://en.ephoto360.com", key: null },
    adonix: { url: "https://api-adonix.ultraplus.click", key: 'Arlette-Xz' }
}

// ─────────────────────────────
//  CONFIG FUNCIONES
// ─────────────────────────────

global.modes = {
    self: false,
    autoread: false,
    jadibotmd: true,
    welcome: false,
    detect: false,
    antilink: false,
    nsfw: false,
    economy: true,
    gacha: true,
    modoadmin: false
}

// ─────────────────────────────
//  MENSAJES DEL SISTEMA
// ─────────────────────────────

global.msg = {
    rowner: "ꕤ Este comando solo puede ser usado por los *creadores* del bot.",
    owner: "ꕤ Este comando solo puede ser utilizado por los *desarrolladores* del bot.", 
    mods: "ꕤ Comando exclusivo para *moderadores*",
    premium: "ꕤ Solo usuarios *premium* puedes usar este comando.",
    group: "ꕤ Este comando solo funciona en *grupos*",
    private: "ꕤ Usa este comando en el chat *privado*",
    admin: "ꕤ Solo *administradores* del grupo",
    botAdmin: "ꕤ Necesito ser *administrador*",
    restrict: "ꕤ Esta característica está desactivada",
    aviso: "ꕤ *Bot desactivado*\n\n» Usa: *${usedPrefix}bot on*",
    mensaje: "ꕤ *Usuario baneado*\n\n» Razón: ${bannedReason}"
}

// ─────────────────────────────
//  SISTEMA DE ACTUALIZACIÓN
// ─────────────────────────────

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.blue("ꕤ config.js actualizado"))
    import(`${file}?update=${Date.now()}`)
})
