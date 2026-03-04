"use client";

import { useEffect, useState } from "react";

const CALENDAR_ID = "2a751047-c4de-4c67-9336-c38c7d599fe6";

export default function AppointmentsPage() {
  // ✅ Fallback si Vercel no tiene la env var
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://orbyx-backend.onrender.com";

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${backend}/appointments?calendar_id=${CALENDAR_ID}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setItems(data.appointments || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    if (!confirm("¿Seguro que quieres cancelar esta cita?")) return;

    try {
      setError("");

      const res = await fetch(`${backend}/appointments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Citas</h1>

      {/* ✅ Debug: muestra qué backend está usando */}
      <p style={{ fontSize: 12, opacity: 0.7, marginTop: -8 }}>
        Backend: {backend}
      </p>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {!loading && (
        <>
          <p>Total: {items.length}</p>

          <ul style={{ padding: 0, listStyle: "none" }}>
            {items.map((a) => (
              <li
                key={a.id}
                style={{ marginBottom: 12, border: "1px solid #333", padding: 12 }}
              >
                <b>{a.customer_name}</b> — {a.customer_phone}
                <br />
                {a.start_at} → {a.end_at}
                <br />
                Estado: <b>{a.status}</b>
                <br />

                {a.status !== "canceled" && (
                  <button
                    type="button" // ✅ evita submits accidentales
                    onClick={() => cancelAppointment(a.id)}
                    style={{ marginTop: 10, padding: "6px 12px", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
