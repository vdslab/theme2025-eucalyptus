import pandas as pd
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage
from sklearn.preprocessing import StandardScaler

# JSONファイルの読み込み（orientはデータの形式に応じて変更）
df = pd.read_json('flowers_clustered.json')

# データの確認（最初の5行だけ表示）
print(df.head())

# 数値データだけを抽出（必要に応じて列名を指定してもOK）
numeric_data = df.select_dtypes(include=['float64', 'int64'])

# 標準化（スケーリング）
scaler = StandardScaler()
scaled_data = scaler.fit_transform(numeric_data)

# 階層クラスタリング（Ward法など）
linked = linkage(scaled_data, method='ward')

# デンドログラムの描画
plt.figure(figsize=(12, 7))
dendrogram(linked, labels=df.index.tolist(), leaf_rotation=90)
plt.title('階層クラスタリング（flowers_clustered.json）')
plt.xlabel('データポイント')
plt.ylabel('距離')
plt.tight_layout()
plt.show()
