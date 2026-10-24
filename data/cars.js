const cars = [
  {
    id: "1",
    slug: "porsche-911-carrera",
    brand: "Porsche",
    model: "911 Carrera S",
    type: "sports",
    pricePerDay: 380,
    transmission: "automatic",
    fuelType: "petrol",
    seats: 2,
    year: 2024,
    mileage: "3,200 km",
    engine: "3.0L Twin-Turbo Flat-Six, 450 hp",
    topSpeed: "308 km/h",
    acceleration: "3.5s 0–100 km/h",
    description: "The Porsche 911 Carrera S is an icon of precision engineering.",
    features: ["PASM Suspension", "Sport Chrono", "Bose Audio", "LED Matrix"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4",
    isFeatured: true,
    available: true,
    badge: "Most Popular",
    rating: 4.9,
    colors: [
      {
        name: "Shark Blue",
        hex: "#0062a3",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
          "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&q=80",
          "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1200&q=80"
        ]
      },
      {
        name: "Guards Red",
        hex: "#d5001c",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=1200&q=80",
          "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&q=80",
          "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1200&q=80"
        ]
      },
      {
        name: "Jet Black",
        hex: "#000000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1611245789456-c2eb8cbf5e7a?w=1200&q=80",
          "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&q=80",
          "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1200&q=80"
        ]
      },
      {
        name: "Racing Yellow",
        hex: "#ffcc00",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
          "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&q=80",
          "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "mercedes-amg-gt63",
    brand: "Mercedes-AMG",
    model: "GT 63 S",
    type: "luxury",
    pricePerDay: 420,
    transmission: "automatic",
    seats: 4,
    year: 2024,
    description: "The AMG GT 63 S merges supercar performance with executive luxury.",
    image: "/mercedes_gt63_red_front.png",
    video: "https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4",
    isFeatured: true,
    available: true,
    badge: "New Arrival",
    rating: 4.9,
    colors: [
      {
        name: "Jupiter Red",
        hex: "#8b0000",
        filter: "none",
        gallery: [
          "/mercedes_gt63_red_front.png",
          "/mercedes_gt63_red_rear.png",
          "/mercedes_gt63_red_interior.png"
        ]
      },
      {
        name: "Magno Grey",
        hex: "#3e4144",
        filter: "none",
        gallery: [
          "/mercedes_gt63_grey_front.png",
          "/mercedes_gt63_red_rear.png",
          "/mercedes_gt63_red_interior.png"
        ]
      },
      {
        name: "Obsidian Black",
        hex: "#0a0a0a",
        filter: "none",
        gallery: [
          "/mercedes_gt63_black_front.png",
          "/mercedes_gt63_red_rear.png",
          "/mercedes_gt63_red_interior.png"
        ]
      },
      {
        name: "Polar White",
        hex: "#ffffff",
        filter: "none",
        gallery: [
          "/mercedes_gt63_white_front.png",
          "/mercedes_gt63_red_rear.png",
          "/mercedes_gt63_red_interior.png"
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "bmw-m5-competition",
    brand: "BMW",
    model: "M5 Competition",
    type: "luxury",
    pricePerDay: 350,
    transmission: "automatic",
    seats: 5,
    year: 2024,
    description: "The M5 Competition is the ultimate performance sedan.",
    image: "/bmw_m5_front_34_1778958277651.png",
    video: "https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4",
    isFeatured: true,
    available: true,
    rating: 4.8,
    colors: [
      {
        name: "Marina Bay Blue",
        hex: "#2b4b7c",
        filter: "none",
        gallery: [
          "/bmw_m5_front_34_1778958277651.png",
          "/bmw_m5_side_profile_1778958636326.png",
          "/bmw_m5_rear_34_1778958651976.png"
        ]
      },
      {
        name: "Deep Grey Magno",
        hex: "#4a4a4a",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
          "/bmw_m5_side_profile_1778958636326.png",
          "/bmw_m5_rear_34_1778958651976.png"
        ]
      },
      {
        name: "Isle of Man Green",
        hex: "#004d3d",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1200&q=80",
          "/bmw_m5_side_profile_1778958636326.png",
          "/bmw_m5_rear_34_1778958651976.png"
        ]
      },
      {
        name: "Alpine White",
        hex: "#ffffff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
          "/bmw_m5_side_profile_1778958636326.png",
          "/bmw_m5_rear_34_1778958651976.png"
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "lamborghini-huracan-evo",
    brand: "Lamborghini",
    model: "Huracán EVO",
    type: "sports",
    pricePerDay: 950,
    seats: 2,
    year: 2023,
    image: "/huracan_evo_front_orange_1778961306219.png",
    video: "https://videos.pexels.com/video-files/4006151/4006151-hd_1920_1080_25fps.mp4",
    isFeatured: true,
    available: true,
    rating: 4.9,
    colors: [
      {
        name: "Arancio Xanto",
        hex: "#ff6a00",
        filter: "none",
        gallery: [
          "/huracan_evo_front_orange_1778961306219.png",
          "/huracan_evo_side_orange_1778961352209.png",
          "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80"
        ]
      },
      {
        name: "Verde Mantis",
        hex: "#43c018",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
          "/huracan_evo_side_orange_1778961352209.png",
          "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80"
        ]
      },
      {
        name: "Giallo Belenus",
        hex: "#ffee00",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
          "/huracan_evo_side_orange_1778961352209.png",
          "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80"
        ]
      },
      {
        name: "Nero Noctis",
        hex: "#000000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1611245789456-c2eb8cbf5e7a?w=1200&q=80",
          "/huracan_evo_side_orange_1778961352209.png",
          "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "range-rover-autobiography",
    brand: "Range Rover",
    model: "Autobiography",
    type: "suv",
    pricePerDay: 320,
    seats: 5,
    year: 2024,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/3141208/3141208-hd_1920_1080_25fps.mp4",
    isFeatured: true,
    available: true,
    rating: 4.8,
    colors: [
      {
        name: "Santorini Black",
        hex: "#000000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "6",
    slug: "tesla-model-s-plaid",
    brand: "Tesla",
    model: "Model S Plaid",
    type: "luxury",
    pricePerDay: 280,
    seats: 5,
    year: 2024,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    rating: 4.7,
    colors: [
      {
        name: "Stealth Grey",
        hex: "#4a4a4a",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80",
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
          "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80"
        ]
      },
      {
        name: "Solid Black",
        hex: "#0c0c0c",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1571127236894-93c0029b39d4?w=1200&q=80",
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
          "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80"
        ]
      },
      {
        name: "Ultra Red",
        hex: "#8b0000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1541565907959-43d95a3b638f?w=1200&q=80",
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
          "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80"
        ]
      },
      {
        name: "Pearl White",
        hex: "#ffffff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1200&q=80",
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
          "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "7",
    slug: "audi-rs7-sportback",
    brand: "Audi",
    model: "RS7 Sportback",
    type: "luxury",
    pricePerDay: 310,
    seats: 5,
    year: 2024,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    rating: 4.8,
    colors: [
      {
        name: "Nardo Grey",
        hex: "#8e9091",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Mythos Black",
        hex: "#0c0c0c",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Tango Red",
        hex: "#a80000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Glacier White",
        hex: "#ffffff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "8",
    slug: "bentley-continental-gt",
    brand: "Bentley",
    model: "Continental GT",
    type: "luxury",
    pricePerDay: 680,
    seats: 4,
    year: 2023,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4",
    isFeatured: true,
    available: true,
    rating: 4.9,
    colors: [
      {
        name: "British Racing Green",
        hex: "#004225",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
          "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "9",
    slug: "ford-mustang-gt500",
    brand: "Ford",
    model: "Mustang Shelby GT500",
    type: "sports",
    pricePerDay: 220,
    seats: 4,
    year: 2023,
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    rating: 4.8,
    colors: [
      {
        name: "Grabber Blue",
        hex: "#00a1ff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=80",
          "https://images.unsplash.com/photo-1612461081702-86144e070927?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Twister Orange",
        hex: "#ff8c00",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
          "https://images.unsplash.com/photo-1612461081702-86144e070927?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Race Red",
        hex: "#ff0000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
          "https://images.unsplash.com/photo-1612461081702-86144e070927?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Oxford White",
        hex: "#ffffff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
          "https://images.unsplash.com/photo-1612461081702-86144e070927?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "10",
    slug: "toyota-land-cruiser-300",
    brand: "Toyota",
    model: "Land Cruiser 300",
    type: "suv",
    pricePerDay: 195,
    seats: 7,
    year: 2024,
    image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/3141208/3141208-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    rating: 4.7,
    colors: [
      {
        name: "Precious White",
        hex: "#fcfcfc",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Attitude Black",
        hex: "#1a1a1a",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Avant-Garde Bronze",
        hex: "#6a5d4d",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Silver Metallic",
        hex: "#c0c0c0",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "11",
    slug: "volkswagen-golf-gti",
    brand: "Volkswagen",
    model: "Golf GTI Clubsport",
    type: "economy",
    pricePerDay: 89,
    seats: 5,
    year: 2023,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    rating: 4.6,
    colors: [
      {
        name: "Pure White",
        hex: "#ffffff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80",
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Kings Red",
        hex: "#a00000",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Moonstone Grey",
        hex: "#8e9091",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Atlantic Blue",
        hex: "#1e3a5f",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "12",
    slug: "honda-civic-type-r",
    brand: "Honda",
    model: "Civic Type R (FL5)",
    type: "economy",
    pricePerDay: 95,
    seats: 4,
    year: 2024,
    image: "https://images.unsplash.com/photo-1617624991444-2f3b9bf1c25b?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    rating: 4.9,
    colors: [
      {
        name: "Championship White",
        hex: "#fcfcfc",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1617624991444-2f3b9bf1c25b?w=1200&q=80",
          "https://images.unsplash.com/photo-1600706432502-75a0e286b92b?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Rallye Red",
        hex: "#b22222",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1600706432502-75a0e286b92b?w=1200&q=80",
          "https://images.unsplash.com/photo-1600706432502-75a0e286b92b?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Boost Blue",
        hex: "#007bff",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=80",
          "https://images.unsplash.com/photo-1600706432502-75a0e286b92b?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Crystal Black",
        hex: "#0c0c0c",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1571127236894-93c0029b39d4?w=1200&q=80",
          "https://images.unsplash.com/photo-1600706432502-75a0e286b92b?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  },
  {
    id: "13",
    slug: "porsche-cayenne-turbo",
    brand: "Porsche",
    model: "Cayenne Turbo E-Hybrid",
    type: "suv",
    pricePerDay: 340,
    seats: 5,
    year: 2024,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1000&q=80",
    video: "https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4",
    isFeatured: false,
    available: true,
    badge: "Hybrid",
    rating: 4.8,
    colors: [
      {
        name: "Carrara White",
        hex: "#fcfcfc",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Jet Black Metallic",
        hex: "#020202",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Quarzite Grey",
        hex: "#5a5e62",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      },
      {
        name: "Montego Blue",
        hex: "#1e3a5f",
        filter: "none",
        gallery: [
          "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1200&q=80",
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80"
        ]
      }
    ]
  }
];

export default cars;
