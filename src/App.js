import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Music,
  Check,
  Settings2,
  ListMusic,
  Clock,
} from "lucide-react";

// --- 配置与数据 ---

const PERF_TYPE_TO_KEY = {
  1: "da",
  2: "pa",
  3: "vo",
  4: "vi",
  5: "me",
};

// 音符标准命名: Da, Pa, Vo, Vi, Me
const NOTE_TYPES = [
  {
    id: 1,
    label: "Da",
    key: "da",
    color: "bg-amber-400",
    text: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: 2,
    label: "Pa",
    key: "pa",
    color: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    id: 3,
    label: "Vo",
    key: "vo",
    color: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 4,
    label: "Vi",
    key: "vi",
    color: "bg-purple-500",
    text: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 5,
    label: "Me",
    key: "me",
    color: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const LIVE_SQUARE_BY_YEAR = {
  year1: [40001, 40002, 40003, 40020, 40006, 40007, 40009, 40010],
  year2_h1: [40000, 40013, 40011],
  year2_h2: [40005, 40004, 40017, 40008],
  year3: [40018, 40019, 40015, 40016, 40012, 40014],
};

const CATEGORY_LABELS = {
  year1: "第一年",
  year2_h1: "二年上",
  year2_h2: "二年下",
  year3: "第三年",
};

const LIVE_SQUARE_MAP = {
  40000: {
    id: 40000,
    name: "追逐梦想！",
    description: "pt+2",
    perfType: [2, 4],
    perfValue: [21, 21],
    liveBonus: "擅长率 +5",
    weight: 4,
  },
  40001: {
    id: 40001,
    name: "青春在等待",
    description: "力量+22",
    perfType: [3, 5],
    perfValue: [32, 12],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40002: {
    id: 40002,
    name: "全速前进",
    description: "速度+22",
    perfType: [1, 4],
    perfValue: [32, 12],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40003: {
    id: 40003,
    name: "RUN×RUN！",
    description: "PT+22",
    perfType: [1, 4, 5],
    perfValue: [14, 16, 14],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40004: {
    id: 40004,
    name: "Grow up Shine！",
    description: "pt+3",
    perfType: [1, 3, 5],
    perfValue: [21, 21, 21],
    liveBonus: "支援卡 +1",
    weight: 4,
  },
  40005: {
    id: 40005,
    name: "光影下的鼓舞",
    description: "智力+2",
    perfType: [2, 5],
    perfValue: [42, 21],
    liveBonus: "支援卡 +1",
    weight: 3,
  },
  40006: {
    id: 40006,
    name: "Go This Way",
    description: "力量+1",
    perfType: [3, 5],
    perfValue: [21, 21],
    liveBonus: "支援卡 +1",
    weight: 1,
  },
  40007: {
    id: 40007,
    name: "相信奇迹吧！",
    description: "智力+1",
    perfType: [2, 5],
    perfValue: [21, 21],
    liveBonus: "擅长率 +5",
    weight: 1,
  },
  40008: {
    id: 40008,
    name: "七彩的景色",
    description: "力量+2",
    perfType: [3, 5],
    perfValue: [21, 42],
    liveBonus: "擅长率 +5",
    weight: 3,
  },
  40009: {
    id: 40009,
    name: "领跑到底！",
    description: "毅力+1",
    perfType: [1, 4],
    perfValue: [21, 21],
    liveBonus: "支援卡 +1",
    weight: 1,
  },
  40010: {
    id: 40010,
    name: "Ring Ring 日记",
    description: "耐力+1",
    perfType: [2, 4],
    perfValue: [21, 21],
    liveBonus: "支援卡 +1",
    weight: 1,
  },
  40011: {
    id: 40011,
    name: "Blue Bird Days",
    description: "速度+2",
    perfType: [1, 4],
    perfValue: [21, 42],
    liveBonus: "擅长率 +5",
    weight: 3,
  },
  40012: {
    id: 40012,
    name: "世界我们说了算",
    description: "耐力+22",
    perfType: [2, 3],
    perfValue: [32, 12],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40013: {
    id: 40013,
    name: "A·NO·NE",
    description: "毅力+2",
    perfType: [1, 4],
    perfValue: [42, 21],
    liveBonus: "擅长率 +5",
    weight: 3,
  },
  40014: {
    id: 40014,
    name: "春之空BLUE",
    description: "毅力+22",
    perfType: [1, 4],
    perfValue: [12, 32],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40015: {
    id: 40015,
    name: "梦想的天空",
    description: "智力+22",
    perfType: [2, 5],
    perfValue: [22, 22],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40016: {
    id: 40016,
    name: "PRESENT MARCH♪",
    description: "力量+22",
    perfType: [3, 5],
    perfValue: [22, 22],
    liveBonus: "友情 +5%",
    weight: 4,
  },
  40017: {
    id: 40017,
    name: "欢乐蹦跳♪",
    description: "耐力+2",
    perfType: [2, 3],
    perfValue: [42, 21],
    liveBonus: "擅长率 +5",
    weight: 3,
  },
  40018: {
    id: 40018,
    name: "Fanfare Future！",
    description: "毅力+26",
    perfType: [1, 4],
    perfValue: [26, 42],
    liveBonus: "友情 +10%",
    weight: 4,
  },
  40019: {
    id: 40019,
    name: "最喜欢的宝箱",
    description: "速度+26",
    perfType: [1, 4],
    perfValue: [42, 26],
    liveBonus: "友情 +10%",
    weight: 4,
  },
  40020: {
    id: 40020,
    name: "站位零号！",
    description: "速度+1",
    perfType: [1, 4],
    perfValue: [21, 21],
    liveBonus: "支援卡 +1",
    weight: 1,
  },
};

export default function App() {
  const [stats, setStats] = useState({ da: 0, pa: 0, vo: 0, vi: 0, me: 0 });
  const [plannedIds, setPlannedIds] = useState(new Set());
  const [purchasedIds, setPurchasedIds] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("year1");

  const [mobileTab, setMobileTab] = useState("songs");

  const totalPlannedCost = useMemo(() => {
    const cost = { da: 0, pa: 0, vo: 0, vi: 0, me: 0 };
    plannedIds.forEach((id) => {
      const song = LIVE_SQUARE_MAP[id];
      if (!song) return;
      song.perfType.forEach((type, idx) => {
        const key = PERF_TYPE_TO_KEY[type];
        if (key) cost[key] += song.perfValue[idx];
      });
    });
    return cost;
  }, [plannedIds]);

  const togglePlanned = (id) => {
    if (purchasedIds.has(id)) return;
    setPlannedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePurchased = (id) => {
    setPurchasedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setPlannedIds((p) => {
          const n = new Set(p);
          n.delete(id);
          return n;
        });
      }
      return next;
    });
  };

  const updateStat = (key, value) => {
    const num = parseInt(value);
    setStats((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : Math.max(0, num) }));
  };

  const adjustStat = (key, delta) => {
    setStats((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const sortedSongIds = useMemo(() => {
    const ids = LIVE_SQUARE_BY_YEAR[activeCategory] || [];
    return [...ids].sort((a, b) => {
      const weightA = LIVE_SQUARE_MAP[a]?.weight || 0;
      const weightB = LIVE_SQUARE_MAP[b]?.weight || 0;
      return weightB - weightA;
    });
  }, [activeCategory]);

  const NoteConsole = () => (
    <div className="flex flex-col gap-1.5 h-full">
      {NOTE_TYPES.map((type) => {
        const current = stats[type.key];
        const needed = totalPlannedCost[type.key];
        const diff = current - needed;
        const isMissing = diff < 0;

        return (
          <div
            key={type.key}
            className="bg-white rounded-xl border border-slate-200 p-2 flex flex-col gap-1.5 shadow-sm hover:border-slate-300 transition-all shrink-0"
          >
            {/* 顶层行：标签、输入、总量、差值 */}
            <div className="flex items-center gap-2 px-1">
              <div className={`w-2 h-2 rounded-full ${type.color} shrink-0`} />
              <span
                className={`text-xs md:text-sm font-black uppercase ${type.text} min-w-[24px]`}
              >
                {type.label}
              </span>

              <div className="flex-1 flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                <input
                  type="number"
                  inputMode="numeric"
                  value={current || ""}
                  placeholder="0"
                  onChange={(e) => updateStat(type.key, e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm md:text-base font-black text-center focus:ring-0 outline-none"
                />
                <span className="text-[10px] md:text-xs font-bold text-slate-300">
                  /{needed}
                </span>
              </div>

              <span
                className={`text-[11px] md:text-sm font-black tabular-nums min-w-[34px] text-right ${isMissing ? "text-rose-500" : "text-emerald-500"}`}
              >
                {isMissing ? diff : `+${diff}`}
              </span>
            </div>

            {/* 按钮层：单行 6 个按钮 */}
            <div className="flex gap-1">
              {[-10, -5, -1, 1, 5, 10].map((v) => (
                <button
                  key={v}
                  onClick={() => adjustStat(type.key, v)}
                  className={`flex-1 h-6 md:h-7 rounded-md text-[9px] md:text-xs font-black border flex items-center justify-center transition-all active:scale-90 ${
                    v < 0
                      ? "bg-rose-50 border-rose-100 text-rose-400 hover:bg-rose-100"
                      : "bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-100"
                  }`}
                >
                  {v > 0 ? `+${v}` : v}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const MobileStatusHeader = () => (
    <div className="md:hidden flex justify-around bg-slate-900 text-white p-2 rounded-xl mb-2 shadow-lg shrink-0">
      {NOTE_TYPES.map((type) => {
        const diff = stats[type.key] - totalPlannedCost[type.key];
        const isMissing = diff < 0;
        return (
          <div key={type.key} className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">
              {type.label}
            </span>
            <span
              className={`text-[11px] font-black tabular-nums leading-none ${isMissing ? "text-rose-400" : "text-emerald-400"}`}
            >
              {isMissing ? diff : `+${diff}`}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden flex flex-col p-2 gap-2">
      <header className="flex items-center justify-between shrink-0 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-purple-600">
          <Music size={14} strokeWidth={3} />
        </div>
        <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-tight">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> 规划:{" "}
            {plannedIds.size}
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 已购:{" "}
            {purchasedIds.size}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden relative">
        {/* 左侧控制台 - 极致压缩高度以适应所有屏幕 */}
        <aside
          className={`
          ${mobileTab === "settings" ? "flex" : "hidden"} 
          md:flex md:w-[280px] shrink-0 flex-col gap-2 
          overflow-y-auto no-scrollbar max-h-full
        `}
        >
          <NoteConsole />
        </aside>

        {/* 右侧内容区 (歌曲库) */}
        <main
          className={`
          ${mobileTab === "songs" ? "flex" : "hidden"} 
          md:flex flex-1 flex-col gap-2 min-h-0 overflow-hidden
        `}
        >
          <MobileStatusHeader />

          <div className="shrink-0 flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl border border-slate-200">
            {Object.keys(CATEGORY_LABELS).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all ${
                  activeCategory === cat
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-24 md:pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 pb-2">
              {sortedSongIds.map((id) => {
                const song = LIVE_SQUARE_MAP[id];
                if (!song) return null;
                const isPlanned = plannedIds.has(id);
                const isPurchased = purchasedIds.has(id);

                return (
                  <div
                    key={id}
                    className={`group relative flex flex-col p-2.5 md:p-3.5 rounded-xl border transition-all ${
                      isPurchased
                        ? "bg-slate-50 border-emerald-400 opacity-70"
                        : isPlanned
                          ? "bg-white border-purple-500 shadow ring-1 ring-purple-50"
                          : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        className={`text-xs md:text-sm font-black truncate flex-1 leading-none ${isPlanned ? "text-purple-700" : "text-slate-800"}`}
                      >
                        {song.name}
                      </h3>
                      {isPurchased && (
                        <Check
                          size={14}
                          className="text-emerald-500 shrink-0"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <p className="text-[10px] md:text-xs text-slate-500 font-bold italic truncate">
                          {song.description}
                        </p>
                        <div className="text-[9px] md:text-[10px] text-emerald-700 font-black bg-emerald-50 border border-emerald-200 self-start px-1.5 py-0.5 rounded shadow-sm truncate max-w-full leading-none">
                          {song.liveBonus}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => togglePlanned(id)}
                          disabled={isPurchased}
                          className={`w-14 md:w-16 h-5 md:h-6 flex items-center justify-center rounded text-[8px] md:text-[10px] font-black transition-all border ${
                            isPurchased
                              ? "bg-slate-50 text-slate-200 border-slate-100 cursor-not-allowed"
                              : isPlanned
                                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                                : "bg-white text-slate-400 border-slate-200 hover:border-purple-300 hover:text-purple-600"
                          }`}
                        >
                          {isPlanned ? "取消" : "预定"}
                        </button>
                        <button
                          onClick={() => togglePurchased(id)}
                          className={`w-14 md:w-16 h-5 md:h-6 flex items-center justify-center rounded text-[8px] md:text-[10px] font-black transition-all border ${
                            isPurchased
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-white text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                          }`}
                        >
                          {isPurchased ? "取消" : "购入"}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 border-t border-slate-50 pt-1.5">
                      {song.perfType.map((type, idx) => {
                        const config = NOTE_TYPES.find((p) => p.id === type);
                        return (
                          <div
                            key={type}
                            className={`flex items-center gap-0.5 px-1 rounded border border-slate-100 ${config.bg}`}
                          >
                            <span
                              className={`text-[7px] md:text-[8px] font-black uppercase ${config.text}`}
                            >
                              {config.label}
                            </span>
                            <span
                              className={`text-[8px] md:text-[9px] font-black ${config.text}`}
                            >
                              {song.perfValue[idx]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <footer className="md:hidden shrink-0 bg-white border border-slate-200 rounded-2xl flex items-center justify-around p-1.5 shadow-xl mb-1">
        <button
          onClick={() => setMobileTab("settings")}
          className={`flex-1 flex flex-col items-center py-1 transition-colors ${mobileTab === "settings" ? "text-purple-600 font-black" : "text-slate-400"}`}
        >
          <Settings2 size={18} />
          <span className="text-[9px] mt-0.5">属性设置</span>
        </button>
        <button
          onClick={() => setMobileTab("songs")}
          className={`flex-1 flex flex-col items-center py-1 transition-colors ${mobileTab === "songs" ? "text-purple-600 font-black" : "text-slate-400"}`}
        >
          <ListMusic size={18} />
          <span className="text-[9px] mt-0.5">歌曲库</span>
        </button>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
