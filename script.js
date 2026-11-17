/*
  MARlANA BARROS · Cartão profissional digital
  Edite apenas o objeto PROFILE abaixo para atualizar contatos, fotos e conteúdos.
  URLs vazias são ocultadas automaticamente para evitar botões sem destino.
*/
const PROFILE = {
  name: 'Mariana Barros',
  role: 'Head de Design & UX',
  company: 'Lumos Connect',
  photo: './assets/mariana.webp',
  phone: '5581979142185',
  email: 'marioliveralbubarris@gmail.com',
  description: 'Profissional de design e experiência do usuário focada em criar interfaces intuitivas, acessíveis e centradas nas pessoas.',
  about: 'Mariana Barros atua na área de Design e Experiência do Usuário na Lumos Connect, com foco na criação de interfaces digitais intuitivas, acessíveis e centradas nas necessidades das pessoas.',
  links: {
    whatsapp: 'https://wa.me/5581979142185?s=p',
    instagram: '',
    linkedin: 'https://www.linkedin.com/in/mariana-olivera-m10?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    portfolio: '',
    github: '',
    lumosWebsite: ''
  },
  // Competências visuais de exemplo da versão anterior; revise antes de compartilhar.
  hardSkills: ['UI Design', 'UX Design', 'Figma', 'Prototipação', 'Design Systems', 'Acessibilidade Digital'],
  softSkills: ['Comunicação', 'Colaboração', 'Criatividade', 'Pensamento estratégico']
};

const CONTACTS = [
  { key: 'whatsapp', title: 'WhatsApp', detail: 'Converse comigo', icon: 'message' },
  { key: 'instagram', title: 'Instagram', detail: 'Acompanhe meu trabalho', icon: 'instagram' },
  { key: 'linkedin', title: 'LinkedIn', detail: 'Minha rede profissional', icon: 'linkedin' },
  { key: 'portfolio', title: 'Meu Portfólio', detail: 'Projetos e experiências', icon: 'briefcase', featured: true },
  { key: 'github', title: 'GitHub', detail: 'Projetos e colaborações', icon: 'github' },
  { key: 'email', title: 'E-mail', detail: 'Contato profissional', icon: 'mail' },
  { key: 'lumosWebsite', title: 'Lumos Connect', detail: 'Conheça nossa startup', icon: 'globe' }
];

const $ = id => document.getElementById(id);
const svg = (id, className = 'mark') => `<svg class="${className}" aria-hidden="true"><use href="#ico-${id}"></use></svg>`;

function safeUrl(input) {
  if (!input || typeof input !== 'string') return '';
  try {
    const url = new URL(input.trim());
    return url.protocol === 'https:' ? url.href : '';
  } catch { return ''; }
}

function getLink(item) {
  if (item.key === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PROFILE.email)
    ? `mailto:${PROFILE.email}` : '';
  return safeUrl(PROFILE.links[item.key]);
}

function makeContactCards() {
  const grid = $('contact-grid');
  grid.replaceChildren();
  for (const item of CONTACTS) {
    const href = getLink(item);
    if (!href) continue;
    const card = document.createElement('a');
    card.className = 'social-card' + (item.featured ? ' is-featured' : '');
    card.href = href;
    if (!href.startsWith('mailto:')) {
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }
    card.innerHTML = `${svg(item.icon)}${svg('arrow', 'arrow')}<div><span class="social-title"></span><span class="social-detail"></span></div>`;
    card.querySelector('.social-title').textContent = item.title;
    card.querySelector('.social-detail').textContent = item.detail;
    card.setAttribute('aria-label', `${item.title}: ${item.detail}`);
    grid.appendChild(card);
  }
  $('copy-email').hidden = !getLink({ key: 'email' });
}

function escapeCard(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function downloadContact() {
  const nameBits = PROFILE.name.trim().split(/\s+/);
  const lastName = nameBits.pop();
  const firstNames = nameBits.join(' ');
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${escapeCard(PROFILE.name)}`,
    `N:${escapeCard(lastName)};${escapeCard(firstNames)};;;`,
    `ORG:${escapeCard(PROFILE.company)}`,
    `TITLE:${escapeCard(PROFILE.role)}`
  ];
  if (PROFILE.phone) lines.push(`TEL;TYPE=CELL:+${PROFILE.phone.replace(/\D/g, '')}`);
  if (PROFILE.email) lines.push(`EMAIL;TYPE=INTERNET:${PROFILE.email}`);
  if (safeUrl(PROFILE.links.portfolio)) lines.push(`URL:${safeUrl(PROFILE.links.portfolio)}`);
  else if (safeUrl(PROFILE.links.linkedin)) lines.push(`URL:${safeUrl(PROFILE.links.linkedin)}`);
  lines.push('END:VCARD');
  const content = lines.join('\r\n') + '\r\n';
  const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Mariana-Barros.vcf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast('Contato pronto para salvar');
}

let toastTimer;
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(PROFILE.email);
    showToast('E-mail copiado!');
  } catch {
    // Copiar pode exigir HTTPS. O e-mail continua acessível pelo card de contato.
    showToast('Use o card de e-mail para entrar em contato');
  }
}

function populateProfile() {
  $('profile-name').textContent = PROFILE.name;
  $('hero-description').textContent = PROFILE.description;
  $('about-description').textContent = PROFILE.about;
  $('year').textContent = String(new Date().getFullYear());

  const portrait = $('profile-photo');
  portrait.onload = () => portrait.classList.add('loaded');
  portrait.onerror = () => portrait.classList.remove('loaded');
  portrait.src = PROFILE.photo;
  if (portrait.complete && portrait.naturalWidth) portrait.classList.add('loaded');

  const cta = $('whatsapp-cta');
  const whatsapp = safeUrl(PROFILE.links.whatsapp);
  if (whatsapp) {
    cta.href = whatsapp;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.removeAttribute('aria-disabled');
    cta.setAttribute('aria-label', 'Conversar com Mariana pelo WhatsApp');
  } else {
    cta.hidden = true;
  }

  const hard = $('hard-skills');
  for (const text of PROFILE.hardSkills) {
    const el = document.createElement('span');
    el.className = 'chip';
    el.textContent = text;
    hard.appendChild(el);
  }
  const soft = $('soft-skills');
  for (const text of PROFILE.softSkills) {
    const el = document.createElement('span');
    el.className = 'soft-item';
    el.textContent = text;
    soft.appendChild(el);
  }
  makeContactCards();
}

$('save-contact').addEventListener('click', downloadContact);
$('copy-email').addEventListener('click', copyEmail);
populateProfile();
