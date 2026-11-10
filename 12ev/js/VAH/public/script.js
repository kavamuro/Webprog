const apiUrl = '/agents';
let allAgents = [];
let currentAgentId = null;

// Default Valorant Logo for broken URLs
const DEFAULT_IMG = "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e4aca3f1b081/0/largeicon.png";

// DOM Elements
const grid = document.getElementById('agentGrid');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');

// Fetch and Render
async function fetchAgents() {
    const res = await fetch(apiUrl);
    allAgents = await res.json();
    renderAgents(allAgents);
}

function renderAgents(agentsToRender) {
    grid.innerHTML = '';
    agentsToRender.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openDetails(agent);

        // Fallback image handling using onerror
        card.innerHTML = `
            <img src="${agent.imageUrl}" onerror="this.onerror=null; this.src='${DEFAULT_IMG}';" alt="${agent.name}">
            <h3>${agent.name}</h3>
            <p>${agent.role}</p>
        `;
        grid.appendChild(card);
    });
}

// Search and Filter Logic
function applyFilters() {
    const searchVal = searchInput.value.toLowerCase();
    const roleVal = roleFilter.value;

    const filtered = allAgents.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchVal);
        const matchesRole = roleVal === "" || a.role === roleVal;
        return matchesSearch && matchesRole;
    });
    renderAgents(filtered);
}

searchInput.addEventListener('input', applyFilters);
roleFilter.addEventListener('change', applyFilters);

// Modals Handling
function closeModals() {
    document.getElementById('detailsModal').classList.add('hidden');
    document.getElementById('formModal').classList.add('hidden');
}

function openDetails(agent) {
    currentAgentId = agent.id;
    document.getElementById('detailName').innerText = agent.name;
    document.getElementById('detailRole').innerText = agent.role;
    document.getElementById('detailDesc').innerText = agent.description;
    
    const img = document.getElementById('detailImg');
    img.src = agent.imageUrl;
    img.onerror = () => img.src = DEFAULT_IMG; // Fallback for details modal

    document.getElementById('detailsModal').classList.remove('hidden');
}

// Delete Logic with Confirmation
document.getElementById('deleteBtn').onclick = async () => {
    const agentName = document.getElementById('detailName').innerText;
    
    // Deletion Confirmation
    if (confirm(`Are you sure you want to delete ${agentName}?`)) {
        await fetch(`${apiUrl}/${currentAgentId}`, { method: 'DELETE' });
        closeModals();
        fetchAgents();
    }
};

// Add/Edit Form Logic
document.getElementById('addBtn').onclick = () => {
    document.getElementById('agentForm').reset();
    document.getElementById('agentId').value = '';
    document.getElementById('formTitle').innerText = 'Add New Agent';
    document.getElementById('formModal').classList.remove('hidden');
};

document.getElementById('editBtn').onclick = async () => {
    const agent = allAgents.find(a => a.id === currentAgentId);
    document.getElementById('agentId').value = agent.id;
    document.getElementById('name').value = agent.name;
    document.getElementById('role').value = agent.role;
    document.getElementById('imageUrl').value = agent.imageUrl;
    document.getElementById('description').value = agent.description;
    
    document.getElementById('formTitle').innerText = 'Edit Agent';
    document.getElementById('detailsModal').classList.add('hidden');
    document.getElementById('formModal').classList.remove('hidden');
};

// Form Submission (POST and PUT combined)
document.getElementById('agentForm').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('agentId').value;
    
    const payload = {
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        closeModals();
        fetchAgents();
    } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
    }
};

// Init
fetchAgents();