import { ImageOff, type LucideIcon } from "lucide-react";

/** Below this, a name label will not fit and is replaced by a marker icon. */
const LABEL_MIN_SIZE = 56;

/**
 * Draws art when it exists, the entity's icon when it has one, and a labelled
 * placeholder otherwise -- so content can go into the catalog before the art is
 * drawn without leaving broken image icons all over the screen.
 */
function EntityImage({
  src,
  name,
  icon: Icon,
  className = "",
  size,
}: {
  src?: string;
  name: string;
  icon?: LucideIcon;
  className?: string;
  size?: number | string;
}) {
  const style = size ? { width: size, height: size } : undefined;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`object-contain ${className}`}
        style={style}
      />
    );
  }

  if (Icon) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ${className}`}
        style={style}
        role="img"
        aria-label={name}
        title={name}
      >
        <Icon className="h-[60%] w-[60%]" />
      </span>
    );
  }

  // A name inside a 32px square just spills over whatever is next to it, so
  // small placeholders get a marker instead and keep the name in the tooltip.
  const roomForLabel = typeof size !== "number" || size >= LABEL_MIN_SIZE;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted p-1 text-center text-xs leading-tight text-muted-foreground ${className}`}
      style={style}
      role="img"
      aria-label={`${name} (art not added yet)`}
      title={`${name} (art not added yet)`}
    >
      {roomForLabel ? name : <ImageOff className="h-[55%] w-[55%]" />}
    </span>
  );
}

export default EntityImage;
