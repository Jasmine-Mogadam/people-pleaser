import store from "@/state/store";
import FriendSearch from "@/components/ui/friend/friendSearch";
import BackButton from "./BackButton";

function Contacts({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const { friends } = store.getState();

  return (
    <>
      <div className="screen">
        <div className="header">
          <BackButton setActiveScreen={setActiveScreen} /> Contacts
        </div>
        <FriendSearch friends={friends} />
      </div>
    </>
  );
}

export default Contacts;
