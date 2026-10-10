/* Biblioteca de Estudio — portada
   Lee catalogo.json y muestra los artefactos por temática, con búsqueda,
   favoritos y "vistos recientemente" (guardados solo en este dispositivo). */

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const STAR = '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const fmtFecha = f => {
  if (!f) return '';
  const d = new Date(f + 'T12:00:00');
  return isNaN(d) ? f : d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
};

let cat = { temas: [], artefactos: [] };
let filtro = store.get('filtroTema', 'todos');
let favs = new Set(store.get('favoritos', []));
let query = '';

const $ = id => document.getElementById(id);

async function cargar() {
  try {
    const r = await fetch('catalogo.json', { cache: 'no-cache' });
    cat = await r.json();
  } catch (e) {
    $('contenido').innerHTML = '<div class="vacio">No se pudo cargar <b>catalogo.json</b>. Si abriste el archivo directamente desde el disco, publícalo en GitHub Pages o usa un servidor local.</div>';
    return;
  }
  $('titulo').textContent = cat.titulo || 'Biblioteca de Estudio';
  $('subtitulo').textContent = cat.subtitulo || '';
  document.title = cat.titulo || document.title;
  if (filtro !== 'todos' && filtro !== 'favoritos' && !cat.temas.some(t => t.id === filtro)) filtro = 'todos';
  render();
}

const temaDe = id => cat.temas.find(t => t.id === id) || { id, nombre: id, icono: '📄', color: '#64748b' };
const urlDe = a => 'ver.html?id=' + encodeURIComponent(a.id);

function coincide(a) {
  if (!query) return true;
  const hay = norm([a.titulo, a.descripcion, (a.etiquetas || []).join(' '), temaDe(a.tema).nombre].join(' '));
  return norm(query).split(/\s+/).every(w => hay.includes(w));
}

function tarjeta(a) {
  const t = temaDe(a.tema);
  const fav = favs.has(a.id);
  return `<a class="card" href="${urlDe(a)}" style="--c:${t.color}">
    <span class="tema">${esc(t.icono)} ${esc(t.nombre)}</span>
    <h3>${esc(a.titulo)}</h3>
    ${a.descripcion ? `<p>${esc(a.descripcion)}</p>` : ''}
    <div class="tags">${(a.etiquetas || []).map(e => `<span class="tag">${esc(e)}</span>`).join('')}</div>
    ${a.fecha ? `<span class="fecha">${fmtFecha(a.fecha)}</span>` : ''}
    <button class="star" data-fav="${esc(a.id)}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${STAR}</button>
  </a>`;
}

function seccion(t, lista, mostrarVacio) {
  if (!lista.length && !mostrarVacio) return '';
  const ord = [...lista].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  return `<section class="seccion" style="--c:${t.color}">
    <div class="seccion-h"><span class="ico">${esc(t.icono)}</span><h2>${esc(t.nombre)}</h2><span class="n">${lista.length}</span></div>
    ${ord.length ? `<div class="grid">${ord.map(tarjeta).join('')}</div>`
                 : `<div class="vacio">Aún no hay artefactos en esta temática.</div>`}
  </section>`;
}

function renderChips() {
  const cuenta = id => cat.artefactos.filter(a => a.tema === id).length;
  const chip = (id, label, n, color) =>
    `<button class="chip" data-tema="${id}" aria-pressed="${filtro === id}" ${color ? `style="--c:${color}"` : ''}>${label}<span class="n">${n}</span></button>`;
  $('chips').innerHTML =
    chip('todos', 'Todos', cat.artefactos.length) +
    chip('favoritos', '★ Favoritos', cat.artefactos.filter(a => favs.has(a.id)).length) +
    cat.temas.map(t => chip(t.id, `${esc(t.icono)} ${esc(t.nombre)}`, cuenta(t.id), t.color)).join('');
  const activo = $('chips').querySelector('[aria-pressed="true"]');
  activo?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function renderRecientes() {
  const ids = store.get('recientes', []);
  const lista = ids.map(id => cat.artefactos.find(a => a.id === id)).filter(Boolean).slice(0, 8);
  const sec = $('recientes');
  sec.hidden = !lista.length || !!query || filtro !== 'todos';
  $('recientesLista').innerHTML = lista.map(a => {
    const t = temaDe(a.tema);
    return `<a class="mini" href="${urlDe(a)}" style="--c:${t.color}"><span>${esc(t.icono)} ${esc(t.nombre)}</span><strong>${esc(a.titulo)}</strong></a>`;
  }).join('');
}

function render() {
  renderChips();
  renderRecientes();
  const visibles = cat.artefactos.filter(coincide);
  let html = '';

  if (filtro === 'favoritos') {
    const lista = visibles.filter(a => favs.has(a.id));
    html = lista.length
      ? `<div class="grid">${lista.map(tarjeta).join('')}</div>`
      : '<div class="vacio">Toca la estrella de un artefacto para guardarlo aquí.</div>';
  } else if (filtro === 'todos') {
    html = cat.temas.map(t => seccion(t, visibles.filter(a => a.tema === t.id), !query)).join('');
    const huerfanos = visibles.filter(a => !cat.temas.some(t => t.id === a.tema));
    if (huerfanos.length) html += seccion({ nombre: 'Sin temática', icono: '📄', color: '#64748b' }, huerfanos, false);
    if (query && !visibles.length) html = `<div class="vacio">Sin resultados para “${esc(query)}”.</div>`;
  } else {
    html = seccion(temaDe(filtro), visibles.filter(a => a.tema === filtro), true);
  }

  $('contenido').innerHTML = html;
  $('total').textContent = `${cat.artefactos.length} artefacto${cat.artefactos.length === 1 ? '' : 's'}`;
  const ult = cat.artefactos.map(a => a.fecha || '').sort().pop();
  $('actualizado').textContent = ult ? fmtFecha(ult) : '—';
}

/* ---------- Eventos ---------- */
$('chips').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  filtro = b.dataset.tema; store.set('filtroTema', filtro);
  render(); window.scrollTo({ top: 0, behavior: 'smooth' });
});

let tq;
$('q').addEventListener('input', e => {
  clearTimeout(tq);
  tq = setTimeout(() => { query = e.target.value.trim(); render(); }, 120);
});

document.addEventListener('click', e => {
  const s = e.target.closest('[data-fav]'); if (!s) return;
  e.preventDefault(); e.stopPropagation();
  const id = s.dataset.fav;
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set('favoritos', [...favs]);
  render();
});

cargar();
