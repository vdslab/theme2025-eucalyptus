const EventSearch = ({
  selectedEvent,
  setSelectedEvent,
  onEventSelect,
  onClearEventSearch,
  isMobile = false,
}) => {
  const presetEvents = [
    { name: "送別・退職祝い" },
    { name: "お見舞い" },
    { name: "プロポーズ" },
    { name: "入学祝い" },
  ];

  if (isMobile) {
    // モバイル版
    return (
      <div className="p-4">
        {/* 選択中のイベント表示（後で実装） */}
        {selectedEvent && (
          <div className="mb-4 p-3 bg-white rounded-lg flex items-center justify-between">
            <span className="text-sm">{selectedEvent}</span>
            <button
              className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              onClick={() => {
                setSelectedEvent("");
                onClearEventSearch();
              }}
            >
              解除
            </button>
          </div>
        )}

        {/* イベント一覧 - 2列表示 */}
        <div className="grid grid-cols-2 gap-2">
          {presetEvents.map((event) => (
            <button
              key={event.name}
              className="p-3 hover:bg-white rounded-lg transition-colors text-sm text-left"
              onClick={() => {
                setSelectedEvent(event.name);
                onEventSelect(event.name);
              }}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // PC版（ホバー表示用）
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-max">
      {selectedEvent && (
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span>選択中: {selectedEvent}</span>
          <button
            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => {
              setSelectedEvent("");
              onClearEventSearch();
            }}
          >
            解除
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {presetEvents.map((event) => (
          <button
            key={event.name}
            className="px-4 py-2 hover:bg-gray-100 rounded transition-colors whitespace-nowrap"
            onClick={() => {
              setSelectedEvent(event.name);
              onEventSelect(event.name);
            }}
          >
            {event.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventSearch;
