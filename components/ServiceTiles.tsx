import type { ServiceTile } from "../lib/serviceTiles";

type ServiceTilesProps = {
  tiles: readonly ServiceTile[];
};

export default function ServiceTiles({ tiles }: ServiceTilesProps) {
  return (
    <div className="serviceTilesGrid" role="list">
      {tiles.map((tile) => (
        <a
          key={tile.title}
          href={`${tile.href}#${tile.anchor}`}
          className="serviceTile card"
          role="listitem"
        >
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
        </a>
      ))}
    </div>
  );
}
