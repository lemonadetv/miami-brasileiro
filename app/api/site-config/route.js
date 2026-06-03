// app/api/site-config/route.js - Public endpoint for site configuration
import path from 'path'
import fs from 'fs'

export async function GET() {
  try {
    const p = path.join(process.cwd(), 'data', 'config.json')
    const config = JSON.parse(fs.readFileSync(p, 'utf-8'))
    // Only return public fields (no sensitive data)
    return Response.json({
      siteName: config.siteName || 'Miami Brasileira',
      tagline: config.tagline || 'O portal da sua comunidade',
      primaryColor: config.primaryColor || '#00897B',
      accentColor: config.accentColor || '#F4622A',
      socialFacebook: config.socialFacebook || '',
      socialInstagram: config.socialInstagram || '',
      socialYoutube: config.socialYoutube || '',
      socialWhatsapp: config.socialWhatsapp || '',
      socialTwitter: config.socialTwitter || '',
      socialTiktok: config.socialTiktok || '',
      contactEmail: config.contactEmail || '',
      footerLinks: config.footerLinks || [],
      footerAbout: config.footerAbout || 'O portal de noticias da comunidade brasileira em Miami e Sul da Florida.',
    }, { headers: { 'Cache-Control': 'public, max-age=300' } })
  } catch(e) {
    return Response.json({ siteName: 'Miami Brasileira' })
  }
}
