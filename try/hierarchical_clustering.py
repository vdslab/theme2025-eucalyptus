import pandas as pd
import matplotlib.pyplot as plt
import japanize_matplotlib
import seaborn as sns
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster

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

linked_color = linkage(color_encoded, method='ward')
color_clusters = fcluster(linked_color, t=10, criterion='maxclust')
df['color_cluster'] = color_clusters

features = pd.concat([period_encoded, language_encoded], axis=1)
scaled_features = StandardScaler().fit_transform(features)
linked_full = linkage(scaled_features, method='ward')

palette = sns.color_palette("tab10", 10)
label_color_dict = {i + 1: palette[i] for i in range(10)}
label_colors = [label_color_dict[c] for c in df['color_cluster']]

features = pd.concat([period_encoded, language_encoded, color_encoded], axis=1)



plt.figure(figsize=(12, 7))
dendrogram(linked, labels=df['name'].values, leaf_rotation=90, leaf_font_size=6)
plt.title('花の色ごとの階層クラスタリング')
plt.xlabel('花の名前')
plt.ylabel('距離')
plt.tight_layout()
plt.show()
