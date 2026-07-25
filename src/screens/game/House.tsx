import store from "@/state/store";

function House() {
  const { house } = store.getState();

  function placeRoommates() {
    let i = 0;
    return house.roomatePositions.map((pos) => {
      const friend = house.roomates[i];
      i++;
      return (
        <div key={i}>
          {friend && (
            <img
              src={friend.image}
              style={{ position: "absolute", left: pos.x, top: pos.y }}
            />
          )}
        </div>
      );
    });
  }

  return (
    <>
      <div className="scaleup">
        <div
          className="house"
          style={{ backgroundImage: `url(${house.image})` }}
        >
          {placeRoommates()}
        </div>
      </div>
    </>
  );
}

export default House;
