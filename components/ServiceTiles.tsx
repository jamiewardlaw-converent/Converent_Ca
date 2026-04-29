import type { ServiceTile } from "../lib/serviceTiles";

type ServiceTilesProps = {
  tiles: readonly ServiceTile[];
  linkMode?: "anchor" | "none";
};

export default function ServiceTiles({ tiles, linkMode = "anchor" }: ServiceTilesProps) {
  return (
    <div className="serviceTilesGrid" role="list">
      {tiles.map((tile) => {
        const card = (
          <>
            <div className="serviceTileFigure" aria-hidden>
              {tile.logoSrc ? (
                <img
                  src={tile.logoSrc}
                  alt=""
                  className="serviceTileLogoImg"
                  width={160}
                  height={160}
                  decoding="async"
                />
              ) : null}
            </div>
            <h3>{tile.title}</h3>
          </>
        );

        if (linkMode === "none") {
          return (
            <div key={tile.title} className="serviceTile card" role="listitem">
              {card}
            </div>
          );
        }

        return (
          <a
            key={tile.title}
            href={`${tile.href}#${tile.anchor}`}
            className="serviceTile card"
            role="listitem"
          >
            {card}
          </a>
        );
      })}
    </div>
  );
}
