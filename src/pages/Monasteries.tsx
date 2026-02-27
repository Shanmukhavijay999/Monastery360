import { useEffect, useState } from "react";
import { fetchMonasteries } from "../lib/api";

export default function Monasteries() {
  const [monasteries, setMonasteries] = useState<any[]>([]);

  useEffect(() => {
    fetchMonasteries().then(setMonasteries);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Monasteries</h1>
      <ul>
        {monasteries.map((m) => (
          <li key={m._id}>{m.name} – {m.location}</li>
        ))}
      </ul>
    </div>
  );
}
