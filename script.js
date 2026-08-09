const songs = [
  {
    title: "After Dark",
    artist: "Chillshift",
    album: "Night Drive",
    file: "music/after-dark.mp3"
  },
  {
    title: "Lost Again",
    artist: "—",
    album: "Midnight",
    file: "music/lost-again.mp3"
  },
  {
    title: "Slow Motion",
    artist: "—",
    album: "After Hours",
    file: "music/slow-motion.mp3"
  },
  {
    title: "No Signal",
    artist: "—",
    album: "Offline",
    file: "music/no-signal.mp3"
  },
  {
    title: "Blue Lights",
    artist: "—",
    album: "City Nights",
    file: "music/blue-lights.mp3"
  }
];

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

const fmt = s =>
  isFinite(s)
    ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0")
    : "0:00";

function render() {
  let x = q.value.toLowerCase();

  tracks.innerHTML = songs
    .map((s, n) => ({ ...s, n }))
    .filter(s =>
      (s.title + s.artist + s.album)
        .toLowerCase()
        .includes(x)
    )
    .map(s => `
      <div class="track">
        <div class="cover">♪</div>
        <div>
          <b>${s.title}</b>
          <small>${s.artist} · ${s.album}</small>
        </div>
        <span class="time">—</span>
        <button onclick="load(${s.n}, true)">▶</button>
      </div>
    `)
    .join("");
}

function load(n, auto) {
  i = n;

  let s = songs[i];

  a.src = s.file;

  now.textContent = s.title;
  artist.textContent = s.artist + " · " + s.album;

  a.load();

  if (auto) {
    a.play().catch(() => {});
  }
}

function toggle() {
  if (i < 0) {
    load(0, true);
  } else {
    a.paused ? a.play() : a.pause();
  }
}

function next() {
  load((i + 1) % songs.length, true);
}

function prev() {
  load((i - 1 + songs.length) % songs.length, true);
}

a.onplay = () => {
  pp.textContent = "Ⅱ";
};

a.onpause = () => {
  pp.textContent = "▶";
};

a.onended = next;

a.ontimeupdate = () => {
  cur.textContent = fmt(a.currentTime);

  progress.value = a.duration
    ? (a.currentTime / a.duration) * 100
    : 0;
};

a.onloadedmetadata = () => {
  dur.textContent = fmt(a.duration);
};

progress.oninput = e => {
  if (a.duration) {
    a.currentTime = (e.target.value / 100) * a.duration;
  }
};

q.oninput = render;

render();
