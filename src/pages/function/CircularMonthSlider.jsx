import { useRef, useEffect, useState } from "react";

const CircularMonthSlider = ({ start, end, onChange }) => {
  const canvasRef = useRef(null);

  // 円形スライダーの基本設定
  const size = 300;
  const center = size / 2;
  const radius = 100; // 半径
  const handleRadius = 10; // つまみの半径
  const maxHitDistance = 25; // つまみをクリック可能な最大距離
  const totalMonths = 12;

  // ドラッグ状態を管理するref（start、end）
  const draggingRef = useRef(null);

  // デバイスピクセル比を管理
  const [dpr, setDpr] = useState(1);

  const seasons = [
    { name: "春", months: [2, 3, 4], color: "#FFB6C1", textColor: "#8B4513" },
    { name: "夏", months: [5, 6, 7], color: "#87CEEB", textColor: "#191970" },
    { name: "秋", months: [8, 9, 10], color: "#DEB887", textColor: "#8B4513" },
    { name: "冬", months: [11, 0, 1], color: "#E6E6FA", textColor: "#4B0082" },
  ];

  //月の開始角度を計算（月の境界）
  //角度で月を表示させているため、-90度しないと1月が真上にこない

  const angleFromMonth = (month) =>
    (month / totalMonths) * 2 * Math.PI - Math.PI / 2;

  // 月の中央角度を計算（ラベル表示用）
  // 月の中央に文字を配置するため

  const angleFromMonthCenter = (month) =>
    ((month + 0.5) / totalMonths) * 2 * Math.PI - Math.PI / 2;

  // 角度から月を計算

  const monthFromAngle = (angle) =>
    Math.round(
      (((angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) *
        totalMonths
    ) % totalMonths;

  // 座標から角度を計算
  // マウス座標から第何象限にいるかを出す

  const getAngleFromCoord = (x, y) => {
    const dx = x / dpr - center; // 中心からのX距離
    const dy = y / dpr - center; // 中心からのY距離
    return Math.atan2(dy, dx); // アークタンジェントで角度を計算
  };

  // クライアント座標をキャンバス座標に変換
  // ブラウザのマウス座標をキャンバス内の座標に変換

  const getCanvasCoords = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * dpr, // DPR（デバイスピクセル比）を考慮
      y: (clientY - rect.top) * dpr,
    };
  };

  // つまみの位置を計算
  // 指定された角度でのつまみの座標を計算

  const getHandlePosition = (angle) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  });

  // 2点間の距離を計算
  const getDistance = (x, y, targetX, targetY) =>
    Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);

  // 指定された点が円の範囲内にあるかを判定
  const isInsideCircle = (x, y, centerX, centerY, radius) => {
    return getDistance(x, y, centerX, centerY) <= radius;
  };

  //  クリックした位置がどの季節エリアかを判定
  //  マウス座標から対応する季節を特定
  const getSeasonFromCoord = (x, y) => {
    const adjustedX = x / dpr;
    const adjustedY = y / dpr;

    // 円の内側（季節エリア）にあるかチェック
    if (!isInsideCircle(adjustedX, adjustedY, center, center, radius - 10)) {
      return null;
    }

    // 角度から月を計算し、対応する季節を検索
    const angle = getAngleFromCoord(x, y);
    const month = monthFromAngle(angle);
    console.log(angle);
    console.log(month);

    return seasons.find((season) => season.months.includes(month));
  };

  // つまみを描画
  // 円周上にドラッグ可能なハンドルを描画

  const drawHandle = (ctx, angle, color) => {
    const { x, y } = getHandlePosition(angle);

    // ハンドル本体を描画
    ctx.beginPath();
    ctx.arc(x, y, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // ハンドルの枠線を描画
    ctx.beginPath();
    ctx.arc(x, y, handleRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // キャンバスの初期設定
  // 高解像度ディスプレイに対応したキャンバスの設定

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;

    setDpr(devicePixelRatio);

    // 高解像度ディスプレイ対応
    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  // 円形スライダーを描画
  // 季節背景、選択範囲、ハンドル、月ラベルなどを描画

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, size, size); // キャンバスをクリア

    const startAngle = angleFromMonth(start);
    const endAngle = angleFromMonth(end);

    // 終了ハンドルの位置を計算（月末に配置）
    const endHandleAngle =
      start === end
        ? angleFromMonth((end + 1) % totalMonths) // 単月の場合は月末
        : angleFromMonth((end + 1) % totalMonths); // 範囲選択の場合も月末

    // 季節の背景を描画
    seasons.forEach((season) => {
      const seasonStartAngle = angleFromMonth(season.months[0]);
      // 最後の月の次の月の開始角度まで
      const lastMonth = season.months[2];
      const seasonEndAngle = angleFromMonth((lastMonth + 1) % totalMonths);

      // 季節エリアの扇形を描画
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius - 10, seasonStartAngle, seasonEndAngle);
      ctx.closePath();
      ctx.fillStyle = season.color;
      ctx.fill();

      // 季節の境界線を描画
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + (radius - 10) * Math.cos(seasonStartAngle),
        center + (radius - 10) * Math.sin(seasonStartAngle)
      );
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 中央の通年ボタンを描画
    ctx.beginPath();
    ctx.arc(center, center, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 通年ボタンのテキストを描画
    ctx.fillStyle = "#333";
    ctx.font =
      "bold 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("通年", center, center);

    // 季節名を描画
    seasons.forEach((season) => {
      const middleMonth = season.months[1]; // 中央の月
      const angle = angleFromMonthCenter(middleMonth); // 中央角度を使用
      const x = center + (radius - 40) * Math.cos(angle);
      const y = center + (radius - 40) * Math.sin(angle);

      ctx.fillStyle = season.textColor;
      ctx.font =
        "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(season.name, x, y);
    });

    // 円のベースラインを描画
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 選択範囲の描画
    ctx.beginPath();
    ctx.strokeStyle = "#ff7f50";
    ctx.lineWidth = 8;

    if (start === 0 && end === 11) {
      // 通年選択の場合：円全体を描画
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
    } else if (start === end) {
      // 単月選択の場合：その月の開始から終了まで
      const monthStartAngle = angleFromMonth(start);
      const monthEndAngle = angleFromMonth((start + 1) % totalMonths);
      ctx.arc(center, center, radius, monthStartAngle, monthEndAngle);
    } else if (startAngle <= endHandleAngle) {
      // 通常の範囲選択
      ctx.arc(center, center, radius, startAngle, endHandleAngle);
    } else {
      // 年またぎの場合（12月→1月など）
      ctx.arc(center, center, radius, startAngle, endHandleAngle + 2 * Math.PI);
    }
    ctx.stroke();

    // ハンドルを描画
    drawHandle(ctx, startAngle, "#ff4444");
    drawHandle(ctx, endHandleAngle, "#4444ff");

    // 月表示（月の中央に配置）
    for (let i = 0; i < totalMonths; i++) {
      const angle = angleFromMonthCenter(i); // 月の中央角度を使用
      const x = center + (radius + 25) * Math.cos(angle);
      const y = center + (radius + 25) * Math.sin(angle);

      ctx.fillStyle = "#333";
      ctx.font =
        "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${i + 1}月`, x, y);
    }
  };

  // コンポーネントマウント時にキャンバスを初期化
  useEffect(() => {
    setupCanvas();
  }, []);

  // start、end、dprが変更されたときに再描画
  useEffect(() => {
    draw();
  }, [start, end, dpr]);

  //  指定座標での入力処理
  //  ドラッグ中のハンドル位置を更新
  const handleInputAt = (x, y) => {
    const angle = getAngleFromCoord(x, y);
    const newMonth = monthFromAngle(angle);

    // ドラッグ中のハンドルに応じて開始月または終了月を更新
    if (draggingRef.current === "start") {
      onChange(newMonth, end);
    } else if (draggingRef.current === "end") {
      onChange(start, newMonth);
    }
  };

  // 月のラベルエリアがクリックされたかチェック
  // 円周外側の月ラベルがクリックされたかを判定

  const getClickedMonthLabel = (x, y) => {
    const adjustedX = x / dpr;
    const adjustedY = y / dpr;

    // 各月のラベル位置をチェック
    for (let i = 0; i < totalMonths; i++) {
      const angle = angleFromMonthCenter(i);
      const labelX = center + (radius + 25) * Math.cos(angle);
      const labelY = center + (radius + 25) * Math.sin(angle);

      // クリック範囲を少し大きくして判定しやすく
      if (getDistance(adjustedX, adjustedY, labelX, labelY) < 20) {
        console.log(`月${i + 1}のラベルがクリックされました！`);
        return i;
      }
    }
    return null;
  };

  // マウスダウンイベントハンドラ
  // クリック位置に応じて適切な処理を実行

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const adjustedX = x / dpr;
    const adjustedY = y / dpr;

    const startAngle = angleFromMonth(start);
    const endHandleAngle =
      start === end
        ? angleFromMonth((end + 1) % totalMonths)
        : angleFromMonth((end + 1) % totalMonths);

    // 各ハンドルの位置を取得
    const { x: sx, y: sy } = getHandlePosition(startAngle);
    const { x: ex, y: ey } = getHandlePosition(endHandleAngle);

    // クリック位置と各ハンドルの距離を計算
    const distToStart = getDistance(adjustedX, adjustedY, sx, sy);
    const distToEnd = getDistance(adjustedX, adjustedY, ex, ey);

    // ハンドルをクリックした場合
    if (distToStart < maxHitDistance || distToEnd < maxHitDistance) {
      // より近いハンドルを選択してドラッグ開始
      draggingRef.current = distToStart <= distToEnd ? "start" : "end";
      handleInputAt(x, y);
      return;
    }

    // 中央の通年ボタンをクリックした場合
    if (isInsideCircle(adjustedX, adjustedY, center, center, 30)) {
      onChange(0, 11); // 1月〜12月
      return;
    }

    // 月のラベルをクリックした場合
    const clickedMonth = getClickedMonthLabel(x, y);
    if (clickedMonth !== null) {
      onChange(clickedMonth, clickedMonth); // 単月選択
      return;
    }

    // 季節エリアをクリックした場合
    const clickedSeason = getSeasonFromCoord(x, y);
    if (clickedSeason) {
      // 各季節の実際の開始月と終了月を設定
      if (clickedSeason.name === "春") {
        onChange(2, 4); // 3月〜5月
      } else if (clickedSeason.name === "夏") {
        onChange(5, 7); // 6月〜8月
      } else if (clickedSeason.name === "秋") {
        onChange(8, 10); // 9月〜11月
      } else if (clickedSeason.name === "冬") {
        onChange(11, 1); // 12月〜2月（年またぎ）
      }
    }
  };

  //  マウス移動イベントハンドラ
  //  ドラッグ中のハンドル位置を更新

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return; // ドラッグ中でなければ何もしない
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    handleInputAt(x, y);
  };

  //  マウスアップイベントハンドラ
  //  ドラッグ状態を終了
  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <canvas
        ref={canvasRef}
        style={{
          touchAction: "none", // タッチスクロールを無効化
          cursor: "grab", // カーソルをグラブ形状に
          border: "1px solid #ddd", // 境界線
          borderRadius: "8px", // 角丸
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default CircularMonthSlider;
