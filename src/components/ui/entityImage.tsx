/**
 * Draws art when it exists and a labelled placeholder when it does not, so
 * content can be added to the catalog before the art is drawn without leaving
 * broken image icons all over the screen.
 */
function EntityImage({
  src,
  name,
  className = "",
  size,
}: {
  src?: string;
  name: string;
  className?: string;
  size?: number | string;
}) {
  const style = size ? { width: size, height: size } : undefined;

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted text-center text-xs text-muted-foreground p-1 ${className}`}
        style={style}
        role="img"
        aria-label={`${name} (art not added yet)`}
        title={`${name} (art not added yet)`}
      >
        {name}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`object-contain ${className}`}
      style={style}
    />
  );
}

export default EntityImage;
