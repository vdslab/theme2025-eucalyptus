import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from scipy.cluster.hierarchy import dendrogram, linkage

# JSONファイルの読み込み
df = pd.read_json("/Users/kiminagon/theme2025-eucalyptus/public/flowers_clustered.json")

# --- 前処理: テキストデータを数値化する ---

# 咲く時期の分割（6月, 7月 → ['6月', '7月']）
df['blooming_period'] = df['blooming_period'].str.split(', ')

# 花言葉（language）も空白で分割（複数あるので）
df['language'] = df['language'].str.split(' ')

# One-hot encoding（MultiLabelBinarizer）を使う
mlb_period = MultiLabelBinarizer()
mlb_language = MultiLabelBinarizer()
mlb_color = MultiLabelBinarizer()

period_encoded = pd.DataFrame(mlb_period.fit_transform(df['blooming_period']),
                              columns=mlb_period.classes_)

language_encoded = pd.DataFrame(mlb_language.fit_transform(df['language']),
                                columns=mlb_language.classes_)

color_encoded = pd.DataFrame(mlb_color.fit_transform(df[['color']].values),
                             columns=mlb_color.classes_)

# 特徴量を結合
features = pd.concat([period_encoded, language_encoded, color_encoded], axis=1)

# --- 標準化（必要なら） ---
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# --- 階層クラスタリング（Ward法） ---
linked = linkage(scaled_features, method='ward')

# --- デンドログラム表示 ---
plt.figure(figsize=(12, 7))
dendrogram(linked, labels=df['name'].values, leaf_rotation=90)
plt.title('花の階層クラスタリング')
plt.xlabel('花の名前')
plt.ylabel('距離')
plt.tight_layout()
plt.show()
