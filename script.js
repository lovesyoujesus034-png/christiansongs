const $ = s => document.querySelector(s);

function youtubeId(url){
  if(!url) return "";
  const m = url.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|shorts\\/)|youtu\\.be\\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : "";
}

function renderSongs(filter=""){
  const list = $("#songList");
  const q = filter.toLowerCase().trim();
  const data = songs.filter(s => `${s.title} ${s.artist}`.toLowerCase().includes(q));
  if(!data.length){
    list.innerHTML = `<div class="panel">No songs found.</div>`;
    return;
  }
  list.innerHTML = data.map((s,i)=>{
    const id = youtubeId(s.youtube);
    const video = id
      ? `<div class="video"><iframe src="https://www.youtube.com/embed/${id}" title="${escapeHtml(s.title)}" allowfullscreen loading="lazy"></iframe></div>`
      : `<div class="video"><div class="bad-video">Add your YouTube link in <code>songs.js</code>.</div></div>`;
    const notes = s.notesImage
      ? `<img class="notes-img" src="${escapeAttr(s.notesImage)}" alt="Keyboard notes for ${escapeAttr(s.title)}">`
      : `<div class="panel"><div class="lyrics">${escapeHtml(s.keyboardNotes || "Keyboard notes will be added here.")}</div></div>`;
    const pdf = s.pdf
      ? `<iframe class="pdf" src="${escapeAttr(s.pdf)}" title="PDF for ${escapeAttr(s.title)}"></iframe><p><a class="btn" href="${escapeAttr(s.pdf)}" target="_blank" rel="noopener">Open / Download PDF</a></p>`
      : `<div class="panel muted">Add the PDF path in <code>songs.js</code>.</div>`;
    return `<article class="song-card">
      <div class="song-top"><div><h3 class="song-title">${escapeHtml(s.title)}</h3><div class="artist">${escapeHtml(s.artist || "")}</div></div>
      <div class="keybar"><strong>Key: <span id="key-${i}">${escapeHtml(s.key || "C")}</span></strong><button onclick="transpose(${i},-1)">−</button><button onclick="transpose(${i},1)">+</button></div></div>
      ${video}
      <div class="grid">
        <section class="panel"><h3>📝 Lyrics</h3><div class="lyrics">${escapeHtml(s.lyrics || "")}</div></section>
        <section class="panel"><h3>🎸 Chords</h3><div class="chords">${escapeHtml(s.chords || "")}</div></section>
      </div>
      <div class="grid" style="margin-top:20px">
        <section class="panel"><h3>🎹 Keyboard Notes</h3>${notes}</section>
        <section class="panel"><h3>📄 Song PDF</h3>${pdf}</section>
      </div>
      <p class="small muted">© 2026 ChristianSongs by Augustin Vetha Priyan. Use only content you own or have permission to publish.</p>
    </article>`;
  }).join("");
}

const keys = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
function transpose(i,step){
  const s=songs[i]; const idx=Math.max(0,keys.indexOf(s.key||"C")); s.key=keys[(idx+step+12)%12]; renderSongs($("#search").value);
}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escapeAttr(v){return escapeHtml(v)}

$("#search").addEventListener("input",e=>renderSongs(e.target.value));
renderSongs();

$("#reportForm").addEventListener("submit",e=>{
  e.preventDefault();
  const type=$("#reportType").value, msg=$("#reportMessage").value.trim();
  $("#aiReply").hidden=false;
  $("#aiReply").innerHTML=`<strong>AI Reply (demo)</strong><p>Thank you for your ${escapeHtml(type.toLowerCase())} report. We received your message: “${escapeHtml(msg)}”</p><p>For a real AI response, connect this form to a secure backend/API. Do not place an AI API key in GitHub Pages JavaScript.</p>`;
});
