import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, 'ꕤ Por favor, ingresa el enlace de TikTok.\nEjemplo: !tiktok https://www.tiktok.com/@usuario/video/123456789', m)
    
    const isUrl = /tiktok\.com|vt\.tiktok\.com/i.test(text)
    if (!isUrl) return conn.reply(m.chat, 'ꕤ Ingresa un enlace válido de TikTok (debe contener tiktok.com o vt.tiktok.com)', m)
    
    const API_URL = 'https://averry-api.vercel.app/download/tiktok'
    
    try {
        const apiUrl = `\( {API_URL}?url= \){encodeURIComponent(text)}&hd=1`
        // console.log('Llamando a:', apiUrl) // descomenta para debug
        
        const { data: res } = await axios.get(apiUrl, {
            timeout: 20000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        
        if (!res?.status || !res?.data?.urls?.length) {
            const errorMsg = res?.error || 'No se pudo extraer el video'
            return conn.reply(m.chat, `ꕤ Error de la API: ${errorMsg}`, m)
        }
        
        const apiData = res.data
        const videoUrl = apiData.urls[0] // Primer link = HD / principal
        const meta = apiData.metadata || {}
        
        const caption = createCaption(meta)
        
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption,
            mimetype: 'video/mp4',
            fileName: 'tiktok_video.mp4'
        }, { quoted: m })
        
        // Opcional: enviar thumbnail / portada
        if (meta.thumbnail) {
            await conn.sendMessage(m.chat, {
                image: { url: meta.thumbnail },
                caption: 'Portada del video'
            }, { quoted: m })
        }
        
    } catch (e) {
        console.error('Error TikTok Averry:', e)
        let errMsg = e.message || 'Error desconocido'
        if (e.response?.data?.error) errMsg += `\nAPI: ${e.response.data.error}`
        await conn.reply(m.chat, `⚠︎ Error al descargar el video:\n${errMsg}`, m)
    }
}

function createCaption(meta) {
    const title = meta.title || meta.description || 'Sin título'
    const author = meta.creator || 'Desconocido'
    // No hay duración ni música en esta API → valores fijos o vacíos
    const duration = 'No disponible'
    const music = 'No disponible'
    
    return `❏ TIKTOK DOWNLOAD
──────────────────
> ❀ *Título:* ${title}
> ☕︎ *Autor:* ${author}
> ✰ *Duración:* ${duration}
> 𝅘𝅥𝅮 *Música:* ${music}

> ૮꒰ ˶• ᴗ •˶꒱ა Disfruta tu video sin marca de agua!`
}

handler.help = ['tiktok', 'tt', 'tik']
handler.tags = ['descargas']
handler.command = /^(tiktok|tt|tik)$/i
handler.group = true
handler.limit = true // opcional: ponle límite si quieres

export default handler