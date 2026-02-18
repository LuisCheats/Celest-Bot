import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        m.react('🕒');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos máx
        
        const response = await fetch('https://api.waifu.pics/sfw/waifu', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const { url } = await response.json();
        if (!url) throw new Error('No se encontró URL');
        
        await Promise.all([
            conn.sendFile(m.chat, url, 'waifu.jpg', '🌸 𝗪𝗮𝗶𝗳𝘂 𝗱𝗲𝘁𝗲𝗰𝘁𝗮𝗱𝗮', m),
            m.react('✔️')
        ]);
        
    } catch (err) {
        m.react('✖️');
        
        let msgError = `❌ Error al obtener waifu\n• Intenta de nuevo o usa *${usedPrefix}report*\n\n`;
        if (err.name === 'AbortError') {
            msgError += '⏳ La API tardó demasiado (timeout)';
        } else {
            msgError += err.message;
        }
        
        conn.sendMessage(m.chat, { text: msgError }, { quoted: m });
    }
};

handler.help = ['waifu'];
handler.tags = ['anime'];
handler.command = ['waifu'];
handler.group = true;

export default handler;