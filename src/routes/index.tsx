import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Game } from "@/components/game/Game";

const TITLE = "Quiz Game — Gonet Geneva Open";
const DESCRIPTION =
  "7 questions, 10 secondes chacune : testez vos connaissances sur le Gonet Geneva Open, ATP 250 sur terre battue au Parc des Eaux-Vives à Genève.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="court-clay min-h-dvh" />}>
      <Game />
    </ClientOnly>
  );
}
