import axios from 'axios'

let handler = async (m, { conn }) => {
  try {
    // Llamada a tu API
    let { data } = await axios.get(
      'https://averry-api.vercel.app/nsfw/waifu'
    )

    let img = data.url || data.image
    if (!img) throw 'No se pudo obtener la imagen'

    // Enviar imagen
    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: '🔥 Waifu NSFW\n\n© Averry API'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al obtener la waifu NSFW')
  }
}

handler.help = ['waifunsfw']
handler.tags = ['nsfw']
handler.command = ['waifunsfw', 'nsfwwaifu']

// Opcional: solo en grupos + nsfw activado
handler.group = true
handler.nsfw = true

export default handler