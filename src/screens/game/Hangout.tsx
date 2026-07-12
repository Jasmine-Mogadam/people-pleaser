import { Button } from "@/components/ui/button";
import store from "@/state/store";

function Hangout() {
  const {
    inventory,
    friends,
    money,
    house,
    discoveredHangouts,
    playerCharacter,
  } = store.getState();

  return (
    <>
      <div className="aheader">
        <div className="date">Date WIP</div>
        <div className="money">{money}</div>
        <div className="friends">
          {friends.filter((f) => f.friendshipLevel > 0.5).length}
        </div>
        <div className="actions">Actions Left WIP</div>
        <Button>Next Week</Button>
      </div>
    </>
  );
}

export default Hangout;
