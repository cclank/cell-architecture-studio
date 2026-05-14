export type ModelKind =
  | "plant"
  | "whiteBlood"
  | "neuron"
  | "epithelial"
  | "bacteria"
  | "animal"
  | "muscle";

export type ViewMode = "mesh" | "focus";

export type OrganelleItem = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  attributes: Array<{
    label: string;
    value: string;
  }>;
  note: string;
  fact: string;
};

export type CellModelAsset = {
  url: string;
  previewUrl: string;
  sourceLabel: string;
  sourceUrl: string;
  scale: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  exposure?: number;
  materialMode?: "studio" | "native";
};

export type CellRenderImage = {
  url: string;
  aspect: "square" | "wide" | "landscape";
};

export type CellItem = {
  id: string;
  name: string;
  type: string;
  accent: string;
  accentSoft: string;
  color: string;
  modelKind: ModelKind;
  defaultOrganelle: string;
  comparison: string;
  modelAsset?: CellModelAsset;
  renderImage?: CellRenderImage;
  occurrence: {
    title: string;
    body: string;
    motif: string;
  };
  microscope: Array<{
    label: string;
    tone: string;
    pattern: string;
  }>;
  organelles: OrganelleItem[];
};

export const cells: CellItem[] = [
  {
    id: "plant",
    name: "Tế Bào Thực Vật",
    type: "Tế Bào Nhân Thực",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#81b64b",
    modelKind: "plant",
    defaultOrganelle: "nucleus",
    comparison: "animal",
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
      aspect: "square",
    },
    modelAsset: {
      url: "/models/plant-cell-first001.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      sourceLabel: "User Plant Cell GLB first001",
      sourceUrl: "local:/Users/lank/Downloads/first001.glb",
      scale: 2.36,
      rotation: [0.08, -1.42, -0.02],
      exposure: 1.08,
      materialMode: "native",
    },
    occurrence: {
      title: "Lá, thân, rễ",
      body: "Tế bào thực vật tạo thành các mô dự trữ năng lượng, vận chuyển nước và chuyển đổi ánh sáng mặt trời thành đường.",
      motif: "leaf",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#b9d48a", pattern: "plant-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#cf8cc2", pattern: "plant-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#9a9a8e", pattern: "electron" },
    ],
    organelles: [
      {
        id: "nucleus",
        name: "Nhân Tế Bào",
        subtitle: "Trung tâm điều khiển",
        color: "#7047a8",
        attributes: [
          { label: "Kích thước", value: "5 đến 10 µm đường kính" },
          { label: "Vị trí", value: "Thường ở trung tâm" },
          { label: "Thấy được trong KHV quang học", value: "Có" },
        ],
        note:
          "Nhân tế bào được bao quanh bởi màng kép gọi là lớp vỏ nhân, chứa các lỗ điều tiết sự di chuyển của phân tử.",
        fact: "Nhân tế bào là một trong những cấu trúc tế bào đầu tiên được khám phá.",
      },
      {
        id: "chloroplast",
        name: "Lục Lạp",
        subtitle: "Bộ thu hoạch ánh sáng",
        color: "#5fa842",
        attributes: [
          { label: "Chức năng", value: "Quang hợp" },
          { label: "Sắc tố", value: "Diệp lục" },
          { label: "Thấy được trong KHV quang học", value: "Thường thấy" },
        ],
        note:
          "Lục lạp chuyển đổi năng lượng ánh sáng thành năng lượng hóa học và mang lại màu xanh cho nhiều mô thực vật.",
        fact: "Một tế bào lá đơn có thể chứa hàng chục lục lạp.",
      },
      {
        id: "vacuole",
        name: "Không Bào",
        subtitle: "Bể chứa áp suất",
        color: "#62bdd2",
        attributes: [
          { label: "Thể tích", value: "Không gian trung tâm lớn" },
          { label: "Nội dung", value: "Nước và chất tan" },
          { label: "Chức năng", value: "Hỗ trợ áp suất thẩm thấu" },
        ],
        note:
          "Không bào trung tâm dự trữ nước, ion và phân tử nhỏ, đồng thời giúp tế bào thực vật duy trì độ cứng.",
        fact: "Không bào có thể chiếm phần lớn tế bào thực vật trưởng thành.",
      },
      {
        id: "cellWall",
        name: "Thành Tế Bào",
        subtitle: "Khung cứng",
        color: "#7aa647",
        attributes: [
          { label: "Vật liệu", value: "Giàu cellulose" },
          { label: "Vị trí", value: "Ranh giới ngoài" },
          { label: "Chức năng", value: "Bảo vệ" },
        ],
        note:
          "Thành tế bào tạo hình dạng đều đặn cho tế bào thực vật và bảo vệ màng bên dưới.",
        fact: "Thành tế bào giúp thực vật đứng thẳng mà không cần bộ xương.",
      },
    ],
  },
  {
    id: "whiteBlood",
    name: "Bạch Cầu",
    type: "Tế Bào Miễn Dịch",
    accent: "#6d78a8",
    accentSoft: "#e6eaf7",
    color: "#b9bfd7",
    modelKind: "whiteBlood",
    defaultOrganelle: "lysosome",
    comparison: "epithelial",
    renderImage: {
      url: "/cell-renders-transparent/white-blood.png",
      aspect: "square",
    },
    modelAsset: {
      url: "/models/white-blood-cell-user.glb",
      previewUrl: "/cell-renders-transparent/white-blood.png",
      sourceLabel: "User White Blood Cell GLB",
      sourceUrl: "local:/Users/lank/Downloads/second.glb",
      scale: 3.18,
      rotation: [0.02, -0.18, 0],
      exposure: 1.08,
      materialMode: "native",
    },
    occurrence: {
      title: "Máu, bạch huyết, mô",
      body: "Bạch cầu di chuyển qua máu và các khoang mô để nhận diện mối đe dọa và phối hợp phòng thủ miễn dịch.",
      motif: "blood",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#ded6e9", pattern: "blood-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#9c73be", pattern: "blood-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#8f8f91", pattern: "electron" },
    ],
    organelles: [
      {
        id: "lysosome",
        name: "Lysosome",
        subtitle: "Túi dọn dẹp",
        color: "#8b54b7",
        attributes: [
          { label: "Kích thước", value: "Khoảng 1 µm" },
          { label: "Nội dung", value: "Enzyme tiêu hóa" },
          { label: "Chức năng", value: "Phân giải" },
        ],
        note:
          "Lysosome giúp tế bào miễn dịch tiêu hóa vật chất bị nuốt và tái chế các thành phần tế bào đã hao mòn.",
        fact: "Bạch cầu phụ thuộc nhiều vào các túi để phòng thủ.",
      },
      {
        id: "nucleus",
        name: "Nhân Thùy",
        subtitle: "Kho lưu trữ hệ gen linh hoạt",
        color: "#6f35a1",
        attributes: [
          { label: "Hình dạng", value: "Thường có thùy" },
          { label: "Vị trí", value: "Trung tâm" },
          { label: "Thấy được trong KHV quang học", value: "Có, với thuốc nhuộm" },
        ],
        note:
          "Nhiều bạch cầu có nhân thùy giúp chúng chui qua các khe hẹp.",
        fact: "Hình dạng nhân là một dấu hiệu để nhận diện loại tế bào miễn dịch.",
      },
      {
        id: "granules",
        name: "Hạt Bào",
        subtitle: "Gói hóa chất",
        color: "#c06696",
        attributes: [
          { label: "Nội dung", value: "Protein và enzyme" },
          { label: "Sử dụng", value: "Phòng thủ" },
          { label: "Khả năng quan sát", value: "Phụ thuộc thuốc nhuộm" },
        ],
        note:
          "Hạt bào lưu trữ các phân tử giúp tế bào miễn dịch phản ứng nhanh với nhiễm trùng hoặc viêm.",
        fact: "Một số tế bào miễn dịch được đặt tên theo cách hạt bào của chúng bắt màu.",
      },
    ],
  },
  {
    id: "neuron",
    name: "Tế Bào Thần Kinh",
    type: "Tế Bào Thần Kinh",
    accent: "#6578b5",
    accentSoft: "#e4e9f8",
    color: "#8c91d0",
    modelKind: "neuron",
    defaultOrganelle: "axon",
    comparison: "muscle",
    renderImage: {
      url: "/cell-renders-transparent/neuron.png",
      aspect: "wide",
    },
    modelAsset: {
      url: "/models/neuron-nih.glb",
      previewUrl: "/nih-previews/neuron-nih.png",
      sourceLabel: "NIH 3D Neuron",
      sourceUrl: "https://3d.nih.gov/entries/3DPX-015796/2",
      scale: 3.15,
      rotation: [0.18, -0.24, -0.18],
      position: [0, 0.05, 0],
      exposure: 1.05,
    },
    occurrence: {
      title: "Não, tủy sống, dây thần kinh",
      body: "Tế bào thần kinh dẫn truyền tín hiệu điện và hóa học qua các mạng lưới phân nhánh dài.",
      motif: "nerve",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#c9c4ed", pattern: "neuron-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#dc99cc", pattern: "neuron-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#8e8e94", pattern: "electron" },
    ],
    organelles: [
      {
        id: "axon",
        name: "Sợi Trục",
        subtitle: "Đường cao tốc tín hiệu",
        color: "#6b7dc6",
        attributes: [
          { label: "Chiều dài", value: "µm đến hơn 1 mét" },
          { label: "Lớp cách điện", value: "Bao myelin" },
          { label: "Thấy được trong KHV quang học", value: "Có, với thuốc nhuộm" },
        ],
        note:
          "Một số sợi trục trong cơ thể người chạy từ cột sống đến bàn chân, khiến tế bào thần kinh là một trong những tế bào dài nhất trong tự nhiên.",
        fact: "Xung thần kinh có thể truyền với tốc độ hơn 100 mét mỗi giây.",
      },
      {
        id: "soma",
        name: "Thân Tế Bào",
        subtitle: "Thân của tế bào",
        color: "#7c52b7",
        attributes: [
          { label: "Chứa", value: "Nhân tế bào" },
          { label: "Chức năng", value: "Trung tâm trao đổi chất" },
          { label: "Hình dạng", value: "Tròn" },
        ],
        note:
          "Thân tế bào duy trì tế bào thần kinh và tích hợp tín hiệu đến từ các nhánh đuôi gai.",
        fact: "Hầu hết protein tế bào thần kinh được tạo ra ở hoặc gần thân tế bào.",
      },
      {
        id: "dendrites",
        name: "Đuôi Gai",
        subtitle: "Nhánh tiếp nhận",
        color: "#7d9bcf",
        attributes: [
          { label: "Hình dạng", value: "Phân nhánh" },
          { label: "Chức năng", value: "Tiếp nhận" },
          { label: "Bề mặt", value: "Thường có gai" },
        ],
        note:
          "Đuôi gai tăng diện tích bề mặt để tiếp nhận tín hiệu từ các tế bào khác.",
        fact: "Một tế bào thần kinh đơn có thể nhận hàng nghìn tín hiệu synapse.",
      },
    ],
  },
  {
    id: "epithelial",
    name: "Tế Bào Biểu Mô",
    type: "Tế Bào Mô Người",
    accent: "#a56d7f",
    accentSoft: "#f4e2e7",
    color: "#d79baa",
    modelKind: "epithelial",
    defaultOrganelle: "microvilli",
    comparison: "animal",
    renderImage: {
      url: "/cell-renders-transparent/epithelial.png",
      aspect: "square",
    },
    occurrence: {
      title: "Da, ruột, đường hô hấp",
      body: "Tế bào biểu mô tạo thành các lớp bảo vệ và bề mặt hấp thụ trên khắp cơ thể.",
      motif: "surface",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#e6a4bd", pattern: "tissue-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#cb72a4", pattern: "tissue-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#989899", pattern: "electron" },
    ],
    organelles: [
      {
        id: "microvilli",
        name: "Vi Nhung Mao",
        subtitle: "Bàn chải hấp thụ",
        color: "#c86f80",
        attributes: [
          { label: "Chiều dài", value: "0,5 đến 1 µm" },
          { label: "Vị trí", value: "Bề mặt đỉnh" },
          { label: "Chức năng", value: "Diện tích bề mặt" },
        ],
        note:
          "Vi nhung mao tăng diện tích bề mặt để hấp thụ và bài tiết dọc theo các lớp biểu mô.",
        fact: "Vi nhung mao ruột tạo thành viền bàn chải dày đặc.",
      },
      {
        id: "junctions",
        name: "Mối Nối Chặt",
        subtitle: "Đường nối kín",
        color: "#9f6cbd",
        attributes: [
          { label: "Vị trí", value: "Giữa các tế bào" },
          { label: "Chức năng", value: "Hàng rào" },
          { label: "Khả năng quan sát", value: "Ưu tiên kính hiển vi điện tử" },
        ],
        note:
          "Mối nối chặt liên kết các tế bào biểu mô kề nhau và kiểm soát những gì đi qua giữa chúng.",
        fact: "Hàng rào biểu mô rất quan trọng cho ranh giới các cơ quan.",
      },
      {
        id: "nucleus",
        name: "Nhân Tế Bào",
        subtitle: "Kho lưu trữ hướng dẫn",
        color: "#7a4aa2",
        attributes: [
          { label: "Vị trí", value: "Đáy đến trung tâm" },
          { label: "Hình dạng", value: "Hình bầu dục" },
          { label: "Thấy được trong KHV quang học", value: "Có" },
        ],
        note:
          "Nhân tế bào biểu mô lưu trữ thông tin di truyền và thay đổi vị trí tùy theo hình dạng mô.",
        fact: "Hình dạng nhân giúp các nhà bệnh lý học đọc mẫu mô.",
      },
    ],
  },
  {
    id: "bacteria",
    name: "Tế Bào Vi Khuẩn",
    type: "Tế Bào Nhân Sơ",
    accent: "#48a77d",
    accentSoft: "#dbf1e7",
    color: "#65b8ae",
    modelKind: "bacteria",
    defaultOrganelle: "nucleoid",
    comparison: "animal",
    renderImage: {
      url: "/cell-renders-transparent/bacteria.png",
      aspect: "landscape",
    },
    modelAsset: {
      url: "/models/bacteria-wall-nih.glb",
      previewUrl: "/nih-previews/bacteria-wall-nih.png",
      sourceLabel: "NIH 3D Gram Positive Cell Wall",
      sourceUrl: "https://3d.nih.gov/entries/3DPX-010752/2",
      scale: 0.00185,
      rotation: [0.08, -0.44, -0.08],
      position: [0, -0.1, 0],
      exposure: 1.1,
    },
    occurrence: {
      title: "Đất, nước, đường ruột, da",
      body: "Vi khuẩn sống trong hầu hết mọi môi trường và có thể tồn tại như các tế bào đơn độc lập.",
      motif: "microbe",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#c7b8eb", pattern: "bacteria-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#dc6e96", pattern: "bacteria-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#8c8c8c", pattern: "electron" },
    ],
    organelles: [
      {
        id: "nucleoid",
        name: "Vùng Nhân",
        subtitle: "Hệ gen trần",
        color: "#7a43ad",
        attributes: [
          { label: "Kích thước", value: "Khoảng vùng 1 µm" },
          { label: "Màng", value: "Không có" },
          { label: "Thấy được trong KHV quang học", value: "Không, chỉ kính hiển vi điện tử" },
        ],
        note:
          "Không giống như tế bào nhân thực, vi khuẩn không có lớp vỏ nhân. ADN của chúng nổi trong vùng tế bào chất gọi là vùng nhân.",
        fact: "Có nhiều tế bào vi khuẩn trong cơ thể bạn hơn nhiều người nghĩ.",
      },
      {
        id: "cellWall",
        name: "Thành Tế Bào",
        subtitle: "Lớp vỏ bảo vệ",
        color: "#55aa89",
        attributes: [
          { label: "Vật liệu", value: "Peptidoglycan" },
          { label: "Chức năng", value: "Hình dạng và phòng thủ" },
          { label: "Vị trí", value: "Ngoài màng" },
        ],
        note:
          "Thành tế bào vi khuẩn giúp tế bào chống lại áp suất và tạo ra hình dạng đặc trưng cho nhiều loài.",
        fact: "Nhuộm Gram tiết lộ sự khác biệt trong cấu trúc thành vi khuẩn.",
      },
      {
        id: "flagellum",
        name: "Roi Vi Khuẩn",
        subtitle: "Đuôi bơi",
        color: "#b87438",
        attributes: [
          { label: "Chức năng", value: "Di chuyển" },
          { label: "Hình dạng", value: "Sợi xoắn ốc" },
          { label: "Thấy được trong KHV quang học", value: "Thuốc nhuộm đặc biệt" },
        ],
        note:
          "Một số vi khuẩn quay roi như những động cơ nhỏ để di chuyển qua môi trường lỏng.",
        fact: "Roi vi khuẩn được cấp năng lượng bởi gradient ion.",
      },
    ],
  },
  {
    id: "animal",
    name: "Tế Bào Động Vật",
    type: "Tế Bào Nhân Thực",
    accent: "#9b74b7",
    accentSoft: "#efe5f6",
    color: "#9db6dc",
    modelKind: "animal",
    defaultOrganelle: "mitochondrion",
    comparison: "plant",
    renderImage: {
      url: "/cell-renders-transparent/animal.png",
      aspect: "square",
    },
    modelAsset: {
      url: "/models/animal-cell-nih.glb",
      previewUrl: "/nih-previews/animal-cell-nih.png",
      sourceLabel: "NIH 3D Animal Cell",
      sourceUrl: "https://3d.nih.gov/entries/3DPX-015797/2",
      scale: 0.044,
      rotation: [0.24, -0.08, 0.03],
      position: [0, -0.03, 0],
      exposure: 1.12,
    },
    occurrence: {
      title: "Mô động vật",
      body: "Tế bào động vật tạo thành các mô linh hoạt với màng, bào quan bên trong và các cấu trúc truyền tín hiệu chuyên biệt.",
      motif: "animal",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#d9a7c7", pattern: "animal-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#b889da", pattern: "animal-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#8b8b8d", pattern: "electron" },
    ],
    organelles: [
      {
        id: "mitochondrion",
        name: "Ti Thể",
        subtitle: "Bộ chuyển đổi năng lượng",
        color: "#cf6f42",
        attributes: [
          { label: "Chiều dài", value: "1 đến 10 µm" },
          { label: "Màng", value: "Kép" },
          { label: "Chức năng", value: "Sản xuất ATP" },
        ],
        note:
          "Ti thể chuyển đổi phân tử nhiên liệu thành năng lượng tế bào có thể sử dụng qua các màng trong gấp lại.",
        fact: "Ti thể chứa hệ gen ADN nhỏ riêng của chúng.",
      },
      {
        id: "nucleus",
        name: "Nhân Tế Bào",
        subtitle: "Phòng điều khiển",
        color: "#7a49b0",
        attributes: [
          { label: "Hình dạng", value: "Tròn" },
          { label: "Màng", value: "Kép" },
          { label: "Thấy được trong KHV quang học", value: "Có" },
        ],
        note:
          "Nhân tế bào lưu trữ nhiễm sắc thể và điều chỉnh các gen nào hoạt động trong tế bào.",
        fact: "Không phải tất cả tế bào động vật đều có nhân. Hồng cầu trưởng thành mất nhân của chúng.",
      },
      {
        id: "golgi",
        name: "Bộ Máy Golgi",
        subtitle: "Chồng đóng gói",
        color: "#d49057",
        attributes: [
          { label: "Hình dạng", value: "Các chồng dẹt" },
          { label: "Chức năng", value: "Biến đổi và phân loại" },
          { label: "Vị trí", value: "Gần nhân" },
        ],
        note:
          "Bộ máy Golgi biến đổi, phân loại và vận chuyển protein và lipid đến đích.",
        fact: "Tế bào tiết thường có bộ máy Golgi nổi bật.",
      },
    ],
  },
  {
    id: "muscle",
    name: "Tế Bào Cơ",
    type: "Sợi Cơ",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#ca6678",
    modelKind: "muscle",
    defaultOrganelle: "myofibril",
    comparison: "neuron",
    renderImage: {
      url: "/cell-renders-transparent/muscle.png",
      aspect: "wide",
    },
    occurrence: {
      title: "Cơ xương",
      body: "Sợi cơ chứa các bó co rút lặp đi lặp lại rút ngắn để tạo ra lực.",
      motif: "muscle",
    },
    microscope: [
      { label: "Kính Hiển Vi Quang Học", tone: "#ef9aab", pattern: "muscle-light" },
      { label: "Mẫu Nhuộm Màu", tone: "#c7508d", pattern: "muscle-stain" },
      { label: "Kính Hiển Vi Điện Tử", tone: "#8d8d8d", pattern: "electron" },
    ],
    organelles: [
      {
        id: "myofibril",
        name: "Tơ Cơ",
        subtitle: "Sợi co rút",
        color: "#bd3d51",
        attributes: [
          { label: "Đường kính", value: "Khoảng 1 µm" },
          { label: "Cấu trúc", value: "Các bó vân" },
          { label: "Thấy được trong KHV quang học", value: "Có, dạng dải" },
        ],
        note:
          "Mỗi sợi cơ chứa hàng trăm đến hàng nghìn tơ cơ chạy suốt chiều dài, được đóng gói chặt chẽ với nhau.",
        fact: "Một sợi cơ đơn có thể dài đến 30 cm.",
      },
      {
        id: "sarcolemma",
        name: "Màng Tế Bào Cơ",
        subtitle: "Màng kích thích",
        color: "#d7b284",
        attributes: [
          { label: "Vị trí", value: "Bề mặt ngoài" },
          { label: "Chức năng", value: "Lan truyền tín hiệu" },
          { label: "Loại", value: "Màng tế bào" },
        ],
        note:
          "Màng tế bào cơ dẫn truyền tín hiệu điện kích hoạt co rút trong toàn bộ sợi cơ.",
        fact: "Tín hiệu màng đi sâu vào sợi cơ qua ống T.",
      },
      {
        id: "mitochondria",
        name: "Ti Thể",
        subtitle: "Nguồn cung sức bền",
        color: "#cf7042",
        attributes: [
          { label: "Chức năng", value: "Cung cấp năng lượng" },
          { label: "Vị trí", value: "Giữa các sợi" },
          { label: "Mật độ", value: "Phụ thuộc hoạt động" },
        ],
        note:
          "Tế bào cơ cần nhiều ti thể vì co rút tiêu thụ lượng lớn ATP.",
        fact: "Tập luyện sức bền có thể tăng mật độ ti thể.",
      },
    ],
  },
];

export function getCellById(id: string) {
  return cells.find((cell) => cell.id === id) ?? cells[0];
}
