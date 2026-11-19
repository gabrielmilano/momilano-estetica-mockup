/* Mo Milano Estética — v1.
   WHATS: número de agendamento com 55 + DDD (ex.: "5548999999999"). Vazio = a confirmar:
   o WhatsApp abre para escolher o contato, com a mensagem já escrita. */
const WHATS = "";

/* LISTA PROVISÓRIA: trocar pela lista real da Monique (nome, para que serve, duração).
   "obj" liga cada tratamento aos objetivos da seção "O que você quer melhorar?". */
const GRUPOS = [
  {
    nome: "Facial",
    itens: [
      { nome: "Limpeza de pele", desc: "Remove impurezas e cravos e prepara a pele para os outros cuidados.", obj: ["textura", "acne"] },
      { nome: "Peeling", desc: "Renova a camada superficial e uniformiza o tom da pele.", obj: ["manchas", "textura", "firmeza"] },
      { nome: "Microagulhamento", desc: "Estimula colágeno para textura, marcas de acne e linhas finas.", obj: ["acne", "firmeza", "manchas"] },
      { nome: "Hidratação facial", desc: "Devolve conforto e viço para peles opacas ou desidratadas.", obj: ["textura", "firmeza"] }
    ]
  },
  {
    nome: "Corporal",
    itens: [
      { nome: "Drenagem linfática", desc: "Ajuda a reduzir o inchaço e a sensação de peso.", obj: ["corpo", "relaxar"] },
      { nome: "Massagem modeladora", desc: "Trabalha o contorno corporal junto com rotina e alimentação.", obj: ["corpo"] },
      { nome: "Massagem relaxante", desc: "Um tempo para desacelerar e aliviar a tensão.", obj: ["relaxar"] }
    ]
  }
];

const OBJETIVOS = [
  { id: "textura", rotulo: "Textura e viço da pele" },
  { id: "acne", rotulo: "Acne e cravos" },
  { id: "manchas", rotulo: "Manchas" },
  { id: "firmeza", rotulo: "Linhas e firmeza" },
  { id: "corpo", rotulo: "Contorno corporal" },
  { id: "relaxar", rotulo: "Relaxar" }
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const linkWhats = (texto) => (WHATS ? "https://wa.me/" + WHATS : "https://wa.me/") + "?text=" + encodeURIComponent(texto);
const MSG = "Oi, Monique! Vi o site da Mo Milano e queria agendar uma avaliação.";

/* botões gerais de agendamento */
for (const a of document.querySelectorAll("[data-whats]")) {
  a.href = linkWhats(MSG);
  a.target = "_blank";
  a.rel = "noopener";
}

/* lista de tratamentos */
const grupos = document.getElementById("grupos");
grupos.innerHTML = GRUPOS.map((g) =>
  '<div class="grupo"><h3>' + esc(g.nome) + '</h3><ul class="grupo-lista">' +
  g.itens.map((t) =>
    '<li><span class="trat-nome">' + esc(t.nome) + '</span><span class="trat-desc">' + esc(t.desc) + "</span>" +
    '<a class="trat-agendar" target="_blank" rel="noopener" href="' +
    linkWhats("Oi, Monique! Vi o site da Mo Milano e queria agendar uma avaliação para " + t.nome.toLowerCase() + ".") +
    '">Agendar</a></li>').join("") +
  "</ul></div>").join("");

/* objetivo -> tratamentos -> mensagem */
const todos = GRUPOS.flatMap((g) => g.itens);
const escolhidos = new Set();
const lista = document.getElementById("objetivos");
const resposta = document.getElementById("resposta");

function responder() {
  if (!escolhidos.size) {
    resposta.innerHTML = '<p class="resposta-vazia">Escolha ao lado o que você quer melhorar e veja os tratamentos que combinam.</p>';
    return;
  }
  const recs = todos.filter((t) => t.obj.some((o) => escolhidos.has(o)));
  const nomes = OBJETIVOS.filter((o) => escolhidos.has(o.id)).map((o) => o.rotulo.toLowerCase());
  const msg = "Oi, Monique! Vi o site da Mo Milano. Quero melhorar: " + nomes.join(", ") +
    ". Queria agendar uma avaliação para saber o tratamento ideal pra mim.";
  resposta.innerHTML = '<div class="resposta"><h3>Tratamentos que combinam</h3><ul>' +
    recs.map((t) => "<li><strong>" + esc(t.nome) + "</strong><span>" + esc(t.desc) + "</span></li>").join("") +
    '</ul><a class="botao" target="_blank" rel="noopener" href="' + linkWhats(msg) + '">Agendar avaliação com esse objetivo</a></div>';
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
  lista.appendChild(li);
}
responder();
