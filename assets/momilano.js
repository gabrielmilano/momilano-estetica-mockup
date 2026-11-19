/* Mo Milano Estética — prévia.
   WHATS: número de agendamento com 55 + DDD (ex.: "5548999999999"). Vazio = a confirmar:
   os botões abrem o WhatsApp para escolher o contato, com a mensagem já escrita. */
const WHATS = "";

/* TRATAMENTOS DE EXEMPLO: trocar pela lista real da Monique (nome, para que serve, duração).
   Cada um diz a quais objetivos atende. Nada de preço aqui. */
const TRATAMENTOS = [
  { nome: "Limpeza de pele", para: "Remove impurezas e cravos e deixa a pele pronta para os outros cuidados.", obj: ["pele", "acne"] },
  { nome: "Peeling", para: "Renova a camada superficial da pele, uniformiza o tom e suaviza manchas leves.", obj: ["pele", "manchas", "rejuvenescer"] },
  { nome: "Microagulhamento", para: "Estimula colágeno: textura, marcas de acne e linhas finas.", obj: ["acne", "rejuvenescer", "manchas"] },
  { nome: "Hidratação facial", para: "Devolve conforto e viço para peles opacas ou desidratadas.", obj: ["pele", "rejuvenescer"] },
  { nome: "Drenagem linfática", para: "Ajuda a reduzir o inchaço e a sensação de peso.", obj: ["corpo", "relaxar"] },
  { nome: "Massagem modeladora", para: "Trabalha o contorno corporal junto com rotina e alimentação.", obj: ["corpo"] },
  { nome: "Massagem relaxante", para: "Um tempo para desacelerar e aliviar a tensão do dia a dia.", obj: ["relaxar"] }
];

const OBJETIVOS = [
  { id: "pele", rotulo: "Pele mais bonita no dia a dia" },
  { id: "acne", rotulo: "Acne e cravos" },
  { id: "manchas", rotulo: "Manchas" },
  { id: "rejuvenescer", rotulo: "Rejuvenescer" },
  { id: "corpo", rotulo: "Contorno corporal" },
  { id: "relaxar", rotulo: "Relaxar" }
];

function linkWhats(texto) {
  const t = encodeURIComponent(texto);
  return WHATS ? "https://wa.me/" + WHATS + "?text=" + t : "https://wa.me/?text=" + t;
}

const MSG_PADRAO = "Oi, Monique! Vi o site da Mo Milano e queria agendar uma avaliação.";

/* Botões fixos de agendamento */
for (const a of document.querySelectorAll("[data-whats]")) {
  a.href = linkWhats(MSG_PADRAO);
  a.target = "_blank";
  a.rel = "noopener";
}

/* Assinatura: objetivo -> tratamentos -> mensagem pronta */
const escolhidos = new Set();
const chips = document.getElementById("chips");
const resultado = document.getElementById("resultado");

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function desenhar() {
  if (!escolhidos.size) {
    resultado.innerHTML = '<p class="resultado-vazio">Escolha um ou mais objetivos acima.</p>';
    return;
  }
  const lista = TRATAMENTOS.filter((t) => t.obj.some((o) => escolhidos.has(o)));
  const nomes = OBJETIVOS.filter((o) => escolhidos.has(o.id)).map((o) => o.rotulo.toLowerCase());
  const msg = "Oi, Monique! Vi o site da Mo Milano. Meu objetivo é: " + nomes.join(", ") +
    ". Queria agendar uma avaliação para saber qual tratamento é o ideal pra mim.";
  resultado.innerHTML =
    '<div class="tratamentos">' + lista.map((t) => '<article class="trat"><h3>' + esc(t.nome) + "</h3><p>" + esc(t.para) + "</p></article>").join("") + "</div>" +
    '<a class="botao botao-cheio" href="' + linkWhats(msg) + '" target="_blank" rel="noopener">Agendar avaliação com esse objetivo</a>';
}

for (const o of OBJETIVOS) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = o.rotulo;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => {
    escolhidos.has(o.id) ? escolhidos.delete(o.id) : escolhidos.add(o.id);
    b.setAttribute("aria-pressed", escolhidos.has(o.id) ? "true" : "false");
    desenhar();
  });
  chips.appendChild(b);
}
desenhar();

/* Entrada: título revelado palavra por palavra */
const titulo = document.querySelector("[data-palavras]");
if (titulo) {
  titulo.innerHTML = titulo.textContent.trim().split(/\s+/).map((p, i) =>
    '<span class="p" style="transition-delay:' + (i * 55) + 'ms">' + esc(p) + "</span>").join(" ");
  requestAnimationFrame(() => requestAnimationFrame(() => titulo.classList.add("on")));
}
