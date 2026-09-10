
  const FALLBACK_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink.svg/512px-Valorant_logo_-_pink.svg.png";

  let allAgents = [];
  let pendingDeleteId = null;
  let pendingDeleteName = '';


  function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-close]').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.dataset.close))
  );

  document.querySelectorAll('.modal-overlay').forEach(overlay =>
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    })
  );

  function imgWithFallback(img) {
    img.onerror = () => { img.src = FALLBACK_IMG; img.onerror = null; };
  }


  async function loadAgents() {
    try {
      const res = await fetch('/agents');
      allAgents = await res.json();
      renderAgents(allAgents);
    } catch {
      showToast('Failed to load agents.', 'error');
    }
  }

  function renderAgents(agents) {
    const grid = document.getElementById('agents-grid');
    document.getElementById('count-num').textContent = agents.length;

    if (!agents.length) {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">◈</div><p>No agents found</p></div>`;
      return;
    }

    grid.innerHTML = agents.map((a, i) => `
      <div class="agent-card" data-id="${a.id}" style="animation-delay:${i * 40}ms">
        <div class="card-img-wrap">
          <img data-src="${a.imageUrl}" alt="${a.name}" />
          ${a.role ? `<span class="card-role-badge">${a.role}</span>` : ''}
          <div class="card-overlay"></div>
        </div>
        <div class="card-info">
          <div class="card-name">${a.name}</div>
        </div>
        <div class="card-actions">
          <button class="btn btn-edit" data-action="edit" data-id="${a.id}">Edit</button>
          <button class="btn btn-danger" data-action="delete" data-id="${a.id}" data-name="${a.name}">Delete</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      imgWithFallback(img);
    });

    grid.querySelectorAll('.agent-card').forEach(card => {
      card.querySelector('.card-img-wrap').addEventListener('click', () => openDetail(card.dataset.id));
      card.querySelector('.card-name').addEventListener('click', () => openDetail(card.dataset.id));
    });

    grid.querySelectorAll('[data-action="edit"]').forEach(btn =>
      btn.addEventListener('click', e => { e.stopPropagation(); openEditForm(btn.dataset.id); })
    );
    grid.querySelectorAll('[data-action="delete"]').forEach(btn =>
      btn.addEventListener('click', e => { e.stopPropagation(); promptDelete(btn.dataset.id, btn.dataset.name); })
    );
  }


  function applyFilter() {
    const q = document.getElementById('search-input').value.toLowerCase();
    const role = document.getElementById('role-filter').value;
    const filtered = allAgents.filter(a =>
      a.name.toLowerCase().includes(q) &&
      (!role || a.role === role)
    );
    renderAgents(filtered);
  }

  document.getElementById('search-input').addEventListener('input', applyFilter);
  document.getElementById('role-filter').addEventListener('change', applyFilter);


  async function openDetail(id) {
    try {
      const res = await fetch(`/agents/${id}`);
      const a = await res.json();

      const img = document.getElementById('detail-img');
      img.src = a.imageUrl;
      img.alt = a.name;
      imgWithFallback(img);

      document.getElementById('detail-id').textContent = `#${String(a.id).padStart(3,'0')}`;
      document.getElementById('detail-role').textContent = a.role || 'Unknown Role';
      document.getElementById('detail-name').textContent = a.name;
      document.getElementById('detail-desc').textContent = a.description || 'No description available.';

      document.getElementById('detail-btn-edit').onclick = () => { closeModal('modal-detail'); openEditForm(a.id); };
      document.getElementById('detail-btn-delete').onclick = () => { closeModal('modal-detail'); promptDelete(a.id, a.name); };

      openModal('modal-detail');
    } catch {
      showToast('Failed to load agent details.', 'error');
    }
  }


  function openAddForm() {
    document.getElementById('form-agent-id').value = '';
    document.getElementById('form-name').value = '';
    document.getElementById('form-role').value = '';
    document.getElementById('form-image').value = '';
    document.getElementById('form-desc').value = '';
    document.getElementById('img-preview').classList.remove('visible');
    document.getElementById('err-name').classList.remove('visible');
    document.getElementById('err-image').classList.remove('visible');
    document.getElementById('form-modal-title').innerHTML = 'Add <span class="accent">Agent</span>';
    document.getElementById('form-submit').textContent = 'Save Agent';
    openModal('modal-form');
  }

  async function openEditForm(id) {
    try {
      const res = await fetch(`/agents/${id}`);
      const a = await res.json();

      document.getElementById('form-agent-id').value = a.id;
      document.getElementById('form-name').value = a.name;
      document.getElementById('form-role').value = a.role || '';
      document.getElementById('form-image').value = a.imageUrl;
      document.getElementById('form-desc').value = a.description || '';

      const prev = document.getElementById('img-preview');
      prev.src = a.imageUrl;
      imgWithFallback(prev);
      prev.classList.add('visible');

      document.getElementById('err-name').classList.remove('visible');
      document.getElementById('err-image').classList.remove('visible');
      document.getElementById('form-modal-title').innerHTML = 'Edit <span class="accent">Agent</span>';
      document.getElementById('form-submit').textContent = 'Update Agent';
      openModal('modal-form');
    } catch {
      showToast('Failed to load agent for editing.', 'error');
    }
  }

  let previewTimer;
  document.getElementById('form-image').addEventListener('input', () => {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      const url = document.getElementById('form-image').value.trim();
      const prev = document.getElementById('img-preview');
      if (url) {
        prev.src = url;
        imgWithFallback(prev);
        prev.classList.add('visible');
      } else {
        prev.classList.remove('visible');
      }
    }, 400);
  });

  document.getElementById('btn-add').addEventListener('click', openAddForm);


  document.getElementById('form-submit').addEventListener('click', async () => {
    const id     = document.getElementById('form-agent-id').value;
    const name   = document.getElementById('form-name').value.trim();
    const role   = document.getElementById('form-role').value;
    const imageUrl = document.getElementById('form-image').value.trim();
    const description = document.getElementById('form-desc').value.trim();

    let valid = true;
    if (!name)     { document.getElementById('err-name').classList.add('visible');  document.getElementById('form-name').classList.add('error');  valid = false; }
    else           { document.getElementById('err-name').classList.remove('visible'); document.getElementById('form-name').classList.remove('error'); }
    if (!imageUrl) { document.getElementById('err-image').classList.add('visible'); document.getElementById('form-image').classList.add('error'); valid = false; }
    else           { document.getElementById('err-image').classList.remove('visible'); document.getElementById('form-image').classList.remove('error'); }

    if (!valid) return;

    const payload = { name, role, imageUrl, description };
    const url     = id ? `/agents/${id}` : '/agents';
    const method  = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Request failed.', 'error'); return; }

      closeModal('modal-form');
      showToast(id ? `${name} updated.` : `${name} added to roster.`, 'success');
      await loadAgents();
    } catch {
      showToast('Network error.', 'error');
    }
  });

  function promptDelete(id, name) {
    pendingDeleteId = id;
    pendingDeleteName = name;
    document.getElementById('confirm-name').textContent = name;
    openModal('modal-confirm');
  }

  document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    try {
      const res = await fetch(`/agents/${pendingDeleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Delete failed.', 'error'); return; }

      closeModal('modal-confirm');
      showToast(`${pendingDeleteName} removed from roster.`, 'success');
      pendingDeleteId = null;
      await loadAgents();
    } catch {
      showToast('Network error.', 'error');
    }
  });

  loadAgents();
