/* Monique Milano — v2 (24/11/2026).
   Tratamentos = destaques do Instagram dela (@momilano.estetica).
   Número de agendamento = link da bio (bit.ly/WhatsMoniqueMilano). */
const WHATS = "5548999592658";
const MSG = "Oi, Monique! Vi o seu site e queria agendar um horário.";

const GRUPOS = [
  {
    nome: "Rosto e olhar",
    itens: [
      { nome: "Limpeza de pele", desc: "Tira cravos e impurezas e deixa a pele leve e pronta para os outros cuidados.", obj: ["pele"] },
      { nome: "Sobrancelhas", desc: "Design pensado para o formato do seu rosto.", obj: ["olhar"] },
      { nome: "Cílios", desc: "Para o olhar ficar marcado no dia a dia.", obj: ["olhar"] }
    ]
  },
  {
    nome: "Corpo",
    itens: [
      { nome: "Lipodetox", desc: "Protocolo corporal para medidas e retenção de líquido.", obj: ["corpo"] },
      { nome: "Massagem modeladora", desc: "Movimentos firmes que trabalham o contorno do corpo.", obj: ["corpo"] },
      { nome: "Glúteos", desc: "Tratamento para firmeza e contorno dos glúteos.", obj: ["corpo"] }
    ]
  },
  {
    nome: "Bem-estar",
    itens: [
      { nome: "Massagem relaxante", desc: "Um tempo só seu para soltar a tensão e desacelerar.", obj: ["relaxar"] },
      { nome: "Terapias holísticas", desc: "Terapias alternativas para equilibrar corpo e mente.", obj: ["relaxar"] }
    ]
  }
];

const OBJETIVOS = [
  { id: "pele", rotulo: "A pele do rosto" },
  { id: "olhar", rotulo: "Sobrancelhas e cílios" },
  { id: "corpo", rotulo: "Medidas e contorno" },
  { id: "relaxar", rotulo: "Relaxar e me equilibrar" }
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const linkWhats = (texto) => "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(texto);
const lista = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(", ") + " e " + arr.at(-1) : arr[0]);

for (const a of document.querySelectorAll("[data-whats]")) {
  a.href = linkWhats(MSG);
  a.target = "_blank";
  a.rel = "noopener";
}

/* lista de tratamentos */
document.getElementById("grupos").innerHTML = GRUPOS.map((g) =>
  '<div class="grupo"><h3>' + esc(g.nome) + '</h3><ul class="grupo-lista">' +
  g.itens.map((t) =>
    '<li><span class="trat-nome">' + esc(t.nome) + '</span><span class="trat-desc">' + esc(t.desc) + "</span>" +
    '<a class="trat-agendar" target="_blank" rel="noopener" href="' +
    linkWhats("Oi, Monique! Vi o seu site e queria agendar " + t.nome.toLowerCase() + ".") +
    '" aria-label="Agendar ' + esc(t.nome) + '">Agendar</a></li>').join("") +
  "</ul></div>").join("");

/* objetivo -> tratamentos -> mensagem */
const todos = GRUPOS.flatMap((g) => g.itens);
const escolhidos = new Set();
const ul = document.getElementById("objetivos");
const resposta = document.getElementById("resposta");

function responder() {
  if (!escolhidos.size) {
    resposta.innerHTML = '<p class="resposta-vazia">Toque no que você quer cuidar e veja aqui os tratamentos que combinam.</p>';
    return;
  }
  const recs = todos.filter((t) => t.obj.some((o) => escolhidos.has(o)));
  const nomes = OBJETIVOS.filter((o) => escolhidos.has(o.id)).map((o) => o.rotulo.toLowerCase());
  const msg = "Oi, Monique! Vi o seu site. Quero cuidar de: " + lista(nomes) +
    ". Pode me ajudar a escolher o tratamento e ver um horário?";
  resposta.innerHTML = '<div class="resposta"><h3>Combinam com você</h3><ul>' +
    recs.map((t) => "<li><strong>" + esc(t.nome) + "</strong><span>" + esc(t.desc) + "</span></li>").join("") +
    '</ul><a class="botao botao-claro" target="_blank" rel="noopener" href="' + linkWhats(msg) + '">Enviar para a Monique</a></div>';
}

for (const o of OBJETIVOS) {
  const li = document.createElement("li");
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = o.rotulo;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => {
    escolhidos.has(o.id) ? escolhidos.delete(o.id) : escolhidos.add(o.id);
    b.setAttribute("aria-pressed", String(escolhidos.has(o.id)));
    responder();
  });
  li.appendChild(b);
  ul.appendChild(li);
}
responder();

/* sombra no topo depois de rolar */
const topo = document.querySelector(".topo");
const marcar = () => topo.classList.toggle("rolou", scrollY > 8);
addEventListener("scroll", marcar, { passive: true });
marcar();
