import { ArrowUpRightIcon } from "lucide-react";
import type { Friend } from "../../../objects/friend";
import type { Preference } from "../../../objects/preference";
import { Badge } from "../badge";

function PreferenceList({ preferences }: { preferences: Preference[] }) {
  return (
    <>
      {preferences.map((p) => (
        <td key={p.value.name}>
          <img src={p.value.name} />
          <p>{p.value.name}</p>
        </td>
      ))}
    </>
  );
}

function FriendDetail({ friend }: { friend: Friend }) {
  return (
    <>
      <div>
        <div className="flex">
          <img src={friend.image} className="h-100 mb-5" />
          <div className="grid mt-0">
            <h1>{friend.name}</h1>
            <a href={friend.ownerUrl} target="_blank">
              owned by{" "}
              <u>
                {friend.owner}
                <ArrowUpRightIcon />
              </u>
            </a>
            <Badge>{friend.personality}</Badge>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Likes</th>
              <th>Dislikes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <PreferenceList preferences={friend.getLikes()} />
            </tr>
            <tr>
              <PreferenceList preferences={friend.getDislikes()} />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export default FriendDetail;
