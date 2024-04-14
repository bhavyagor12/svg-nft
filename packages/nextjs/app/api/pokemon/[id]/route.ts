import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!params.id) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }
  const pokemonById = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  if (!pokemonById.ok) {
    return new NextResponse(JSON.stringify({ error: "Pokemon not found" }), { status: 404 });
  }
  const pokemon = await pokemonById.json();
  const baseUrl = process.env.vercel_url
    ? `https://${process.env.vercel_url}`
    : `http://localhost:${process.env.port || 3000}`;
  return new NextResponse(
    JSON.stringify({
      id: pokemon.id,
      description: pokemon.species.name,
      name: pokemon.name,
      external_url: `${baseUrl}/pokemon/${params.id}`,
      image: pokemon.sprites.front_default,
      attributes: pokemon.abilities.map(({ ability }: { ability: any }) => ability.name),
    }),
  );
}
