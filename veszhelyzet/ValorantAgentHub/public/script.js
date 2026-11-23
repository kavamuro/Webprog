
  const FALLBACK_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink.svg/512px-Valorant_logo_-_pink.svg.png";

  let allAgents = [];
  let currentUser = null;
  let onlyMine = false;
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

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  }

  function isMine(agent) {
    return currentUser !== null && agent.userId === currentUser.id;
  }


  async function api(url, method = 'GET', body) {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }

  function imgWithFallback(img) {
    img.onerror = () => { img.src = FALLBACK_IMG; img.onerror = null; };
  }


  async function loadAgents() {
    try {
      allAgents = await api('/agents');
      applyFilter();
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
          <img data-src="${escapeHtml(a.imageUrl)}" alt="${escapeHtml(a.name)}" />
          ${a.role ? `<span class="card-role-badge">${escapeHtml(a.role)}</span>` : ''}
          ${a.isPublic ? '' : '<span class="card-private-badge">Private</span>'}
          <div class="card-overlay"></div>
        </div>
        <div class="card-info">
          <div class="card-name">${escapeHtml(a.name)}</div>
        </div>
        ${isMine(a) ? `<div class="card-actions">
          <button class="btn btn-edit" data-action="edit" data-id="${a.id}">Edit</button>
          <button class="btn btn-danger" data-action="delete" data-id="${a.id}" data-name="${escapeHtml(a.name)}">Delete</button>
        </div>` : ''}
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
      (!role || a.role === role) &&
      (!onlyMine || isMine(a))
    );
    renderAgents(filtered);
  }

  document.getElementById('search-input').addEventListener('input', applyFilter);
  document.getElementById('role-filter').addEventListener('change', applyFilter);


  async function openDetail(id) {
    try {
      const a = await api(`/agents/${id}`);

      const img = document.getElementById('detail-img');
      img.src = a.imageUrl;
      img.alt = a.name;
      imgWithFallback(img);

      document.getElementById('detail-id').textContent = `#${String(a.id).padStart(3,'0')}`;
      document.getElementById('detail-role').textContent = a.role || 'Unknown Role';
      document.getElementById('detail-name').textContent = a.name;
      document.getElementById('detail-desc').textContent = a.description || 'No description available.';

      document.getElementById('detail-owner').textContent =
        (a.owner ? `By ${a.owner}` : 'Official') + (a.isPublic ? '' : ' / Private');
      document.getElementById('detail-actions').style.display = isMine(a) ? '' : 'none';

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
    document.getElementById('form-file').value = '';
    document.getElementById('form-visibility').value = 'public';
    document.getElementById('img-preview').classList.remove('visible');
    document.getElementById('err-name').classList.remove('visible');
    document.getElementById('err-image').classList.remove('visible');
    document.getElementById('form-modal-title').innerHTML = 'Add <span class="accent">Agent</span>';
    document.getElementById('form-submit').textContent = 'Save Agent';
    openModal('modal-form');
  }

  async function openEditForm(id) {
    try {
      const a = await api(`/agents/${id}`);

      document.getElementById('form-agent-id').value = a.id;
      document.getElementById('form-name').value = a.name;
      document.getElementById('form-role').value = a.role || '';
      document.getElementById('form-image').value = a.imageUrl;
      document.getElementById('form-desc').value = a.description || '';
      document.getElementById('form-file').value = '';
      document.getElementById('form-visibility').value = a.isPublic ? 'public' : 'private';

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

  document.getElementById('form-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const prev = document.getElementById('img-preview');
    prev.src = URL.createObjectURL(file);
    imgWithFallback(prev);
    prev.classList.add('visible');
  });

  async function uploadImage(file) {
    const res = await fetch('/uploads', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed.');
    return data.imageUrl;
  }

  document.getElementById('btn-add').addEventListener('click', openAddForm);


  document.getElementById('form-submit').addEventListener('click', async () => {
    const id     = document.getElementById('form-agent-id').value;
    const name   = document.getElementById('form-name').value.trim();
    const role   = document.getElementById('form-role').value;
    let imageUrl = document.getElementById('form-image').value.trim();
    const file = document.getElementById('form-file').files[0];
    const isPublic = document.getElementById('form-visibility').value === 'public';
    const description = document.getElementById('form-desc').value.trim();

    let valid = true;
    if (!name)     { document.getElementById('err-name').classList.add('visible');  document.getElementById('form-name').classList.add('error');  valid = false; }
    else           { document.getElementById('err-name').classList.remove('visible'); document.getElementById('form-name').classList.remove('error'); }
    if (!imageUrl && !file) { document.getElementById('err-image').classList.add('visible'); document.getElementById('form-image').classList.add('error'); valid = false; }
    else           { document.getElementById('err-image').classList.remove('visible'); document.getElementById('form-image').classList.remove('error'); }

    if (!valid) return;

    const url     = id ? `/agents/${id}` : '/agents';
    const method  = id ? 'PUT' : 'POST';

    const submit = document.getElementById('form-submit');
    submit.disabled = true;
    try {
      if (file) {
        imageUrl = await uploadImage(file);
        
        document.getElementById('form-image').value = imageUrl;
        document.getElementById('form-file').value = '';
      }
      await api(url, method, { name, role, imageUrl, description, isPublic });

      closeModal('modal-form');
      showToast(id ? `${name} updated.` : `${name} added to roster.`, 'success');
      await loadAgents();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      submit.disabled = false;
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
      await api(`/agents/${pendingDeleteId}`, 'DELETE');

      closeModal('modal-confirm');
      showToast(`${pendingDeleteName} removed from roster.`, 'success');
      pendingDeleteId = null;
      await loadAgents();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });


  const el = id => document.getElementById(id);

  function setOnlyMine(value) {
    onlyMine = value;
    el('btn-mine').classList.toggle('active', value);
    el('btn-mine').setAttribute('aria-pressed', value);
  }

  async function setUser(user) {
    currentUser = user;
    el('btn-login').hidden = el('btn-register').hidden = user !== null;
    el('btn-account').hidden = el('btn-logout').hidden = user === null;
    el('btn-add').hidden = el('btn-mine').hidden = user === null;
    el('btn-account').textContent = user ? user.username : '';
    if (!user) setOnlyMine(false);
    await loadAgents();
  }

  function showFormError(id, msg) {
    el(id).textContent = msg;
    el(id).classList.toggle('visible', msg !== '');
  }

  el('btn-mine').addEventListener('click', () => { setOnlyMine(!onlyMine); applyFilter(); });


  let authMode = 'login';

  function openAuth(mode) {
    authMode = mode;
    const login = mode === 'login';
    el('auth-title').textContent = el('auth-submit').textContent = login ? 'Log in' : 'Register';
    el('auth-switch').textContent = login ? 'Create an account' : 'I have an account';
    el('auth-password').value = '';
    el('auth-password').autocomplete = login ? 'current-password' : 'new-password';
    showFormError('auth-error', '');
    openModal('modal-auth');
    el('auth-username').focus();
  }

  el('btn-login').addEventListener('click', () => openAuth('login'));
  el('btn-register').addEventListener('click', () => openAuth('register'));
  el('auth-switch').addEventListener('click', () => openAuth(authMode === 'login' ? 'register' : 'login'));

  el('auth-form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const { user } = await api(`/auth/${authMode}`, 'POST', {
        username: el('auth-username').value,
        password: el('auth-password').value,
      });
      el('auth-form').reset();
      closeModal('modal-auth');
      showToast(`Welcome, ${user.username}!`, 'success');
      await setUser(user);
    } catch (err) {
      showFormError('auth-error', err.message);
    }
  });

  el('btn-logout').addEventListener('click', async () => {
    try {
      await api('/auth/logout', 'POST');
      showToast('Logged out.');
      await setUser(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });


  el('btn-account').addEventListener('click', () => {
    el('account-form').reset();
    el('account-username').value = currentUser.username;
    showFormError('account-error', '');
    openModal('modal-account');
  });

  el('account-form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const { user } = await api('/auth/me', 'PUT', {
        username: el('account-username').value,
        newPassword: el('account-new').value,
        currentPassword: el('account-current').value,
      });
      closeModal('modal-account');
      showToast('Account updated.', 'success');
      await setUser(user);
    } catch (err) {
      showFormError('account-error', err.message);
    }
  });

  el('account-delete').addEventListener('click', async () => {
    if (!confirm('Delete your account and all of your agents? This cannot be undone.')) return;
    try {
      await api('/auth/me', 'DELETE', { currentPassword: el('account-current').value });
      closeModal('modal-account');
      showToast('Account deleted.');
      await setUser(null);
    } catch (err) {
      showFormError('account-error', err.message);
    }
  });


  api('/auth/me').then(({ user }) => setUser(user), () => setUser(null));
