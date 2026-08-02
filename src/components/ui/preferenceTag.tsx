import { PreferenceLabel } from "@/game/preferences";
import type { PreferenceType } from "@/objects/preference";

/**
 * A known opinion, as a word rather than a colour alone -- the outline it sits
 * on is tinted to match, and colour on its own would say nothing to anybody who
 * cannot separate the four of them.
 *
 * The `data-preference` attribute belongs on whatever is being tinted (the row
 * or the thumbnail); it carries the colour down to both the border and this tag.
 */
function PreferenceTag({
  preference,
  who,
}: {
  preference: PreferenceType;
  /** Whose opinion it is, when more than one person could be having it. */
  who?: string;
}) {
  return (
    <span className="prefTag" data-preference={preference}>
      {who ? `${who} ${PreferenceLabel[preference]}` : PreferenceLabel[preference]}
    </span>
  );
}

export default PreferenceTag;
