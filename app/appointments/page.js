async function getAppointments() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
  const calendarId = "2a751047-c4de-4c67-9336-c38c7d599fe6";

  const url = `${backend}/appointments?calendar_id=${calendarId}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}

export default async function AppointmentsPage() {
  const data = await getAppointments();

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Citas</h1>
      <p>Total: {data.total}</p>

      <ul>
        {(data.appointments || []).map((a) => (
          <li key={a.id} style={{ marginBottom: 12 }}>
            <b>{a.customer_name}</b> — {a.customer_phone}
            <br />
            {a.start_at} → {a.end_at}
            <br />
            Estado: {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
