import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from scipy.cluster.hierarchy import dendrogram, linkage

df = pd.read_json("/Users/kiminagon/eucalyptus/theme2025-eucalyptus/public/data/flowers_clustered.json")

df['blooming_period'] = df['blooming_period'].fillna('').apply(
    lambda x: str(x).split(', ') if x else []
)
df['language'] = df['language'].fillna('').apply(
    lambda x: str(x).split(' ') if x else []
)
df['color'] = df['color'].fillna('不明').apply(
    lambda x: [x] if isinstance(x, str) else []
)

mlb_period = MultiLabelBinarizer()
mlb_language = MultiLabelBinarizer()
mlb_color = MultiLabelBinarizer()

period_encoded = pd.DataFrame(mlb_period.fit_transform(df['blooming_period']),
                              columns=mlb_period.classes_)

language_encoded = pd.DataFrame(mlb_language.fit_transform(df['language']),
                                columns=mlb_language.classes_)

color_encoded = pd.DataFrame(mlb_color.fit_transform(df['color']),
                             columns=mlb_color.classes_)

features = pd.concat([period_encoded, language_encoded, color_encoded], axis=1)

scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

linked = linkage(scaled_features, method='ward')

plt.figure(figsize=(12, 7))
dendrogram(linked, labels=df['name'].values, leaf_rotation=90, leaf_font_size=6)
plt.title('花の階層クラスタリング')
plt.xlabel('花の名前')
plt.ylabel('距離')
plt.tight_layout()
plt.show()
