import { LinkButton } from "./LinkButton";

interface EventDetailsProps {
  time: string;
  place: string;
  address: string;
  note?: string;
  mapUrl: string;
}

/** Shared time / place / address / map block for the ceremony & reception sections. */
export function EventDetails({ time, place, address, note, mapUrl }: EventDetailsProps) {
  return (
    <div className="mt-8 flex flex-col items-center text-center">
      <p className="font-display text-3xl text-wine">{time}</p>
      <p className="mt-3 font-body text-lg font-medium text-coffee">{place}</p>
      <p className="mt-1 font-body text-sm text-coffee/70">{address}</p>
      {note ? <p className="mt-4 max-w-md font-display text-xl italic text-coffee/80">{note}</p> : null}
      <LinkButton href={mapUrl} variant="outline" className="mt-7">
        Ver mapa
      </LinkButton>
    </div>
  );
}
