import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, 'ꕤ Por favor, ingresa un término de búsqueda o el enlace de TikTok.', m)
    
    const isUrl = /tiktok\.com/i.test(text)
    const API_BASE = 'https://averry-api.vercel.app/download/tiktok'
    
    try {
        if (isUrl) {
            // Nueva llamada a averry-api
            const { data: res } = await axios.get(`\( {API_BASE}?url= \){encodeURIComponent(text)}&hd=1`)
            
            // Verifica si la respuesta es válida (ajusta según lo que realmente devuelva)
            if (!res?.status || !res?.data?.play) { // o res.data.video / res.data.url / res.data.no_wm
                return conn.reply(m.chat, 'ꕤ Enlace inválido, video privado o la API no pudo extraer el contenido.', m)
            }
            
            const data = res.data // o res (depende del wrapper de la API)
            
            const caption = createCaption(data) // puedes reutilizar tu función o adaptarla
            
            // ── Manejo de slideshow (imágenes) ──
            if (data.type === 'image' || (Array.isArray(data.images) && data.images.length > 0)) {
                const images = data.images || [] // ajusta el campo real si es data.photos, etc.
                const medias = images.map(url => ({ type: 'image', data: { url }, caption }))
                await conn.sendSylphy(m.chat, medias, { quoted: m })
                
                // Audio si existe
                if (data.music || data.original_audio) {
                    await conn.sendMessage(m.chat, {
                        audio: { url: data.music || data.original_audio },
                        mimetype: 'audio/mp4',
                        fileName: 'tiktok_audio.mp4'
                    }, { quoted: m })
                }
            }
            // ── Video normal ──
            else {
                // Usa preferentemente sin watermark si existe, sino el normal
                const videoUrl = data.no_wm || data.nowm || data.play || data.video || data.url
                if (!videoUrl) throw new Error('No se encontró link de video')
                
                await conn.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    caption
                }, { quoted: m })
            }
            
        } else {
            // ── Búsqueda por palabras ──
            // averry-api NO parece tener endpoint de búsqueda (feed/search)
            // Si quieres mantener la búsqueda, puedes dejar tikwm o quitar esta parte temporalmente
            return conn.reply(m.chat, 'ꕤ Esta API solo soporta descarga por URL. Usa !tiktok <link>', m)
            
            // Alternativa: desactiva búsqueda o usa otra API para search
            // Por ahora lo dejamos comentado o con mensaje
        }
    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `⚠︎ Error al procesar la solicitud.\n${e.message || e}`, m)
    }
}

// Puedes mantener o adaptar tus funciones de caption
function createCaption(data) {
    const title = data.title || 'No disponible'
    const name = data.author?.nickname || data.author?.name || 'Desconocido'
    const user = data.author?.unique_id || data.author?.username ? `@${data.author.unique_id || data.author.username}` : ''
    const duration = data.duration || '0'
    const music = data.music_info?.title || data.music_title || `[${name}] original sound`
    
    return `❏ TIKTOK DOWNLOAD (Averry API)
──────────────────
> ❀ *Título:* ${title}
> ☕︎ *Autor:* *${name}* ${user}
> ✰ *Duración:* *${duration}s*
> 𝅘𝅥𝅮 *Música:* ${music}

> ૮꒰ ˶• ᴗ •˶꒱ა Disfruta tu contenido!`
}

handler.help = ['tiktok', 'tt']
handler.tags = ['descargas']
handler.command = ['tiktok1', 'tt1'] // o cámbialo a lo que uses
handler.group = true

export default handler