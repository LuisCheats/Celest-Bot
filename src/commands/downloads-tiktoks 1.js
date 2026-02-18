import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `Ejemplo:\n${usedPrefix + command} https://www.tiktok.com/@usuario/video/1234567890123456789`
        }, { quoted: m });
    }
    
    try {
        m.react('🕒');
        
        const urlEncoded = encodeURIComponent(text.trim());
        const apiUrl = `https://celest-api.vercel.app/api/download/tiktok?url=${urlEncoded}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s max para cold start
        
        const res = await fetch(apiUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)' } // Ayuda a evitar bloqueos
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            throw new Error(`API error: HTTP ${res.status}`);
        }
        
        const json = await res.json();
        
        if (!json.status) {
            throw new Error(json.message || 'Fallo en la descarga (verifica el link)');
        }
        
        // Asume formato típico de estos APIs (ajusta según lo que responda realmente)
        const videoUrl = json.data?.video_no_watermark || json.data?.play || json.data?.hdplay || json.data?.url;
        if (!videoUrl) throw new Error('No se encontró URL de video');
        
        const caption = `🌟 TikTok descargado con Celest API\nTítulo: ${json.data?.title || 'Sin título'}\nAutor: ${json.data?.author || 'Desconocido'}`;
        
        await Promise.all([
            conn.sendFile(m.chat, videoUrl, 'tiktok.mp4', caption, m),
            m.react('✔️')
        ]);
        
    } catch (err) {
        m.react('✖️');
        let msg = `❌ Error con Celest API\n• Prueba otro video o reporta con *${usedPrefix}report*\n\n`;
        if (err.name === 'AbortError') msg += '⏳ Timeout: API lenta (Vercel cold start o TikTok bloqueó)';
        else msg += err.message;
        
        conn.sendMessage(m.chat, { text: msg }, { quoted: m });
    }
};

handler.help = ['tiktok <url>', 'tt <url>', 'tik <url>'];
handler.tags = ['downloader'];
handler.command = /^(tt1|test)$/i;
handler.group = true; // o false

export default handler;