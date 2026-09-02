  // ====== 状态 ======
  const musicState = {
    songs: [],
    currentIndex: -1,
    isPlaying: false,
    isCollapsed: true,
    playlist: [],       // 播放队列 [{song, idx}]
    playlistIdx: -1,    // 当前在播放列表中的位置
    favorites: []       // 收藏夹
  };

  // ====== DOM 引用 ======
  const mAudio = document.getElementById('musicAudio');
  const mSearchInput = document.getElementById('musicSearchInput');
  const mSearchBtn = document.getElementById('musicSearchBtn');
  const mResults = document.getElementById('musicResults');
  const mNowPlaying = document.getElementById('musicNowPlaying');
  const mNowName = document.getElementById('musicNowName');
  const mNowArtist = document.getElementById('musicNowArtist');
  const mNowImg = document.getElementById('musicNowImg');
  const mNowPlaceholder = document.getElementById('musicNowPlaceholder');
  const mPlayBtn = document.getElementById('musicPlayBtn');
  const mProgressFill = document.getElementById('musicProgressFill');
  const mProgressBar = document.getElementById('musicProgressBar');
  const mCurTime = document.getElementById('musicCurTime');
  const mTotalTime = document.getElementById('musicTotalTime');
  const mWidgetBody = document.getElementById('musicWidgetBody');
  const mWidgetToggle = document.getElementById('musicWidgetToggle');
  const mVolFill = document.getElementById('musicVolFill');
  const mVolBtn = document.getElementById('musicVolBtn');
  const mVolPct = document.getElementById('musicVolPct');
  const mFavBtn = document.getElementById('musicFavBtn');
  const mPlaylistContent = document.getElementById('musicPlaylistContent');
  const mFavContent = document.getElementById('musicFavContent');
  const mPlaylistCount = document.getElementById('playlistCount');
  const mFavCount = document.getElementById('favCount');

  // ====== 初始化收藏夹 ======
  try {
    const saved = localStorage.getItem('musicFavorites');
    if (saved) musicState.favorites = JSON.parse(saved);
  } catch(e) {}

  // ====== 搜索 ======
  async function musicSearch() {
    const kw = mSearchInput.value.trim();
    if (!kw) return;
    musicSwitchTab('search');
    mSearchBtn.disabled = true;
    mSearchBtn.textContent = '搜索中...';
    mResults.innerHTML = '<div class="music-loading">🔍 搜索中...</div>';
    try {
      const resp = await fetch('/api/music?action=search&keyword=' + encodeURIComponent(kw) + '&limit=24');
      const data = await resp.json();
      const songs = data.songs || [];
      musicState.songs = songs;
      renderMusicResults(songs);
    } catch(e) {
      mResults.innerHTML = '<div class="music-error">搜索失败，请重试</div>';
    } finally {
      mSearchBtn.disabled = false;
      mSearchBtn.textContent = '搜索';
    }
  }

  function renderMusicResults(songs) {
    if (!songs.length) {
      mResults.innerHTML = '<div class="music-results-empty"><span class="music-empty-icon">😕</span><span>未找到相关歌曲</span></div>';
      return;
    }
    let html = '';
    songs.forEach((s, i) => {
      const artists = (s.artists || []).join(' / ');
      const pic = s.albumPic || '';
      const isActive = i === musicState.currentIndex;
      const isFav = musicState.favorites.some(f => f.id === s.id && f.source === s.source);
      html += `<div class="music-result-item ${isActive?'playing':''}" data-idx="${i}">
        <div class="music-result-album" onclick="musicPlay(${i})">${pic ? '<img src="'+pic+'?param=100y100" alt="" loading="lazy">' : '🎵'}</div>
        <div class="music-result-info" onclick="musicPlay(${i})">
          <div class="music-result-name">${escHtml(s.name)}</div>
          <div class="music-result-artist">${escHtml(artists)}</div>
        </div>
        <span class="music-result-source" style="background:${s.source==='qq'?'rgba(0,180,255,0.15)':'rgba(99,102,241,0.15)'};color:${s.source==='qq'?'#00b4ff':'#6366f1'}">${s.source||'netease'}</span>
        <span class="music-fav-star ${isFav?'active':''}" onclick="musicToggleFav(${i})" title="${isFav?'取消收藏':'收藏'}">${isFav?'⭐':'☆'}</span>
        <span class="music-result-play" onclick="musicPlay(${i})">${isActive ? '🔊' : '▶'}</span>
      </div>`;
    });
    mResults.innerHTML = html;
  }

  // ====== 播放 ======
  async function musicPlay(idx) {
    const song = musicState.songs[idx];
    if (!song) return;
    musicState.currentIndex = idx;
    // 同步到播放列表
    syncPlaylistToCurrent();
    // 更新播放栏
    mNowPlaying.style.display = 'flex';
    mNowName.textContent = song.name;
    mNowArtist.textContent = (song.artists || []).join(' / ');
    if (song.albumPic) {
      mNowImg.src = song.albumPic + '?param=100y100';
      mNowImg.style.display = 'block';
      mNowPlaceholder.style.display = 'none';
    } else {
      mNowImg.style.display = 'none';
      mNowPlaceholder.style.display = 'flex';
    }
    updateFavBtn();
    // 获取播放链接
    try {
      const resp = await fetch('/api/music?action=url&id=' + song.id + '&source=' + (song.source || 'auto'));
      const data = await resp.json();
      const srcName = document.getElementById('musicNowSource');
      if (data.url) {
        srcName.textContent = '来源: ' + (data.source === 'qq' ? 'QQ音乐' : '网易云音乐');
        mAudio.src = data.url;
        mAudio.play().then(() => {
          musicState.isPlaying = true;
          mPlayBtn.textContent = '⏸';
        }).catch(() => {
          musicState.isPlaying = false;
          mPlayBtn.textContent = '▶';
          musicToast('⚠️ 播放失败');
        });
      } else {
        srcName.textContent = '⚠️ 该歌曲暂不可播放';
        musicToast('⚠️ 该歌曲暂不可播放（版权限制）');
        musicState.isPlaying = false;
        mPlayBtn.textContent = '▶';
      }
    } catch(e) {
      document.getElementById('musicNowSource').textContent = '⚠️ 获取链接失败';
      musicToast('⚠️ 获取播放链接失败');
    }
    // 获取歌词
    musicFetchLyrics(song.id);
    // 高亮
    document.querySelectorAll('.music-result-item').forEach(el => {
      el.classList.toggle('playing', parseInt(el.dataset.idx) === idx);
    });
    renderPlaylist();
    renderFavorites();
  }

  function musicTogglePlay() {
    if (mAudio.src) {
      if (mAudio.paused) {
        mAudio.play(); musicState.isPlaying = true; mPlayBtn.textContent = '⏸';
      } else {
        mAudio.pause(); musicState.isPlaying = false; mPlayBtn.textContent = '▶';
      }
    }
  }

  function musicPrev() {
    if (musicState.playlist.length > 0) {
      const idx = (musicState.playlistIdx - 1 + musicState.playlist.length) % musicState.playlist.length;
      playFromPlaylist(idx);
    } else if (musicState.songs.length > 0) {
      const idx = (musicState.currentIndex - 1 + musicState.songs.length) % musicState.songs.length;
      musicPlay(idx);
    }
  }

  function musicNext() {
    if (musicState.playlist.length > 0) {
      const idx = (musicState.playlistIdx + 1) % musicState.playlist.length;
      playFromPlaylist(idx);
    } else if (musicState.songs.length > 0) {
      const idx = (musicState.currentIndex + 1) % musicState.songs.length;
      musicPlay(idx);
    }
  }

  function musicSeek(e) {
    const rect = mProgressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (mAudio.duration) mAudio.currentTime = pct * mAudio.duration;
  }

  // ====== 音量控制 ======
  function musicSetVol(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mAudio.volume = pct;
    updateVolUI();
  }
  function musicToggleMute() {
    mAudio.muted = !mAudio.muted;
    updateVolUI();
  }
  function updateVolUI() {
    const vol = mAudio.muted ? 0 : mAudio.volume;
    mVolFill.style.width = (vol * 100) + '%';
    mVolPct.textContent = Math.round(vol * 100) + '%';
    mVolBtn.textContent = vol === 0 ? '🔇' : vol < 0.3 ? '🔈' : vol < 0.7 ? '🔉' : '🔊';
  }
  mAudio.addEventListener('volumechange', updateVolUI);
  updateVolUI();

  // ====== 播放列表 ======
  function musicAddToPlaylist(idx) {
    if (idx < 0 || idx >= musicState.songs.length) return;
    const song = musicState.songs[idx];
    musicState.playlist.push({ song, idx });
    // 如果是第一个加入的，自动播放
    if (musicState.playlist.length === 1) {
      musicState.playlistIdx = 0;
      playFromPlaylist(0);
    }
    renderPlaylist();
    musicToast('✅ 已加入播放列表');
    musicSwitchTab('playlist');
  }

  function musicRemoveFromPlaylist(plIdx) {
    musicState.playlist.splice(plIdx, 1);
    if (musicState.playlistIdx >= musicState.playlist.length) {
      musicState.playlistIdx = musicState.playlist.length - 1;
    }
    if (musicState.playlist.length === 0) {
      musicState.playlistIdx = -1;
    }
    renderPlaylist();
  }

  function playFromPlaylist(plIdx) {
    if (plIdx < 0 || plIdx >= musicState.playlist.length) return;
    musicState.playlistIdx = plIdx;
    const item = musicState.playlist[plIdx];
    // 如果这个 song 在搜索结果中，同步 currentIndex
    const searchIdx = musicState.songs.findIndex(s => s.id === item.song.id && s.source === item.song.source);
    if (searchIdx >= 0) musicState.currentIndex = searchIdx;
    // 临时设置 songs 为播放列表的歌曲，让 musicPlay 能工作
    // 改用播放列表播放
    const tempSongs = musicState.songs;
    musicState.songs = musicState.playlist.map(p => p.song);
    musicPlay(plIdx);
    musicState.songs = tempSongs;
    renderPlaylist();
  }

  function syncPlaylistToCurrent() {
    // 当从搜索结果直接播放时，同步到播放列表
    if (musicState.currentIndex < 0 || musicState.currentIndex >= musicState.songs.length) return;
    const song = musicState.songs[musicState.currentIndex];
    // 检查是否已在播放列表中
    const found = musicState.playlist.findIndex(p => p.song.id === song.id && p.song.source === song.source);
    if (found >= 0) {
      musicState.playlistIdx = found;
    } else {
      musicState.playlist.push({ song, idx: musicState.currentIndex });
      musicState.playlistIdx = musicState.playlist.length - 1;
    }
    renderPlaylist();
  }

  function renderPlaylist() {
    const list = musicState.playlist;
    if (!list.length) {
      mPlaylistContent.innerHTML = '<div class="music-results-empty"><span class="music-empty-icon">📋</span><span>播放列表为空<br>点击歌曲旁的 📋 按钮加入</span></div>';
      mPlaylistCount.textContent = '';
      return;
    }
    mPlaylistCount.textContent = '(' + list.length + ')';
    let html = '';
    list.forEach((item, i) => {
      const s = item.song;
      const artists = (s.artists || []).join(' / ');
      const pic = s.albumPic || '';
      const isActive = i === musicState.playlistIdx;
      html += `<div class="music-result-item ${isActive?'playing':''}">
        <div class="music-result-album" onclick="playFromPlaylist(${i})">${pic ? '<img src="'+pic+'?param=100y100" alt="" loading="lazy">' : '🎵'}</div>
        <div class="music-result-info" onclick="playFromPlaylist(${i})">
          <div class="music-result-name">${escHtml(s.name)}</div>
          <div class="music-result-artist">${escHtml(artists)}</div>
        </div>
        <span class="music-result-play" style="cursor:pointer;color:#f87171;font-size:13px;" onclick="musicRemoveFromPlaylist(${i})" title="移除">✕</span>
      </div>`;
    });
    mPlaylistContent.innerHTML = html;
  }

  // ====== 收藏夹 ======
  function musicToggleFav(idx) {
    if (idx < 0 || idx >= musicState.songs.length) return;
    const song = musicState.songs[idx];
    const found = musicState.favorites.findIndex(f => f.id === song.id && f.source === song.source);
    if (found >= 0) {
      musicState.favorites.splice(found, 1);
      musicToast('已取消收藏');
    } else {
      musicState.favorites.push(JSON.parse(JSON.stringify(song)));
      musicToast('⭐ 已收藏');
    }
    saveFavorites();
    renderMusicResults(musicState.songs);
    renderFavorites();
    updateFavBtn();
  }

  function musicRemoveFav(favIdx) {
    musicState.favorites.splice(favIdx, 1);
    saveFavorites();
    renderFavorites();
    renderMusicResults(musicState.songs);
    updateFavBtn();
  }

  // ====== 歌词 ======
  var _musicLyricsId = null;
  var _musicLyrics = [];
  var _musicLyricsTimer = null;

  function musicToggleLyrics() {
    var panel = document.getElementById('musicLyricsPanel');
    var btn = document.getElementById('musicLyricsBtn');
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      btn.classList.add('active');
      if (_musicLyrics.length > 0) musicUpdateLyricsDisplay();
    } else {
      panel.style.display = 'none';
      btn.classList.remove('active');
    }
  }

  function musicFetchLyrics(songId) {
    _musicLyricsId = songId;
    _musicLyrics = [];
    var content = document.getElementById('musicLyricsContent');
    content.innerHTML = '<div style="color:#666;padding:20px;">⏳ 加载歌词...</div>';
    var btn = document.getElementById('musicLyricsBtn');
    btn.classList.remove('active');
    // 使用网易云API获取歌词
    fetch('https://netease-cloud-music-api-xi-pied.vercel.app/lyric?id=' + songId)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var lrcText = data.lrc && data.lrc.lyric ? data.lrc.lyric : '';
        if (!lrcText) {
          content.innerHTML = '<div style="color:#666;padding:20px;">📜 暂无歌词</div>';
          return;
        }
        _musicLyrics = musicParseLrc(lrcText);
        if (_musicLyrics.length > 0) {
          content.innerHTML = _musicLyrics.map(function(l, i) {
            return '<div class="music-lyrics-line" data-lyric-index="' + i + '">' + musicEscapeHtml(l.text) + '</div>';
          }).join('');
          if (document.getElementById('musicLyricsPanel').style.display !== 'none') {
            musicUpdateLyricsDisplay();
          }
        }
      })
      .catch(function() {
        content.innerHTML = '<div style="color:#666;padding:20px;">😅 歌词加载失败</div>';
      });
  }

  function musicParseLrc(lrc) {
    var lines = lrc.split('\n');
    var result = [];
    var timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var match = timeRegex.exec(line);
      if (match) {
        var minutes = parseInt(match[1], 10);
        var seconds = parseInt(match[2], 10);
        var millis = parseInt(match[3], 10);
        if (match[3].length === 2) millis *= 10;
        var time = minutes * 60 + seconds + millis / 1000;
        var text = line.replace(timeRegex, '').trim();
        if (text) result.push({ time: time, text: text });
      } else {
        if (line && result.length > 0) {
          result.push({ time: result[result.length - 1].time, text: line });
        }
      }
    }
    result.sort(function(a, b) { return a.time - b.time; });
    return result;
  }

  function musicUpdateLyricsDisplay() {
    if (_musicLyrics.length === 0) return;
    var audio = document.getElementById('musicAudio');
    var currentTime = audio.currentTime;
    var activeIdx = -1;
    for (var i = 0; i < _musicLyrics.length; i++) {
      if (currentTime >= _musicLyrics[i].time) {
        activeIdx = i;
      }
    }
    var lines = document.querySelectorAll('.music-lyrics-line');
    for (var j = 0; j < lines.length; j++) {
      lines[j].className = 'music-lyrics-line';
      if (j < activeIdx) lines[j].classList.add('past');
      else if (j === activeIdx) lines[j].classList.add('active');
    }
    if (activeIdx >= 0) {
      var active = lines[activeIdx];
      if (active) {
        var container = document.getElementById('musicLyricsContent');
        var offset = active.offsetTop - container.offsetTop;
        var targetScroll = offset - container.clientHeight / 2 + active.clientHeight / 2;
        container.scrollTop = Math.max(0, targetScroll);
      }
    }
  }

  function musicEscapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function musicPlayAllFav() {
    if (!musicState.favorites.length) return;
    musicState.playlist = musicState.favorites.map(s => ({ song: s, idx: -1 }));
    musicState.playlistIdx = 0;
    playFromPlaylist(0);
    musicSwitchTab('playlist');
    musicToast('▶ 正在播放收藏夹');
  }

  function saveFavorites() {
    try {
      localStorage.setItem('musicFavorites', JSON.stringify(musicState.favorites));
    } catch(e) {}
  }

  function renderFavorites() {
    const list = musicState.favorites;
    if (!list.length) {
      mFavContent.innerHTML = '<div class="music-results-empty"><span class="music-empty-icon">⭐</span><span>收藏夹为空<br>点击歌曲旁的 ☆ 收藏喜欢的歌</span></div>';
      mFavCount.textContent = '';
      return;
    }
    mFavCount.textContent = '(' + list.length + ')';
    let html = '';
    list.forEach((s, i) => {
      const artists = (s.artists || []).join(' / ');
      const pic = s.albumPic || '';
      const isActive = musicState.playlistIdx >= 0 && musicState.playlist[musicState.playlistIdx]?.song?.id === s.id;
      html += `<div class="music-result-item ${isActive?'playing':''}">
        <div class="music-result-album" onclick="musicFavPlay(${i})">${pic ? '<img src="'+pic+'?param=100y100" alt="" loading="lazy">' : '🎵'}</div>
        <div class="music-result-info" onclick="musicFavPlay(${i})">
          <div class="music-result-name">${escHtml(s.name)}</div>
          <div class="music-result-artist">${escHtml(artists)}</div>
        </div>
        <span class="music-result-source" style="background:${s.source==='qq'?'rgba(0,180,255,0.15)':'rgba(99,102,241,0.15)'};color:${s.source==='qq'?'#00b4ff':'#6366f1'}">${s.source||'netease'}</span>
        <span class="music-result-play" style="cursor:pointer;color:#f87171;font-size:13px;" onclick="musicRemoveFav(${i})" title="移除">✕</span>
      </div>`;
    });
    mFavContent.innerHTML = html;
  }

  function musicFavPlay(i) {
    const song = musicState.favorites[i];
    // 临时设置 songs 为 favorites
    const tempSongs = musicState.songs;
    musicState.songs = musicState.favorites;
    musicPlay(i);
    musicState.songs = tempSongs;
  }

  function updateFavBtn() {
    if (musicState.currentIndex < 0 || musicState.currentIndex >= musicState.songs.length) {
      mFavBtn.textContent = '☆';
      return;
    }
    const song = musicState.songs[musicState.currentIndex];
    const isFav = musicState.favorites.some(f => f.id === song.id && f.source === song.source);
    mFavBtn.textContent = isFav ? '⭐' : '☆';
  }

  // ====== 标签切换 ======
  function musicSwitchTab(tab) {
    document.querySelectorAll('.music-tab').forEach(t => t.classList.remove('music-tab-active'));
    document.querySelectorAll('.music-panel').forEach(p => p.style.display = 'none');
    if (tab === 'search') {
      document.getElementById('tabSearch').classList.add('music-tab-active');
      document.getElementById('panelSearch').style.display = 'block';
    } else if (tab === 'playlist') {
      document.getElementById('tabPlaylist').classList.add('music-tab-active');
      document.getElementById('panelPlaylist').style.display = 'block';
      renderPlaylist();
    } else if (tab === 'fav') {
      document.getElementById('tabFav').classList.add('music-tab-active');
      document.getElementById('panelFav').style.display = 'block';
      renderFavorites();
    }
  }

  function toggleMusicWidget() {
    musicState.isCollapsed = !musicState.isCollapsed;
    mWidgetBody.classList.toggle('hidden', musicState.isCollapsed);
    mWidgetToggle.classList.toggle('collapsed', musicState.isCollapsed);
  }

  // ====== 工具 ======
  function escHtml(s) { return String(s).replace(/[&<>"]/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]||m;}); }
  function musicToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:8px 18px;border-radius:8px;font-size:13px;z-index:9999;';
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 2500);
  }
  function fmtTime(s) { if(!s||isNaN(s)) return '0:00'; const m=Math.floor(s/60), sec=Math.floor(s%60); return m+':'+sec.toString().padStart(2,'0'); }

  // ====== 音频事件 ======
  mAudio.addEventListener('timeupdate', () => {
    if (mAudio.duration) {
      mProgressFill.style.width = (mAudio.currentTime / mAudio.duration * 100) + '%';
      mCurTime.textContent = fmtTime(mAudio.currentTime);
    }
    // 同步歌词
    if (_musicLyrics.length > 0 && document.getElementById('musicLyricsPanel').style.display !== 'none') {
      musicUpdateLyricsDisplay();
    }
  });
  mAudio.addEventListener('loadedmetadata', () => { mTotalTime.textContent = fmtTime(mAudio.duration); });
  mAudio.addEventListener('ended', () => { musicNext(); });
  mAudio.addEventListener('error', () => { if(mAudio.src) musicNext(); });
