let songs = [];
let i = -1;

const a = document.querySelector("audio");
const tracks = document.querySelector("#tracks");
const q = document.querySelector("#search");
const pp = document.querySelector("#pp");
const progress = document.querySelector("#progress");

const now = document.querySelector("#now");
const artist = document.querySelector("#artist");
const cur = document.querySelector("#cur");
const dur = document.querySelector("#dur");

const fmt = (s) =>
  isFinite(s)
    ? Math.floor(s / 60) +
      ":" +
      String(Math.floor(s % 60)).padStart(2, "0")
    : "0:00";

/* Get songs from Supabase */
async function loadSongs() {
  const { data, error } = await supabaseClient
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    tracks.innerHTML = "<p>Unable to load songs.</p>";
    return;
  }

  songs = data || [];
  render();
}

/* Display songs */
function render() {
  const searchText = q.value.toLowerCase();

  tracks.innerHTML = songs
    .map((song, n) => ({ ...song, n }))
    .filter((song) =>
      (
        (song.title || "") +
        " " +
        (song.artist || "") +
        " " +
        (song.album || "")
      )
        .toLowerCase()
        .includes(searchText)
    )
    .map(
      (song) => `
        <div class="track">
          <div class="cover">♪</div>

          <div>
            <b>${song.title}</b>
            <small>
              ${song.artist || "Unknown"} ·
              ${song.album || "Unknown Album"}
            </small>
          </div>

          <span class="time">—</span>

          <button onclick="load(${song.n}, true)">
            ▶
          </button>
        </div>
      `
    )
    .join("");
}

/* Play song */
function load(n, auto = false) {
  if (!songs.length) return;

  i = n;

  const song = songs[i];

  a.src = song.file_url;

  now.textContent = song.title;

  artist.textContent =
    (song.artist || "Unknown") +
    " · " +
    (song.album || "Unknown Album");

  a.load();

  if (auto) {
    a.play().catch((error) => {
      console.log("Playback blocked:", error);
    });
  }
}

/* Play / Pause */
function toggle() {
  if (i < 0) {
    load(0, true);
    return;
  }

  if (a.paused) {
    a.play();
  } else {
    a.pause();
  }
}

/* Next */
function next() {
  if (!songs.length) return;

  load((i + 1) % songs.length, true);
}

/* Previous */
function prev() {
  if (!songs.length) return;

  load(
    (i - 1 + songs.length) % songs.length,
    true
  );
}

/* Player events */
a.onplay = () => {
  pp.textContent = "Ⅱ";
};

a.onpause = () => {
  pp.textContent = "▶";
};

a.onended = next;

/* Progress */
a.ontimeupdate = () => {
  cur.textContent = fmt(a.currentTime);

  progress.value = a.duration
    ? (a.currentTime / a.duration) * 100
    : 0;
};

/* Duration */
a.onloadedmetadata = () => {
  dur.textContent = fmt(a.duration);
};

/* Seek */
progress.oninput = (e) => {
  if (a.duration) {
    a.currentTime =
      (e.target.value / 100) * a.duration;
  }
};

/* Search */
q.oninput = render;

/* Start */
loadSongs();
