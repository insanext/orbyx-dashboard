export default async function AppointmentsPage() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
  const calendarId = "2a751047-c4de-4c67-9336-c38c7d599fe6";

  const res = await fetch(`${backend}/appointments?calendar_id=${calendarId}`, { cache: "no-store" });
  const data = await res.json();

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Citas</h1>
      <p>Total: {data.total}</p>

      <ul>
        {(data.appointments || []).map((a) => (
          <li key={a.id} style={{ marginBottom: 12, border: "1px solid #333", padding: 12 }}>
            <b>{a.customer_name}</b> — {a.customer_phone}
            <br />
            {a.start_at} → {a.end_at}
            <br />
            Estado: <b>{a.status}</b>
            <br />
            {a.status !== "canceled" && (
              <form action={`${backend}/appointments/${a.id}`} method="post">
                <input type="hidden" name="_method" value="DELETE" />
                <button style={{ marginTop: 10, padding: "6px 12px" }}>
                  Cancelar
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
