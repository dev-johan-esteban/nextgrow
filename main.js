// =========================================================================
// 1. CONTROLADOR DE TEMA (MODO CLARO / OSCURO)
// =========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        if (savedTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    } else {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;

        if (isNight) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    updateThemeLabel();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeLabel();
}

function updateThemeLabel() {
    const isDark = document.documentElement.classList.contains('dark');
    const label = document.getElementById('theme-label');
    if (label) {
        label.textContent = isDark ? 'Oscuro' : 'Claro';
    }
}

// Inicializar tema al cargar
initTheme();


// =========================================================================
// 2. CONTROLADOR DE NAVEGACIÓN Y VISTAS
// =========================================================================
function switchView(view) {
    const views = {
        'inicio': document.getElementById('view-inicio'),
        'servicios': document.getElementById('view-servicios'),
        'blog': document.getElementById('view-blog'),
        'desarrollo-web': document.getElementById('view-desarrollo-web'),
        'automatizaciones': document.getElementById('view-automatizaciones'),
        'software': document.getElementById('view-software')
    };

    const btnInicio = document.getElementById('nav-btn-inicio');
    const btnServicios = document.getElementById('nav-btn-servicios');
    const btnBlog = document.getElementById('nav-btn-blog');

    // Ocultar todas las vistas
    Object.keys(views).forEach(k => {
        if (views[k]) views[k].classList.add('hidden');
    });

    // Mostrar vista objetivo
    const target = views[view] || views['inicio'];
    if (target) target.classList.remove('hidden');

    // Clases del menú
    const inactiveClass = "px-5 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300";
    const activeClass = "px-5 py-2 rounded-full transition-all duration-300 bg-electric-600 text-white shadow-md shadow-electric-600/30";

    if (btnInicio) btnInicio.className = inactiveClass;
    if (btnServicios) btnServicios.className = inactiveClass;
    if (btnBlog) btnBlog.className = inactiveClass;

    if (view === 'servicios' || view === 'desarrollo-web' || view === 'automatizaciones' || view === 'software') {
        if (btnServicios) btnServicios.className = activeClass;
    } else if (view === 'blog') {
        if (btnBlog) btnBlog.className = activeClass;
        renderBlogArticles();
    } else {
        if (btnInicio) btnInicio.className = activeClass;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileNav() {
    const m = document.getElementById('mobile-menu');
    if (m) m.classList.toggle('hidden');
}


// =========================================================================
// 3. CONTROLADORES DE MODALES Y FAQS
// =========================================================================
function openModal() {
    const m = document.getElementById('diagnostic-modal');
    const f = document.getElementById('modal-form-view');
    const s = document.getElementById('modal-success-view');
    if (m && f && s) {
        f.classList.remove('hidden');
        s.classList.add('hidden');
        m.classList.remove('hidden');
    }
}

function closeModal() {
    const m = document.getElementById('diagnostic-modal');
    if (m) m.classList.add('hidden');
}

// Número de WhatsApp receptor de la agencia
const AGENCY_WHATSAPP_NUMBER = "573000000000";

function submitLead(e) {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const phoneInput = document.getElementById('lead-phone');
    const areaInput = document.getElementById('lead-area');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const area = areaInput ? areaInput.value : '';

    if (!name || !phone || !area) {
        alert("Por favor completa todos los campos del formulario.");
        return;
    }

    const message = `👋 *Hola NextGrow, quiero agendar mi diagnóstico gratuito.*\n\n` +
        `📌 *Nombre:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🎯 *Área prioritaria:* ${area}`;

    const whatsappUrl = `https://wa.me/${AGENCY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('modal-success-view');

    if (formView && successView) {
        formView.classList.add('hidden');
        successView.classList.remove('hidden');
    }

    window.open(whatsappUrl, '_blank');
    e.target.reset();
}

function showVideo(title, sub) {
    const m = document.getElementById('video-modal');
    const t = document.getElementById('video-title');
    const s = document.getElementById('video-sub');
    const p = document.getElementById('video-now-playing');
    if (m && t && s && p) {
        t.textContent = title;
        s.textContent = sub;
        p.textContent = title;
        m.classList.remove('hidden');
    }
}

function closeVideo() {
    const m = document.getElementById('video-modal');
    if (m) m.classList.add('hidden');
}

function toggleFaq(id) {
    const ans = document.getElementById(`faq-ans-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);
    if (ans && icon) {
        const isClosed = ans.classList.contains('hidden');
        ans.classList.toggle('hidden');
        icon.textContent = isClosed ? '−' : '+';
    }
}


// =========================================================================
// 4. SIMULADOR INTERACTIVO DE WHATSAPP BOT (AUTOMATIZACIONES)
// =========================================================================
const simResponses = {
    precios: [
        { sender: 'user', text: '¿Cuánto cuesta implementar un sistema?' },
        { sender: 'bot', text: '¡Excelente pregunta! Nuestros sistemas se adaptan a tu volumen actual. Comienzan con una inversión accesible que se amortiza con las primeras 2-3 ventas. ¿Te gustaría agendar 15 min para revisar tu caso?' }
    ],
    agendar: [
        { sender: 'user', text: 'Quiero agendar una llamada con un asesor' },
        { sender: 'bot', text: '✅ ¡Perfecto! Tengo disponibilidad mañana a las 10:30 AM o 3:00 PM (hora Colombia). ¿Cuál te queda más cómodo para bloquear en tu Google Calendar?' }
    ],
    calificar: [
        { sender: 'user', text: '¿Esto funciona para mi tipo de empresa?' },
        { sender: 'bot', text: '🔍 Funciona si vendes servicios, B2B, inmobiliaria o cursos y recibes más de 30 consultas al mes. ¿Cuántos leads promedio recibes hoy por semana?' }
    ]
};

function triggerSim(type) {
    const box = document.getElementById('sim-chat-box');
    if (!box || !simResponses[type]) return;

    const [userMsg, botMsg] = simResponses[type];

    const userDiv = document.createElement('div');
    userDiv.className = 'flex justify-end';
    userDiv.innerHTML = `<div class="bg-growth-600 text-white p-2 rounded-2xl rounded-tr-none max-w-[85%] text-[11px]">${userMsg.text}</div>`;
    box.appendChild(userDiv);
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'flex items-start gap-2';
        botDiv.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-electric-600 text-[10px] flex items-center justify-center text-white shrink-0 font-bold">IA</div>
            <div class="bg-slate-800 text-slate-200 p-2.5 rounded-2xl rounded-tl-none max-w-[85%] text-[11px] leading-snug">
                ${botMsg.text}
            </div>
        `;
        box.appendChild(botDiv);
        box.scrollTop = box.scrollHeight;
    }, 500);
}


// =========================================================================
// 5. INSPECTOR DE NODOS DE PROCESOS (AUTOMATIZACIONES)
// =========================================================================
const nodeDetails = {
    1: {
        tag: 'FASE 1: CAPTURA SIN PÉRDIDA DE LEADS',
        title: 'El prospecto entra desde cualquier canal publicitario o directo',
        desc: 'Se conecta automáticamente con Meta Ads, Google Ads, formularios web y DMs de Instagram. Sin copiar ni pegar datos a mano.'
    },
    2: {
        tag: 'FASE 2: CALIFICACIÓN INMEDIATA CON IA (< 3 SEG)',
        title: 'El bot responde en WhatsApp, filtra curiosos y califica presupuesto',
        desc: 'Si no tiene presupuesto, se le entrega recurso gratuito; si está calificado, se le propone horario directo con un asesor.'
    },
    3: {
        tag: 'FASE 3: INTEGRACIÓN CRM SIN EXCEL',
        title: 'Pipeline organizado automáticamente con tags de prioridad',
        desc: 'El contacto queda en la etapa exacta de negociación en GoHighLevel o HubSpot con recordatorios automáticos de seguimiento.'
    },
    4: {
        tag: 'FASE 4: SECUENCIA DE NUTRICIÓN MULTICANAL',
        title: 'Email y mensajes de WhatsApp personalizados en piloto automático',
        desc: 'Resuelve dudas frecuentes, envía testimonios y casos de estudio para calentar al prospecto antes de la llamada de cierre.'
    },
    5: {
        tag: 'FASE 5: CIERRE DE VENTA, COBRO Y ONBOARDING',
        title: 'Contrato firmado, pasarela de pago y accesos generados al instante',
        desc: 'El cliente paga por pasarela integrada y recibe su bienvenida de inmediato sin esperar que alguien lo procese a mano.'
    }
};

function inspectNode(id) {
    const data = nodeDetails[id];
    if (!data) return;

    for (let i = 1; i <= 5; i++) {
        const n = document.getElementById(`p-node-${i}`);
        if (n) {
            if (i === id) {
                n.className = "p-3.5 rounded-2xl bg-electric-600 text-white text-left transition-all border border-electric-500/50 shadow-lg scale-105";
            } else {
                n.className = "p-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 text-left transition-all border border-slate-200 dark:border-white/10";
            }
        }
    }

    const card = document.getElementById('node-inspector-card');
    if (card) {
        card.innerHTML = `
            <div class="space-y-1 text-left">
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-electric-500/10 text-electric-600 dark:text-electric-400 font-bold">${data.tag}</span>
                <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">${data.title}</h4>
                <p class="text-xs text-slate-600 dark:text-slate-400 max-w-xl">${data.desc}</p>
            </div>
            <div class="shrink-0 flex items-center gap-2">
                <span class="px-3 py-1.5 rounded-xl bg-growth-500/20 text-growth-700 dark:text-growth-400 font-mono text-xs font-bold">100% AUTÓNOMO</span>
            </div>
        `;
    }
}


// =========================================================================
// 6. CALCULADORAS DE AHORRO Y ROAS
// =========================================================================
function updateSavingsCalc() {
    const leadsInput = document.getElementById('calc-leads');
    const teamInput = document.getElementById('calc-team');
    if (!leadsInput || !teamInput) return;

    const leads = parseInt(leadsInput.value, 10);
    const team = parseInt(teamInput.value, 10);

    document.getElementById('calc-leads-label').textContent = `${leads} leads`;
    document.getElementById('calc-team-label').textContent = `${team} asesor${team > 1 ? 'es' : ''}`;

    const hoursSaved = Math.round((leads * 0.1) + (team * 12));
    const moneySaved = Math.round(hoursSaved * 45);

    document.getElementById('calc-hours-res').textContent = `${hoursSaved}h`;
    document.getElementById('calc-money-res').textContent = `$${moneySaved.toLocaleString()} USD`;
}

let currentIndustry = 'b2b';
const industryMultipliers = {
    b2b: { roas: 4.8, cpl: 8, closeRate: 0.08 },
    inmo: { roas: 7.2, cpl: 14, closeRate: 0.04 },
    highticket: { roas: 5.6, cpl: 11, closeRate: 0.06 },
    ecom: { roas: 3.9, cpl: 4, closeRate: 0.05 }
};

function setSimIndustry(ind, btn) {
    currentIndustry = ind;
    document.querySelectorAll('.sim-ind-btn').forEach(b => {
        b.className = 'sim-ind-btn px-3 py-2 rounded-xl text-xs font-bold border transition bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-electric-500';
    });
    if (btn) {
        btn.className = 'sim-ind-btn px-3 py-2 rounded-xl text-xs font-bold border transition bg-electric-600 text-white border-electric-500 shadow-md';
    }
    updateHomeSim();
}

// =========================================================================
// 6. SIMULADOR INTERACTIVO POTENCIADO (ENFOQUE EN FUGAS Y DOLORES)
// =========================================================================
function updateHomeSim() {
    const spendInput = document.getElementById('home-sim-spend');
    if (!spendInput) return;

    const spend = parseInt(spendInput.value, 10);
    document.getElementById('home-sim-spend-label').textContent = `$${spend.toLocaleString()} USD`;

    // Estado de los Checkboxes
    const cbTraffic = document.getElementById('cb-traffic')?.checked || false;
    const cbCurious = document.getElementById('cb-curious')?.checked || false;
    const cbSlowWeb = document.getElementById('cb-slowweb')?.checked || false;
    const cbRoas = document.getElementById('cb-roas')?.checked || false;

    // Contar cuántas fugas se seleccionaron
    const selectedLeaks = [cbTraffic, cbCurious, cbSlowWeb, cbRoas].filter(Boolean).length;

    // Cálculo dinámico de volumen
    const estLeads = Math.round(spend / 7.5);
    const junkFiltered = Math.round(estLeads * 0.82);
    const hoursSaved = Math.round((junkFiltered * 6) / 60);

    // Actualizar métricas
    const junkEl = document.getElementById('home-sim-junk-filtered');
    const hoursEl = document.getElementById('home-sim-hours-saved');
    const leakCountEl = document.getElementById('home-sim-leak-count');
    const titleEl = document.getElementById('home-sim-impact-title');
    const descEl = document.getElementById('home-sim-impact-desc');
    const ctaBtn = document.getElementById('home-sim-cta-btn');

    if (junkEl) junkEl.textContent = `${junkFiltered} chats/mes`;
    if (hoursEl) hoursEl.textContent = `~${hoursSaved} hrs/mes libres`;
    if (leakCountEl) leakCountEl.textContent = `${selectedLeaks} fugas detectadas`;

    // Cambiar dinámicamente el mensaje según la fuga principal marcada
    if (cbCurious && cbSlowWeb) {
        titleEl.innerHTML = "Web ultra veloz +<br>Bot de filtro 24/7";
        descEl.innerHTML = "Eliminas el abandono en tu sitio web y <strong class='text-white'>frenas el spam de curiosos</strong> en tu WhatsApp.";
    } else if (cbCurious) {
        titleEl.innerHTML = "Menos chats vacíos,<br>más ventas cerradas";
        descEl.innerHTML = "Tu equipo comercial pasa de responder dudas repetitivas a <strong class='text-white'>hablar solo con clientes con presupuesto.</strong>";
    } else if (cbSlowWeb) {
        titleEl.innerHTML = "Carga en 0.8 seg,<br>cero fuga de visitas";
        descEl.innerHTML = "Transformamos tu tráfico en prospectos calificados con <strong class='text-white'>arquitectura de alta conversión CRO.</strong>";
    } else if (cbRoas) {
        titleEl.innerHTML = "Atribución clara,<br>retorno medible";
        descEl.innerHTML = "Sabrás exactamente <strong class='text-white'>cuántos dólares bancarios reales</strong> genera cada peso invertido en pauta.";
    } else {
        titleEl.innerHTML = "Sistema Comercial<br>en Piloto Automático";
        descEl.innerHTML = "Integración total de pauta, web CRO, bot de WhatsApp y CRM <strong class='text-white'>para escalar sin desorden.</strong>";
    }

    // Personalizar botón CTA
    if (ctaBtn) {
        const spanBtn = ctaBtn.querySelector('span:first-child');
        if (spanBtn) {
            spanBtn.textContent = selectedLeaks > 0
                ? `Eliminar las ${selectedLeaks} fugas en mi negocio`
                : 'Estructurar mi sistema comercial';
        }
    }
}


// =========================================================================
// 7. CONFIGURADOR DE ECOSISTEMA 360° (SERVICIOS)
// =========================================================================
const ecoNodes = {
    pauta: true,
    web: true,
    bot: true,
    soft: false
};

function toggleEcoNode(node) {
    ecoNodes[node] = !ecoNodes[node];

    const btn = document.getElementById(`eco-btn-${node}`);
    const status = document.getElementById(`eco-status-${node}`);

    if (ecoNodes[node]) {
        btn.className = 'p-4 rounded-2xl border transition-all text-left bg-electric-600 text-white border-electric-400 shadow-lg scale-105';
        status.textContent = 'ON';
        status.className = 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold';
    } else {
        btn.className = 'p-4 rounded-2xl border transition-all text-left bg-slate-800 text-slate-400 border-white/10 opacity-70';
        status.textContent = 'OFF';
        status.className = 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-bold';
    }

    const count = Object.values(ecoNodes).filter(Boolean).length;
    const title = document.getElementById('eco-result-title');
    const desc = document.getElementById('eco-result-desc');
    const mult = document.getElementById('eco-multiplier');

    if (count === 4) {
        title.textContent = 'Ecosistema Total Autónomo (4 Pilares Activos)';
        desc.textContent = 'Pauta hiper-segmentada, embudos CRO, bot 24/7 en WhatsApp y Software centralizado. Escalamiento sin límites.';
        mult.textContent = 'x9.8';
    } else if (count === 3) {
        title.textContent = 'Sistema de Venta Acelerada (3 Pilares Activos)';
        desc.textContent = 'El tráfico llega a tu landing, el bot califica en WhatsApp y agenda directamente en tu calendario con CRM conectado.';
        mult.textContent = 'x6.4';
    } else if (count === 2) {
        title.textContent = 'Embudos & Pauta Básica (2 Pilares Activos)';
        desc.textContent = 'Generación de prospectos y conversión inicial, pero todavía requiere atención humana manual para responder y procesar.';
        mult.textContent = 'x3.2';
    } else if (count === 1) {
        title.textContent = 'Acción Aislada (1 Pilar Activo)';
        desc.textContent = 'Una herramienta individual genera tracción básica pero pierde hasta el 70% de retorno al no estar integrada en sistema.';
        mult.textContent = 'x1.8';
    } else {
        title.textContent = 'Selecciona al menos un pilar';
        desc.textContent = 'Haz clic en los pilares superiores para ver cómo operan en conjunto.';
        mult.textContent = 'x1.0';
    }
}


// =========================================================================
// 8. COMPARADOR CRO & VELOCIDAD WEB (DESARROLLO WEB)
// =========================================================================
function setWebCompareMode(mode) {
    const btnTrad = document.getElementById('web-mode-btn-trad');
    const btnNg = document.getElementById('web-mode-btn-ng');
    const badge = document.getElementById('web-bench-badge');
    const title = document.getElementById('web-bench-title');
    const desc = document.getElementById('web-bench-desc');
    const score = document.getElementById('web-bench-score');
    const scoreSub = document.getElementById('web-bench-score-sub');
    const bounce = document.getElementById('web-bench-bounce');
    const bounceSub = document.getElementById('web-bench-bounce-sub');
    const cvr = document.getElementById('web-bench-cvr');
    const cvrSub = document.getElementById('web-bench-cvr-sub');

    if (mode === 'tradicional') {
        btnTrad.className = 'px-5 py-2 rounded-xl text-xs font-bold transition bg-rose-600 text-white shadow-md';
        btnNg.className = 'px-5 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-400';

        badge.className = 'px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30';
        badge.textContent = 'WEB LENTA / SIN ARQUITECTURA CRO';

        title.textContent = 'Carga en 4.5 seg y tasa de conversión del 1.2%';
        desc.textContent = 'El 78% de los visitantes se van antes de cargar. Sin textos persuasivos ni botón de llamada a la acción claro. La inversión en anuncios se desperdicia.';

        score.textContent = '32/100';
        score.className = 'text-3xl font-black font-mono text-rose-500 mt-1';
        scoreSub.textContent = 'Pésimo rendimiento';
        scoreSub.className = 'text-[10px] text-rose-500 font-bold';

        bounce.textContent = '78%';
        bounce.className = 'text-3xl font-black font-mono text-rose-500 mt-1';
        bounceSub.textContent = 'Fuga crítica de visitas';
        bounceSub.className = 'text-[10px] text-rose-500 font-bold';

        cvr.textContent = '1.2%';
        cvr.className = 'text-3xl font-black font-mono text-rose-500 mt-1';
        cvrSub.textContent = 'Solo 1 de cada 100 compra';
        cvrSub.className = 'text-[10px] text-rose-500 font-bold';
    } else {
        btnNg.className = 'px-5 py-2 rounded-xl text-xs font-bold transition bg-electric-600 text-white shadow-md';
        btnTrad.className = 'px-5 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-400';

        badge.className = 'px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-growth-500/20 text-growth-700 dark:text-growth-400 border border-growth-500/30';
        badge.textContent = 'ARQUITECTURA DE ALTA CONVERSIÓN';

        title.textContent = 'Carga en 0.8 seg y tasa de conversión del 8.4%';
        desc.textContent = 'Diseñada con Core Web Vitals optimizados, copy persuasivo, formulario en un clic y conexión nativa al bot de WhatsApp. Cero fuga de tráfico.';

        score.textContent = '98/100';
        score.className = 'text-3xl font-black font-mono text-growth-600 dark:text-growth-400 mt-1';
        scoreSub.textContent = 'Ultra rápido';
        scoreSub.className = 'text-[10px] text-growth-600 dark:text-growth-400 font-bold';

        bounce.textContent = '16%';
        bounce.className = 'text-3xl font-black font-mono text-electric-600 dark:text-electric-400 mt-1';
        bounceSub.textContent = '-62% de abandono';
        bounceSub.className = 'text-[10px] text-electric-600 dark:text-electric-400 font-bold';

        cvr.textContent = '8.4%';
        cvr.className = 'text-3xl font-black font-mono text-growth-600 dark:text-growth-400 mt-1';
        cvrSub.textContent = '+5.2x más ventas';
        cvrSub.className = 'text-[10px] text-growth-600 dark:text-growth-400 font-bold';
    }
}


// =========================================================================
// 9. SIMULADOR DE ARQUITECTURA DE SOFTWARE & ROI (SOFTWARE)
// =========================================================================
function updateSoftwareSim() {
    const usersInput = document.getElementById('soft-users');
    if (!usersInput) return;

    const users = parseInt(usersInput.value, 10);
    document.getElementById('soft-users-label').textContent = `${users} colaboradores`;

    const hasErp = document.getElementById('mod-erp')?.checked || false;
    const hasBi = document.getElementById('mod-bi')?.checked || false;
    const hasTeam = document.getElementById('mod-team')?.checked || false;
    const hasClient = document.getElementById('mod-client')?.checked || false;

    let perUserMonthlyFee = 35;
    if (hasErp) perUserMonthlyFee += 45;
    if (hasBi) perUserMonthlyFee += 25;
    if (hasTeam) perUserMonthlyFee += 15;
    if (hasClient) perUserMonthlyFee += 30;

    const annualSaasCost = Math.round(users * perUserMonthlyFee * 12);
    const estimatedSavings = Math.round(annualSaasCost * 0.8);

    const saasCostEl = document.getElementById('soft-saas-cost');
    const savingsValEl = document.getElementById('soft-savings-val');

    if (saasCostEl) saasCostEl.textContent = `$${annualSaasCost.toLocaleString()} USD`;
    if (savingsValEl) savingsValEl.textContent = `$${estimatedSavings.toLocaleString()} USD`;
}


// =========================================================================
// 10. BLOG DINÁMICO & INTERACTIVO CONTROLLER
// =========================================================================
const blogDatabase = [
    {
        id: 'bot-whatsapp-no-code',
        category: 'tutorial',
        badge: 'TUTORIAL',
        subtag: '• TUTORIAL PASO A PASO',
        icon: '🤖',
        gradient: 'from-indigo-900 to-purple-950',
        title: 'Cómo crear un bot de WhatsApp que califica leads automáticamente (sin saber programar)',
        summary: 'Guía completa para implementar un bot de calificación en WhatsApp Business en menos de 72 horas, con las herramientas correctas y sin código.',
        readTime: '12 min',
        author: 'Andrés Montoya',
        content: `
            <span class="text-xs font-mono text-electric-600 dark:text-electric-400 font-bold uppercase">TUTORIAL PASO A PASO</span>
            <h2 class="text-xl sm:text-2xl font-black">Cómo crear un bot de WhatsApp que califica leads automáticamente</h2>
            <p class="text-xs text-slate-500">Publicado por Andrés Montoya • Tiempo de lectura: 12 min</p>
            <hr class="border-slate-200 dark:border-white/10 my-3">
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Responder manualmente 100 mensajes al día en WhatsApp para terminar descubriendo que 90 de ellos solo estaban curioseando es la forma más rápida de agotar a tu equipo comercial.
            </p>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white pt-2">El flujo ideal de calificación:</h3>
            <ul class="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li><strong>Paso 1:</strong> Bienvenida inmediata en menos de 3 segundos.</li>
                <li><strong>Paso 2:</strong> Pregunta clave sobre su presupuesto o volumen actual.</li>
                <li><strong>Paso 3:</strong> Derivación automática: si está calificado, agenda directa en Calendly; si no, recurso gratuito en PDF.</li>
            </ul>
        `
    },
    {
        id: 'triplicar-ventas-90-dias',
        category: 'estrategia',
        badge: 'ESTRATEGIA',
        subtag: '• AUMENTO DE VENTAS',
        icon: '🎯',
        gradient: 'from-emerald-950 to-slate-900',
        title: 'El sistema de 5 pasos que usamos para triplicar las ventas de cualquier negocio en 90 días',
        summary: 'No es magia ni coincidencia. Es un proceso repetible y medible que hemos ejecutado en más de 120 negocios. Te lo explicamos sin filtros.',
        readTime: '10 min',
        author: 'Andrés Montoya',
        content: `
            <span class="text-xs font-mono text-growth-600 dark:text-growth-400 font-bold uppercase">ESTRATEGIA PROBADA</span>
            <h2 class="text-xl sm:text-2xl font-black">El sistema de 5 pasos para triplicar tus ventas</h2>
            <p class="text-xs text-slate-500">Publicado por Andrés Montoya • Tiempo de lectura: 10 min</p>
            <hr class="border-slate-200 dark:border-white/10 my-3">
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                La mayoría de negocios cree que vender más consiste en meter más dinero en anuncios. Sin embargo, si tu embudo tiene fugas, meter más tráfico solo multiplicará tu desperdicio.
            </p>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Este sistema alinea la atracción (Meta/Google Ads), la conversión (Landing CRO), la calificación (Bot IA) y la retención (CRM).
            </p>
        `
    },
    {
        id: 'caso-exito-ecommerce',
        category: 'caso',
        badge: 'CASO DE ÉXITO',
        subtag: '• CASO DE ÉXITO',
        icon: '🏗️',
        gradient: 'from-purple-900 to-indigo-950',
        title: 'De 0 a $124.850 en ventas mensuales: el caso de una tienda online que arrancó desde cero',
        summary: 'Cómo construimos el ecosistema digital completo de una tienda de productos naturales y logramos ROAS de x4.7 en los primeros 60 días de operación.',
        readTime: '9 min',
        author: 'Andrés Montoya',
        content: `
            <span class="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold uppercase">CASO DE ÉXITO REAL</span>
            <h2 class="text-xl sm:text-2xl font-black">De 0 a $124.850 USD al mes con E-commerce + CRM</h2>
            <p class="text-xs text-slate-500">Publicado por Andrés Montoya • Tiempo de lectura: 9 min</p>
            <hr class="border-slate-200 dark:border-white/10 my-3">
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Descubre cómo pasamos de pauta fría a carritos recuperados automáticamente por WhatsApp, aumentando el valor medio de pedido (AOV) un 34%.
            </p>
        `
    },
    {
        id: 'make-crm-integracion',
        category: 'automatizaciones',
        badge: 'AUTOMATIZACIÓN',
        subtag: '• AUTOMATIZACIÓN AVANZADA',
        icon: '⚡',
        gradient: 'from-blue-900 to-slate-900',
        title: 'Cómo conectar Make.com con tu CRM para no tocar un Excel nunca más',
        summary: 'Aprende a estructurar webhooks e integraciones automáticas entre tu pasarela de pagos, email marketing y base de datos central.',
        readTime: '8 min',
        author: 'Andrés Montoya',
        content: `
            <span class="text-xs font-mono text-blue-500 font-bold uppercase">TUTORIAL TÉCNICO</span>
            <h2 class="text-xl sm:text-2xl font-black">Automatizaciones con Make.com y webhooks</h2>
            <p class="text-xs text-slate-500">Publicado por Andrés Montoya • Tiempo de lectura: 8 min</p>
            <hr class="border-slate-200 dark:border-white/10 my-3">
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Paso a paso para eliminar el tipeo manual de contactos y sincronizar tu inventario en tiempo real.
            </p>
        `
    },
    {
        id: 'cro-landing-page-tips',
        category: 'estrategia',
        badge: 'ESTRATEGIA',
        subtag: '• CONVERSIÓN CRO',
        icon: '💻',
        gradient: 'from-violet-900 to-indigo-900',
        title: '7 Cambios en tu Landing Page que aumentan la conversión un 40% de inmediato',
        summary: 'Análisis de ganchos visuales, jerarquía de textos, velocidad de carga y pruebas A/B aplicadas a negocios B2B y servicios.',
        readTime: '11 min',
        author: 'Andrés Montoya',
        content: `
            <span class="text-xs font-mono text-violet-400 font-bold uppercase">OPTIMIZACIÓN CRO</span>
            <h2 class="text-xl sm:text-2xl font-black">7 Cambios de alto impacto en tu Landing Page</h2>
            <p class="text-xs text-slate-500">Publicado por Andrés Montoya • Tiempo de lectura: 11 min</p>
            <hr class="border-slate-200 dark:border-white/10 my-3">
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Pequeños ajustes en la posición del botón CTA, testimonios verificados y microcopy que eliminan la fricción del usuario.
            </p>
        `
    },
    {
        id: 'caso-exito-inmobiliaria',
        category: 'caso',
        badge: 'CASO DE ÉXITO',
        subtag: '• INMOBILIARIA',
        icon: '🏢',
        gradient: 'from-emerald-900 to-teal-950',
        title: 'Cómo una constructora vendió 14 apartamentos en 30 días usando pauta e IA',
        summary: 'Estrategia completa de adquisición de leads de alto poder adquisitivo y filtrado automático de crédito pre-aprobado.',
        readTime: '15 min',
        author: 'Andrés Montoya',
        content: `
            <span class="text-xs font-mono text-emerald-400 font-bold uppercase">SECTOR INMOBILIARIO</span>
            <h2 class="text-xl sm:text-2xl font-black">Venta de 14 apartamentos en 30 días con IA</h2>
            <p class="text-xs text-slate-500">Publicado por Andrés Montoya • Tiempo de lectura: 15 min</p>
            <hr class="border-slate-200 dark:border-white/10 my-3">
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Caso práctico sobre cómo agendar visitas calificadas a la sala de ventas sin desperdiciar tiempo en curiosos.
            </p>
        `
    }
];

let activeBlogCategory = 'all';
let blogSearchQuery = '';
let visibleBlogArticlesCount = 3;

function renderBlogArticles() {
    const grid = document.getElementById('blog-articles-grid');
    if (!grid) return;

    let filtered = blogDatabase.filter(art => {
        const matchesCategory = activeBlogCategory === 'all' || art.category === activeBlogCategory;
        const matchesSearch = art.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
            art.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-3 text-center py-12 space-y-2">
                <span class="text-4xl">🔍</span>
                <p class="text-sm font-bold text-slate-900 dark:text-white">No encontramos artículos para esa búsqueda</p>
                <p class="text-xs text-slate-500">Prueba con otra palabra clave o selecciona otra categoría.</p>
            </div>
        `;
        return;
    }

    const itemsToDisplay = filtered.slice(0, visibleBlogArticlesCount);

    itemsToDisplay.forEach(art => {
        const card = document.createElement('article');
        card.className = "rounded-3xl glass-panel border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between group hover:border-electric-500/50 transition duration-300 text-left cursor-pointer";
        card.onclick = () => openBlogModal(art.id);
        card.innerHTML = `
            <div>
                <div class="h-44 bg-gradient-to-br ${art.gradient} p-4 relative flex flex-col justify-between items-start">
                    <span class="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white uppercase font-bold backdrop-blur-md">${art.badge}</span>
                    <span class="text-5xl self-center my-auto drop-shadow-lg">${art.icon}</span>
                </div>
                <div class="p-6 space-y-2">
                    <span class="text-[10px] font-mono text-electric-600 dark:text-electric-400 uppercase font-bold block">${art.subtag}</span>
                    <h3 class="text-base font-black text-slate-900 dark:text-white group-hover:text-electric-600 dark:group-hover:text-electric-400 transition leading-snug">
                        ${art.title}
                    </h3>
                    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                        ${art.summary}
                    </p>
                </div>
            </div>

            <div class="p-6 pt-0 border-t border-slate-100 dark:border-white/[0.05] mt-4 flex items-center justify-between text-xs text-slate-500">
                <div class="flex items-center gap-2 pt-4">
                    <span class="w-7 h-7 rounded-full bg-electric-600 text-white font-bold text-[10px] flex items-center justify-center">AM</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200 text-xs">${art.author}</span>
                </div>
                <span class="pt-4 font-mono text-[10px]">${art.readTime}</span>
            </div>
        `;
        grid.appendChild(card);
    });

    const loadMoreBtn = document.getElementById('blog-load-more-btn');
    if (loadMoreBtn) {
        if (visibleBlogArticlesCount >= filtered.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}

function filterBlogCategory(cat, btn) {
    activeBlogCategory = cat;
    visibleBlogArticlesCount = 3;

    document.querySelectorAll('.blog-cat-btn').forEach(b => {
        b.className = "blog-cat-btn px-4 py-2 rounded-full text-xs font-bold transition bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-electric-500";
    });

    if (btn) {
        btn.className = "blog-cat-btn px-4 py-2 rounded-full text-xs font-bold transition bg-electric-600 text-white shadow-md";
    }

    renderBlogArticles();
}

function searchBlogArticles() {
    const input = document.getElementById('blog-search-input');
    if (input) {
        blogSearchQuery = input.value;
        visibleBlogArticlesCount = 3;
        renderBlogArticles();
    }
}

function loadMoreBlogArticles() {
    visibleBlogArticlesCount += 3;
    renderBlogArticles();
}

function updateStudyEstimator() {
    const hoursInput = document.getElementById('study-hours');
    if (!hoursInput) return;
    const hours = parseInt(hoursInput.value, 10);
    document.getElementById('study-hours-label').textContent = `${hours} hora${hours > 1 ? 's' : ''} / semana`;

    const daysNeeded = Math.max(1, Math.round(12 / hours));
    document.getElementById('study-result-days').textContent = `${daysNeeded} día${daysNeeded > 1 ? 's' : ''}`;
}

function openBlogModal(id) {
    const modal = document.getElementById('blog-article-modal');
    const content = document.getElementById('blog-modal-content');
    if (!modal || !content) return;

    if (id === 'featured') {
        const featured = blogDatabase.find(a => a.id === 'caso-exito-ecommerce');
        content.innerHTML = featured ? featured.content : '<p>Cargando artículo...</p>';
    } else {
        const item = blogDatabase.find(a => a.id === id);
        content.innerHTML = item ? item.content : '<p>Cargando artículo...</p>';
    }

    modal.classList.remove('hidden');
}

function closeBlogModal() {
    const modal = document.getElementById('blog-article-modal');
    if (modal) modal.classList.add('hidden');
}


// =========================================================================
// 11. REVEAL EN SCROLL (INTERSECTION OBSERVER)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.glass-panel, section h2, section h1');

    elementsToAnimate.forEach(el => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elementsToAnimate.forEach(el => observer.observe(el));

    initLiveSalesNotification();
});


// =========================================================================
// 12. NOTIFICACIONES VIVAS SIMULADAS (LIVE FEED)
// =========================================================================
function initLiveSalesNotification() {
    const liveBadge = document.querySelector('.animate-float');
    if (!liveBadge) return;

    const salesData = [
        { amount: '$1,450 USD', time: 'Hace 2 minutos', type: 'Venta cerrada automáticamente' },
        { amount: '$3,200 USD', time: 'Hace 5 minutos', type: 'Lead calificado agendado' },
        { amount: '$890 USD', time: 'Hace 8 minutos', type: 'Suscripción activada' },
        { amount: '$2,100 USD', time: 'Hace 12 minutos', type: 'Contrato firmado por IA' }
    ];

    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % salesData.length;
        const current = salesData[currentIndex];

        liveBadge.style.opacity = '0';
        liveBadge.style.transform = 'translateY(10px) scale(0.95)';

        setTimeout(() => {
            const typeText = liveBadge.querySelector('p.text-xs');
            if (typeText) typeText.textContent = current.type;

            const timeContainer = liveBadge.querySelector('p.text-[10px]');
            if (timeContainer) {
                timeContainer.innerHTML = `${current.time} • <span class="font-bold text-growth-600 dark:text-growth-400">${current.amount}</span>`;
            }

            liveBadge.style.opacity = '1';
            liveBadge.style.transform = 'translateY(0) scale(1)';
        }, 300);

    }, 6000);
}


// =========================================================================
// 13. EFECTO 3D TILT AL MOVER EL MOUSE SOBRE LAS CARDS
// =========================================================================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    });
});


// =========================================================================
// 14. CONTADORES ANIMADOS (INCREMENTO NUMÉRICO PROGRESIVO)
// =========================================================================
function animateCounter(id, start, end, duration, prefix = '', suffix = '') {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `${prefix}${value.toLocaleString()}${suffix}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

window.addEventListener('load', () => {
    setTimeout(() => {
        animateCounter('hero-sales-counter', 100000, 124850, 2000, '$');
        animateCounter('hero-leads-counter', 800, 1237, 2200);
    }, 500);
});