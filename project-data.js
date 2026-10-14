window.portfolioProjects = [
  {
    "title": "Bogor Agricultural Intelligence",
    "short": "BOGOR AGRICULTURAL",
    "category": "DATA ANALYSIS",
    "tools": "Next.js · Python · Pandas · K-Means",
    "summary": "Dashboard interaktif untuk mengeksplorasi produksi pertanian Kabupaten Bogor dari data BPS.",
    "description": "Dashboard riset yang mengubah data pertanian BPS menjadi ringkasan produksi, tren tahunan, peringkat komoditas dan kecamatan, serta insight yang dapat ditelusuri. Pengunjung dapat memfilter data, mengekspor CSV, dan mengeksplorasi pengelompokan K-Means ketika cakupan data mencukupi.",
    "result": "Menghubungkan eksplorasi data, visualisasi, dan machine learning dalam satu dashboard. Data yang tidak tersedia tetap ditandai sebagai missing; insight mengikuti cakupan snapshot yang dipublikasikan.",
    "images": [
      [
        "projects/bogor/dashboard.png",
        "Preview dashboard Bogor Agricultural Intelligence"
      ]
    ],
    "links": [
      [
        "Buka dashboard",
        "https://fx-cyber.github.io/bogor-agricultural-intelligence/"
      ],
      [
        "Source code",
        "https://github.com/FX-cyber/bogor-agricultural-intelligence"
      ]
    ],
    "tags": [
      "NEXT.JS",
      "PYTHON",
      "BPS DATA"
    ]
  },
  {
    "title": "Customer Churn Bank — Naive Bayes",
    "short": "BANK CUSTOMER CHURN",
    "category": "MACHINE LEARNING",
    "tools": "Python · pandas · scikit-learn · Google Colab",
    "summary": "Klasifikasi churn nasabah dengan Gaussian Naive Bayes dan evaluasi data tidak seimbang.",
    "description": "Studi kasus pada 10.000 observasi nasabah bank. Eksperimen mencakup EDA, pembagian data stratified 80:20, preprocessing dalam Pipeline, serta perbandingan Gaussian Naive Bayes dengan baseline kelas mayoritas.",
    "result": "Accuracy 82,20% dan ROC-AUC 0,8104 pada data uji. Recall churn hanya 14,74%: model melewatkan sebagian besar kasus churn, sehingga belum layak digunakan langsung sebagai sistem peringatan. Evaluasi menunjukkan mengapa akurasi saja tidak cukup.",
    "images": [
      [
        "projects/naive bayes/Portofolio Klasifikasi Churn Bank.png",
        "Ringkasan studi kasus churn bank"
      ],
      [
        "projects/naive bayes/gambar_01_distribusi_churn.png",
        "Distribusi churn dan usia nasabah"
      ],
      [
        "projects/naive bayes/gambar_02_perbandingan_segmen.png",
        "Perbandingan churn antarsegmen"
      ],
      [
        "projects/naive bayes/gambar_03_jumlah_produk.png",
        "Churn menurut jumlah produk"
      ],
      [
        "projects/naive bayes/gambar_04_confusion_matrix_roc.png",
        "Confusion matrix dan ROC curve"
      ]
    ],
    "links": [
      [
        "Notebook Colab",
        "https://colab.research.google.com/drive/1JMiift5LJxF55ysuwDSyZ7AhL7-pdAI9"
      ],
      [
        "Dataset Kaggle",
        "https://www.kaggle.com/datasets/gauravtopre/bank-customer-churn-dataset"
      ]
    ],
    "tags": [
      "PYTHON",
      "NAIVE BAYES",
      "CLASSIFICATION"
    ]
  },
  {
    "title": "AI Impact on Students — Decision Tree",
    "short": "AI IMPACT ON STUDENTS",
    "category": "MACHINE LEARNING",
    "tools": "Python · scikit-learn · GridSearchCV · Google Colab",
    "summary": "Eksperimen Decision Tree untuk klasifikasi tiga kategori risiko burnout pada dataset mahasiswa.",
    "description": "Eksperimen data mining menggunakan 50.000 observasi dari dataset AI Impact on Students. Sebelas fitur numerik dan kategorikal diproses dalam Pipeline, lalu Decision Tree dituning dengan GridSearchCV berdasarkan F1-macro untuk membedakan kategori Low, Medium, dan High.",
    "result": "Accuracy 51,72% dan F1-macro 0,5183, melampaui baseline mayoritas. Recall kategori High masih sekitar 44%. Ini merupakan eksperimen pada dataset, bukan alat diagnosis psikologis; feature importance tidak menunjukkan hubungan sebab-akibat.",
    "images": [
      [
        "projects/Decision tree/Sampul Portofolio Decision Tree.png",
        "Ringkasan studi kasus Decision Tree"
      ],
      [
        "projects/Decision tree/distribusi_risiko.png",
        "Distribusi kategori risiko"
      ],
      [
        "projects/Decision tree/boxplot_genai.png",
        "Durasi penggunaan GenAI menurut kategori"
      ],
      [
        "projects/Decision tree/confusion_matrix.png",
        "Confusion matrix Decision Tree"
      ],
      [
        "projects/Decision tree/feature_importance.png",
        "Feature importance model"
      ]
    ],
    "links": [
      [
        "Notebook Colab",
        "https://colab.research.google.com/drive/1W_MgOe393FRvkZgZB9UzKVAhPXcmIZK9"
      ],
      [
        "Dataset Kaggle",
        "https://www.kaggle.com/datasets/laveshjadon/ai-impact-on-students"
      ],
      [
        "Laporan PDF",
        "projects/Decision tree/Laporan_Tugas_Decision_Tree_AI_Impact_on_Students.pdf"
      ]
    ],
    "tags": [
      "PYTHON",
      "DECISION TREE",
      "CLASSIFICATION"
    ]
  },
  {
    "title": "WebInsight BI",
    "short": "WEBINSIGHT BI",
    "category": "PUBLIC WEB INTELLIGENCE",
    "tools": "Web dashboard · Trend scoring · Evidence tracing",
    "summary": "Eksplorasi tren dan sinyal dari sumber publik dengan evidence yang dapat ditelusuri.",
    "description": "WebInsight menyajikan informasi publik melalui empat tampilan: Pulse, Explore, Signals, dan Sources. Pulse menampilkan peringkat tren, mentions harian, serta sinyal lintas sumber. Skor tren merangkum frequency, recency, dan source diversity.",
    "result": "Pengunjung dapat menelusuri insight kembali ke evidence asalnya. Tanggal pembaruan dan status pemeriksaan sumber ditampilkan untuk memberi konteks pada data; proses research automation berjalan terpisah dari aplikasi web.",
    "images": [
      [
        "projects/webinsight/preview.png",
        "Tampilan Pulse — WebInsight Public Web Intelligence"
      ]
    ],
    "links": [
      [
        "Buka WebInsight BI",
        "https://fx-cyber.github.io/webinsight-bi/#/"
      ]
    ],
    "tags": [
      "BUSINESS INTELLIGENCE",
      "TRENDS",
      "PUBLIC DATA"
    ]
  }
];
