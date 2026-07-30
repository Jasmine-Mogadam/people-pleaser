import BackButton from "./BackButton";
import { useAppSelector } from "@/state/hooks";
import type { HistoryEntry } from "@/state/gameStateSlice";

/**
 * Everything that has happened this run, newest first, split by week. The log
 * is part of the save, so it survives closing the tab.
 */
function History({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const history = useAppSelector((state) => state.history);
  const newestFirst = [...history].reverse();

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>History</span>
      </div>

      {history.length === 0 ? (
        <p className="phoneHint">
          Nothing yet. Everything you do this run gets logged here.
        </p>
      ) : (
        <div className="grid gap-2">
          {newestFirst.map((entry, index) => (
            <HistoryRow
              key={entry.id}
              entry={entry}
              // A divider goes above the first entry of each week, which reading
              // newest-first means whenever the week differs from the one before.
              startsWeek={
                index === 0 || newestFirst[index - 1].week !== entry.week
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryRow({
  entry,
  startsWeek,
}: {
  entry: HistoryEntry;
  startsWeek: boolean;
}) {
  return (
    <>
      {startsWeek && (
        <div className="weekDivider">
          <span>-- Week {entry.week + 1} --</span>
        </div>
      )}
      <div className="historyEntry">
        <div className="historyTitle">{entry.title}</div>
        {entry.lines.map((line, i) => (
          <div key={`${entry.id}-${i}`} className="historyLine">
            {line}
          </div>
        ))}
      </div>
    </>
  );
}

export default History;
