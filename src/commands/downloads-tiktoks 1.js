import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `Ejemplo:\n${usedPrefix + command} https://www.tiktok.com/@levimartinez_/video/7456789012345678901`
        }, { quoted: m });
    }
    
    try {
        m.react('🕒');
        
        const urlEncoded = encodeURIComponent(text.trim());
        const apiUrl = `https://celest-api.vercel.app/api/download/tiktok?url=${urlEncoded}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        
        const res = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        
        const json = await res.json();
        
        if (!json.status || !json.data?.links?.length || !json.data.links[0].includes('.mp4')) {
            throw new Error(json.message || 'No se encontró link de video válido');
        }
        
        const videoUrl = json.data.links[0]; // El primero suele ser el bueno (sin watermark)
        const caption = `🌟 TikTok descargado con Celest API\nTítulo: ${json.data.title || 'Sin título'}\nAutor: ${json.data.author || 'Desconocido'}\n\nLink original: ${text}`;
        
        await Promise.all([
            conn.sendFile(m.chat, videoUrl, 'tiktok.mp4', caption, m),
            m.react('✔️')
        ]);
        
    } catch (err) {
        m.react('✖️');
        let msg = `❌ Error descargando TikTok\n• Verifica que sea un video público\n• Reporta con *${usedPrefix}report* si persiste\n\n`;
        if (err.name === 'AbortError') msg += '⏳ Timeout (API lenta o cold start en Vercel)';
        else msg += err.message;
        
        conn.sendMessage(m.chat, { text: msg }, { quoted: m });
    }
};

handler.help = ['tiktok <url>', 'tt <url>', 'tik <url>'];
handler.tags = ['downloader'];
handler.command = /^(tt1|ti)$/i;
handler.group = true;

export default handler;