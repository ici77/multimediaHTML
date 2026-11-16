const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function imageCode() {
  const img = $("#demoImage"),
    w = $("#imageWidth").value,
    alt = $("#imageAlt").value,
    h = Math.round((w * img.naturalHeight) / img.naturalWidth) || 280;
  $("#widthOut").textContent = w;
  img.style.width = w + "px";
  img.classList.toggle("border", $("#imageBorder").checked);
  img.style.outline = $("#imageBorder").checked ? "3px solid #a65235" : "none";
  img.alt = alt;
  $("#imageCode").textContent =
    `<figure>\n  <img src="assets/images/paisaje.jpg"\n       alt="${esc(alt)}" width="${w}" height="${h}">\n  <figcaption>Paisaje de montaña junto a un lago.</figcaption>\n</figure>`;
}
["imageWidth", "imageBorder", "imageAlt"].forEach((id) =>
  $("#" + id).addEventListener("input", imageCode),
);
$("#demoImage").addEventListener("load", imageCode);
imageCode();
function placeholder() {
  let w = $("#phWidth").value || 640,
    h = $("#phHeight").value || 360,
    t = $("#phText").value || "Imagen";
  let u = `https://placehold.co/${w}x${h}?text=${encodeURIComponent(t)}`;
  $("#phUrl").textContent = u;
  $("#phCode").textContent = `<img src="${u}" alt="${esc(t)}" width="${w}" height="${h}">`;
  const preview = $("#phPreview");
  if (preview) {
    preview.src = u;
    preview.alt = t;
    preview.width = Number(w);
    preview.height = Number(h);
  }
}
["phWidth", "phHeight", "phText"].forEach((id) =>
  $("#" + id).addEventListener("input", placeholder),
);
placeholder();
document.querySelectorAll("[data-copy]").forEach(
  (b) =>
    (b.onclick = async () => {
      try {
        await navigator.clipboard.writeText(
          $("#" + b.dataset.copy).textContent,
        );
        $("#toast").textContent = "Código copiado";
        $("#toast").classList.add("show");
        setTimeout(() => $("#toast").classList.remove("show"), 1600);
      } catch {
        $("#toast").textContent = "Selecciona el código para copiarlo";
        $("#toast").classList.add("show");
      }
    }),
);
document.querySelectorAll(".mini").forEach((box) =>
  box.querySelectorAll("button").forEach(
    (b) =>
      (b.onclick = () => {
        if (!b.dataset.answer) return;
        let ok = b.dataset.answer === "yes";
        box.querySelector("p").textContent = ok
          ? "Correcto. Es la elección más adecuada para ese uso."
          : "Revisa las propiedades del formato y vuelve a intentarlo.";
        box.querySelector("p").style.color = ok ? "#17653c" : "#9b3326";
      }),
  ),
);
document.querySelectorAll("[data-route]").forEach((button) => {
  button.onclick = () => {
    const feedback = button.closest(".mini").querySelector("p");
    const ok = button.dataset.route === "yes";
    feedback.textContent = ok
      ? "Correcto: index.html ve la carpeta imagenes como una subcarpeta."
      : "No. Desde index.html no necesitas subir con ../; la imagen está dentro de imagenes/.";
    feedback.className = `answer-feedback ${ok ? "ok" : "no"}`;
  };
});
function localFile(input, player) {
  let objectUrl;
  input.onchange = () => {
    let f = input.files[0];
    if (f) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(f);
      player.src = objectUrl;
      player.load();
    }
  };
  player.addEventListener("emptied", () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  });
}
localFile($("#audioFile"), $("#audioPlayer"));
localFile($("#videoFile"), $("#videoPlayer"));
function youtubeId(value) {
  try {
    let u = new URL(value);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be")
      return u.pathname.slice(1).match(/^[\w-]{11}$/)?.[0];
    if (["youtube.com", "m.youtube.com", "music.youtube.com"].includes(host))
      return (
        u.searchParams.get("v") ||
        u.pathname.split("/").filter(Boolean).pop() ||
        ""
      ).match(/^[\w-]{11}$/)?.[0];
  } catch {}
  return null;
}
$("#ytGenerate").onclick = () => {
  let id = youtubeId($("#ytUrl").value),
    f = $("#ytFeedback");
  if (!id) {
    f.textContent = "Escribe una URL de YouTube compatible.";
    return;
  }
  f.textContent =
    "Vídeo validado. Revisa siempre el contenido y su privacidad.";
  $("#ytPreview").innerHTML = "";
  let i = document.createElement("iframe");
  i.src = "https://www.youtube-nocookie.com/embed/" + id;
  i.title = "Vídeo de YouTube";
  i.allowFullscreen = true;
  $("#ytPreview").append(i);
  $("#ytCode").textContent =
    `<div class="video-responsive">\n  <iframe src="https://www.youtube-nocookie.com/embed/${id}"\n    title="Vídeo de YouTube" allowfullscreen></iframe>\n</div>`;
};
const qs = [
  [
    "¿Qué atributo ofrece una alternativa textual a una imagen?",
    "alt",
    "El atributo alt describe la función o contenido de la imagen.",
    ["src", "alt", "width"],
  ],
  [
    "¿Qué evita cargar imágenes lejanas hasta que hagan falta?",
    'loading="lazy"',
    "Lazy loading aplaza imágenes fuera de pantalla.",
    ["autoplay", 'loading="lazy"', "loop"],
  ],
  [
    "¿Qué formato es apropiado para un logotipo escalable?",
    "SVG",
    "SVG conserva la nitidez al escalar.",
    ["JPEG", "SVG", "GIF"],
  ],
  [
    "¿Qué etiqueta inserta audio propio?",
    "audio",
    "audio es el elemento semántico para sonido.",
    ["sound", "audio", "iframe"],
  ],
  [
    "¿Qué no debes activar normalmente en audio?",
    "autoplay",
    "La reproducción automática puede molestar y suele bloquearse.",
    ["controls", "autoplay", "preload"],
  ],
  [
    "¿Qué archivo prepara subtítulos en vídeo?",
    "WebVTT",
    "track apunta a un archivo de subtítulos WebVTT.",
    ["PDF", "WebVTT", "CSS"],
  ],
  [
    "¿Qué elemento es válido para YouTube en HTML5?",
    "iframe",
    "iframe sigue siendo válido; frame y frameset son obsoletos.",
    ["frameset", "iframe", "embed"],
  ],
  [
    "¿Qué reduce el peso, no las dimensiones visuales?",
    "La optimización del archivo",
    "Cambiar width no comprime el archivo original.",
    ["width", "La optimización del archivo", "alt"],
  ],
];
function quiz() {
  let area = $("#quizArea");
  area.innerHTML = "";
  let score = 0;
  qs.forEach((q, n) => {
    let d = document.createElement("div");
    d.className = "question";
    d.innerHTML = `<h4>${n + 1}. ${q[0]}</h4>`;
    q[3].forEach((a) => {
      let b = document.createElement("button");
      b.textContent = a;
      b.onclick = () => {
        if (d.dataset.done) return;
        d.dataset.done = 1;
        let ok = a === q[1];
        if (ok) score++;
        d.querySelectorAll("button").forEach((x) => {
          x.disabled = true;
          if (x.textContent === q[1]) x.classList.add("correct");
          else if (x === b) x.classList.add("incorrect");
        });
        let p = document.createElement("p");
        p.className = "explanation";
        p.textContent = (ok ? "Correcto. " : "No exactamente. ") + q[2];
        d.append(p);
        $("#score").textContent = `${score} / ${qs.length}`;
      };
      d.append(b);
    });
    area.append(d);
  });
}
$("#restart").onclick = quiz;
quiz();
