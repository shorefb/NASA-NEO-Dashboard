export type NeoItem = {
  id: string;
  name: string;
  sizeMeters: number;
  missDistanceKm: number;
  relativeVelocityKps: number;
};

export type NeoResponse = {
  date: string;
  objects: NeoItem[];
};

export async function fetchNeo(
  date: string,
  signal?: AbortSignal
): Promise<NeoResponse> {
  const res = await fetch(`/api/neo?date=${encodeURIComponent(date)}`, {
    signal,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch NEOs: ${res.status} ${text}`);
  }
  return (await res.json()) as NeoResponse;
}
