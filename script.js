async function fetchData() {
    try {
        const response = await fetch('https://kitek.ktkv.dev/marketplace/api/items')
        const json = await response.json()
        return json
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
        return []
    }
}

function formatDuration(ms) {
    if (!ms) return "0:00"
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function escapeHtml(str) {
    if (!str) return ''
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function renderItems(items) {
    const container = document.getElementById("container")
    
    container.innerHTML = ''
    
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="error-message">Нет данных для отображения</div>'
        return
    }
    
    items.forEach((item, index) => {
        const li = document.createElement("li")
        li.className = "track-item"
        
        const trackNumber = item.track_number || index + 1
        const trackName = item.name || "Без названия"
        const artists = item.artists?.join(', ') || "Неизвестный исполнитель"
        const albumName = item.album?.name || "Неизвестный альбом"
        const albumImage = item.album?.images?.[0]?.url || "https://via.placeholder.com/64x64?text=No+Image"
        const duration = formatDuration(item.duration_ms) || "0:00"
        const popularity = item.popularity || 0
        
        li.innerHTML = `
            <div class="track-number">${trackNumber}</div>
            <div class="track-main">
                <img
                    src="${albumImage}"
                    alt="${trackName}"
                    class="album-art"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/64x64?text=No+Image'"
                />
                <div class="track-info">
                    <div class="track-name">${escapeHtml(trackName)}</div>
                    <div class="track-artists">${escapeHtml(artists)}</div>
                    <div class="track-album">${escapeHtml(albumName)}</div>
                </div>
            </div>
            <div class="track-meta">
                <div class="duration">${duration}</div>
                <div class="popularity">♪ ${popularity}</div>
            </div>
        `
        
        container.appendChild(li)
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    const items = await fetchData()
    renderItems(items)
})
