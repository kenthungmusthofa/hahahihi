const output = document.querySelector("#output");
const consolePanel = document.querySelector("#console");
const againPanel = document.querySelector("#again");
const closingNote = document.querySelector("#closingNote");
const terminalPrompt = document.querySelector("#terminalPrompt");
const promptText = document.querySelector("#promptText");
const choiceCards = [...document.querySelectorAll("[data-choice]")];
const againBtn = document.querySelector("#againBtn");
const skipBtn = document.querySelector("#skipBtn");
const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");
const music = document.querySelector("#backgroundMusic");
const resultIndex = document.querySelector("#resultIndex");

const roasts = {
  i: [
    "Cok! Kon iku pancen rajelas, matamu picek opo piye ra iso ngerti sitik?",
    "Utekmu diseleh ngendi su? Uwong kok ben dino enenge meng ruwet!",
    "Mbok yo sadar awake cok, wis ra ditanggapi kok gatel nggoleki terus.",
    "Isine bendino mung ngenes karo diloroni, utekmu nggo opo jancok!",
    "Raimu iku gak ono regane blas opo piye, dikecewakno kok seneng, pekok!",
    "Ratau mikir gaweane mung nangis, pancen bajingan rai gedheg kon iku.",
    "Jan jancok tenan, uwong kok ra duwe utek, dipakani harapan terus gelem."
  ],
  o: [
    "Oooo dancok! Iki ta seng sok-sokan dadi korban, raimu kebek drama bajingan!",
    "Rasakno iku su! Sopo konkon bendino mangan harapan palsu, pekok yo pekok!",
    "Sepisan-pisan sadar raimu cok, kon iku mung dadi panggonan sampah emosi!",
    "Dancok tenan, dhasar utek urang, disepaki ping wolulas yo panggah nggoleki!",
    "Hahaha bajingan! Kon pikir dheke peduli karo raimu? Matamu kuwi bukak!",
    "Goblok kok diingu, mending ngingu wedhus iso dipakani, raimu mung rugi tak omongi!",
    "Raimu mung dinggo pelampiasan tok cok, kok jik iso-isone bangga, jan asu!"
  ],
  l: [
    "Suuu... opo kabar cok? Lambemu mek macak kemenyek tapi rasane koyo taek!",
    "Tiwas mok pamerke neng ngendi - ngendi, jebul raimu mung dadi badut pasar malam hahahah!",
    "Seng mbayari raimu dadi badut ki sopo su? Dibayar ati remuk yo gelem, pekok!",
    "Lambene muni 'seng penting dheke bahagia', bahagia ndasmu kuwi jancok! Raimu remok cangkeme panggah sok, ancok!",
    "Gak usah kakehan cangkem su, rai badut koyo kon iku wis gak ono ajine!",
    "Ndasmu kuwi isine opo cok? Tiwas berjuang mati-matian, moso ditinggal malah koyo wong ragenah!",
    "Rai ora sepiro, polahe koyo paling menderita sak dunyo, jan asu tenan kon iku!"
  ]
};
let runToken = 0;
let typing = false;
let skipRequested = false;
let selected = "";
let caseNumber = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setPrompt(text) {
  promptText.textContent = text;
}

async function showLines(choice) {
  const token = ++runToken;
  selected = choice;
  typing = true;
  skipRequested = false;
  caseNumber += 1;
  resultIndex.textContent = `CASE_${String(caseNumber).padStart(3, "0")}`;
  output.replaceChildren();
  consolePanel.classList.remove("hidden");
  againPanel.classList.add("hidden");
  terminalPrompt.classList.add("hidden");
  choiceCards.forEach(card => card.disabled = true);
  setPrompt("Sedang memproses keputusan burukmu...");
  consolePanel.scrollIntoView({ behavior: "smooth", block: "start" });

  const lines = roasts[choice] || ["Pilihanmu ora ono, mbut. Teliti maneh."];
  for (const line of lines) {
    if (token !== runToken) return;
    const node = document.createElement("span");
    node.className = "line";
    output.appendChild(node);
    if (skipRequested) {
      node.textContent = line;
      continue;
    }
    for (const char of line) {
      if (token !== runToken) return;
      if (skipRequested) {
        node.textContent = line;
        break;
      }
      node.textContent += char;
      await sleep(100);
    }
    await sleep(skipRequested ? 0 : 280);
  }

  if (token !== runToken) return;
  typing = false;
  choiceCards.forEach(card => card.disabled = false);
  skipBtn.disabled = false;
  skipBtn.textContent = "SKIP ANIMASI ↗";
  againPanel.classList.remove("hidden");
  // Tampilkan pesan penutup
  closingNote.classList.remove("hidden");
  setPrompt("Diagnosis selesai. Pasien masih bisa menyangkal.");
  againPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

choiceCards.forEach(card => {
  card.addEventListener("click", () => showLines(card.dataset.choice));
});

skipBtn.addEventListener("click", () => {
  if (!typing) return;

  skipRequested = true;
  skipBtn.textContent = "MENYELESAIKAN...";
});

againBtn.addEventListener("click", () => {
  runToken++;
  typing = false;
  skipRequested = false;
  output.replaceChildren();
  consolePanel.classList.add("hidden");
  againPanel.classList.add("hidden");

// Sembunyikan pesan penutup saat kembali ke menu
  closingNote.classList.add("hidden");

  terminalPrompt.classList.remove("hidden");
  setPrompt("Sistem menunggu keputusanmu...");
  window.scrollTo({ top: 0, behavior: "smooth" });
  skipBtn.textContent = "SKIP ANIMASI ↗";
});

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "MUSIC ON";
    } catch (error) {
      musicLabel.textContent = "CEK FILE MP3";
      setPrompt("Pastikan backsound.mp3 ada satu folder dengan index.html, lalu coba lagi.");
    }
  } else {
    music.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "MUSIC OFF";
  }
});

function updateClock() {
  document.querySelector("#clock").textContent = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 1000);


async function startBackgroundMusic() {
  try {
    await music.play();

    musicToggle.setAttribute("aria-pressed", "true");
    musicLabel.textContent = "MUSIC ON";
    setPrompt("Backsound aktif. Sistem siap menerima keputusanmu.");

    return true;
  } catch (error) {
    musicLabel.textContent = "TAP UNTUK MUSIK";
    return false;
  }
}

// Coba nyalakan musik saat halaman dibuka.
window.addEventListener("load", async () => {
  const playing = await startBackgroundMusic();

  // Jika autoplay diblokir, coba lagi pada interaksi pertama.
  if (!playing) {
    const startOnInteraction = async (event) => {
      // Jangan bentrok dengan tombol musik manual.
      if (event.target.closest("#musicToggle")) return;

      const success = await startBackgroundMusic();

      if (success) {
        document.removeEventListener("pointerdown", startOnInteraction);
        document.removeEventListener("keydown", startOnInteraction);
      }
    };

    document.addEventListener("pointerdown", startOnInteraction);
    document.addEventListener("keydown", startOnInteraction);
  }
});
