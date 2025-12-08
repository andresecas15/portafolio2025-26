const projectsContainer = document.getElementById('projectsContainer');
const integrationsContainer = document.getElementById('integrationsContainer');
const filtros = document.querySelectorAll('.filtros button');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

let currentFilter = 'all';
let projectsData = [];
let integrationsData = [];

async function loadData() {
  try {
    const [pRes, iRes] = await Promise.all([
      fetch('data/projects.json'),
      fetch('data/integrations.json')
    ]);
    projectsData = await pRes.json();
    integrationsData = await iRes.json();
    renderProjects();
    renderIntegrations();
  } catch (e) {
    projectsContainer.innerHTML = '<p>Error cargando datos.</p>';
  }
}

function renderProjects() {
  projectsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  projectsData
    .filter(p => currentFilter === 'all' || p.categories.includes(currentFilter))
    .forEach(p => {
      const card = document.createElement('article');
      card.className = 'card fade-in';
      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">
          ${p.categories.map(c => `<span class="tag ${c === 'finanzas' ? 'highlight':''}">${c}</span>`).join('')}
        </div>
        <small>Stack: ${p.stack.join(', ')}</small>
      `;
      fragment.appendChild(card);
    });
  projectsContainer.appendChild(fragment);
}

function renderIntegrations() {
  integrationsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  integrationsData.forEach(it => {
    const box = document.createElement('div');
    box.className = 'integration fade-in';
    box.innerHTML = `
      <h4>${it.name}</h4>
      <p>${it.summary}</p>
      <small>Protocolos: ${it.protocols.join(', ')}</small>
    `;
    fragment.appendChild(box);
  });
  integrationsContainer.appendChild(fragment);
}

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    currentFilter = btn.dataset.filter;
    renderProjects();
  });
});

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('abierto');
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  document.body.classList.add('theme-transition');
  setTimeout(()=>document.body.classList.remove('theme-transition'),700);
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      if(navMenu.classList.contains('abierto')) navMenu.classList.remove('abierto');
    }
  });
});

const form = document.querySelector('form[name="contact"]');
const statusEl = document.getElementById('formStatus');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Enviando...';
    const data = new FormData(form);
    try {
      await fetch('/', { method:'POST', body:data });
      statusEl.textContent = 'Mensaje enviado. Gracias.';
      form.reset();
    } catch (e) {
      statusEl.textContent = 'Error al enviar.';
    }
  });
}

loadData();
