import type { Friend } from "../../../objects/friend";
import type { Preference } from "../../../objects/preference";

function PreferenceList({ preferences }: { preferences: Preference[] }) {
  return (
    <>
      <ul>
        {preferences.map((p) => (
          <li>
            <img src={p.value.name} />
            <p>{p.value.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

function FriendDetail({ friend }: { friend: Friend }) {
  return (
    <>
      <div>
        <img src={friend.image} />
        {friend.name} | {friend.personality} |{" "}
        <a href={friend.ownerUrl}>{friend.owner}</a>
        <div>
          <div>
            <h4>Likes</h4>
            <div>
              <PreferenceList preferences={friend.getLikes()} />
            </div>
          </div>
          <div>
            <h4>Dislikes</h4>
            <div>
              <PreferenceList preferences={friend.getDislikes()} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default FriendDetail;
