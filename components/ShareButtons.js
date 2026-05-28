'use client'

export default function ShareButtons({ title }) {
  function shareUrl() {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  return (
    <div className="article-share">
      <span className="share-label">Compartilhar:</span>
      <button
        className="share-btn share-fb"
        onClick={() => window.open('https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl()))}
      >
        Facebook
      </button>
      <button
        className="share-btn share-wa"
        onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(title + ' ' + shareUrl()))}
      >
        WhatsApp
      </button>
    </div>
  )
}
