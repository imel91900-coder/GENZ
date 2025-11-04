import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDM81CBhg7UmqaKZ8ItPOMc9M_tDpHUwMQ",
  authDomain: "aieproject-1dcfc.firebaseapp.com",
  projectId: "aieproject-1dcfc",
  storageBucket: "aieproject-1dcfc.firebasestorage.app",
  messagingSenderId: "613258881021",
  appId: "1:613258881021:web:4cceba046076c6abfedb94",
  measurementId: "G-TKGQN6R69G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("🔥 Firebase siap digunakan!");

// === FORM INPUT ===
const form = document.getElementById("formInput");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idEdit = document.getElementById("idEdit").value;
    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const nilai = Number(document.getElementById("nilai").value.trim());

    if (!nama || !nim || !nilai) {
      alert("⚠️ Semua kolom wajib diisi!");
      return;
    }

    try {
      if (idEdit) {
        await updateDoc(doc(db, "nilaiMahasiswa", idEdit), { nama, nim, nilai });
        alert("✅ Data berhasil diperbarui!");
      } else {
        await addDoc(collection(db, "nilaiMahasiswa"), { nama, nim, nilai });
        alert("✅ Data berhasil disimpan!");
      }
      window.location.href = "tabel.html";
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Gagal menyimpan data.");
    }
  });
}

// === HALAMAN TABEL ===
const tbody = document.getElementById("dataBody");
if (tbody) {
  async function loadData() {
    tbody.innerHTML = "";
    const snapshot = await getDocs(collection(db, "nilaiMahasiswa"));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.nama}</td>
        <td>${data.nim}</td>
        <td>${data.nilai}</td>
        <td>
          <button class="edit" data-id="${docSnap.id}">Edit</button>
          <button class="hapus" data-id="${docSnap.id}">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".hapus").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Hapus data ini?")) {
          await deleteDoc(doc(db, "nilaiMahasiswa", id));
          loadData();
        }
      });
    });

    document.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const docSnap = await getDoc(doc(db, "nilaiMahasiswa", id));
        const data = docSnap.data();
        localStorage.setItem("editData", JSON.stringify({ id, ...data }));
        window.location.href = "form.html";
      });
    });
  }

  loadData();
}

// === BAWA DATA KE FORM UNTUK EDIT ===
const editData = localStorage.getItem("editData");
if (editData) {
  const { id, nama, nim, nilai } = JSON.parse(editData);
  document.getElementById("idEdit").value = id;
  document.getElementById("nama").value = nama;
  document.getElementById("nim").value = nim;
  document.getElementById("nilai").value = nilai;
  localStorage.removeItem("editData");
}
