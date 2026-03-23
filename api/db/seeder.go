package db

import (
	"api/entity"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedLocations(db *gorm.DB) {
	seedWisata(db)
	seedHealth(db)
	seedHotel(db)
	seedRestoran(db)
	seedPura(db)
}

func seedWisata(db *gorm.DB) {
	var category entity.Category
	if err := db.Where("name = ?", "wisata").First(&category).Error; err != nil {
		log.Println("Category 'wisata' not found, skipping")
		return
	}

	locations := []entity.Location{
		// Bali Selatan & Tengah
		{ID: uuid.NewString(), Name: "Pantai Kuta", Description: "Pantai ikonik Bali yang terkenal dengan ombak surfing, sunset spektakuler, dan suasana pantai yang ramai.", Latitude: -8.7184, Longitude: 115.1686, Address: "Jl. Pantai Kuta, Kuta, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Tanah Lot", Description: "Pura Hindu yang berdiri di atas batu karang di tengah laut. Salah satu pura paling ikonik di Bali.", Latitude: -8.6210, Longitude: 115.0866, Address: "Jl. Raya Tanah Lot, Beraban, Tabanan, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Ubud Monkey Forest", Description: "Hutan alam suci rumah bagi ratusan kera ekor panjang dengan tiga pura di dalamnya.", Latitude: -8.5195, Longitude: 115.2589, Address: "Jl. Monkey Forest, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Tegallalang Rice Terrace", Description: "Sawah terasering menakjubkan dengan sistem irigasi tradisional subak di Ubud.", Latitude: -8.4312, Longitude: 115.2782, Address: "Tegallalang, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Seminyak", Description: "Pantai premium Bali dengan bar tepi pantai, restoran mewah, dan sunset yang romantis.", Latitude: -8.6924, Longitude: 115.1598, Address: "Seminyak, Kuta, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Uluwatu Temple", Description: "Pura di tebing karang 70 meter di ujung selatan Bali. Terkenal dengan tari Kecak saat sunset.", Latitude: -8.8291, Longitude: 115.0849, Address: "Pecatu, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Nusa Dua", Description: "Kawasan pantai eksklusif dengan pasir putih bersih. Cocok untuk berenang dan olahraga air.", Latitude: -8.8006, Longitude: 115.2317, Address: "Nusa Dua, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Danau Beratan Bedugul", Description: "Danau kawah vulkanik dengan Pura Ulun Danu yang mengapung di atas air.", Latitude: -8.2748, Longitude: 115.1677, Address: "Candikuning, Baturiti, Tabanan, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Sanur", Description: "Pantai tenang di sisi timur Bali. Terkenal dengan sunrise indah dan jalur jogging tepi pantai.", Latitude: -8.6868, Longitude: 115.2625, Address: "Sanur, Denpasar Selatan, Denpasar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Padang Padang", Description: "Pantai tersembunyi di balik tebing batu. Populer sebagai lokasi syuting film Eat Pray Love.", Latitude: -8.8106, Longitude: 115.1108, Address: "Pecatu, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Waterbom Bali", Description: "Taman air terbaik di Asia di Kuta dengan wahana Climax, Superbowl, dan kolam renang.", Latitude: -8.7227, Longitude: 115.1739, Address: "Jl. Kartika Plaza, Kuta, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Tirta Empul", Description: "Pura Hindu dengan mata air suci untuk ritual penyucian diri melukat.", Latitude: -8.4153, Longitude: 115.3150, Address: "Manukaya, Tampaksiring, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Gunung Batur", Description: "Gunung berapi aktif destinasi trekking populer. Sunrise spektakuler di atas awan.", Latitude: -8.2421, Longitude: 115.3757, Address: "Kintamani, Bangli, Bali", CategoryID: category.ID},

		// Bali Utara
		{ID: uuid.NewString(), Name: "Pantai Lovina", Description: "Pantai hitam yang tenang di utara Bali, terkenal dengan wisata lumba-lumba liar saat fajar dan snorkeling.", Latitude: -8.1582, Longitude: 115.0257, Address: "Kalibukbuk, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Air Terjun Gitgit", Description: "Air terjun setinggi 35 meter di tengah hutan tropis yang rindang. Salah satu air terjun paling populer di Bali Utara.", Latitude: -8.2124, Longitude: 115.1282, Address: "Gitgit, Sukasada, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Air Terjun Sekumpul", Description: "Kelompok tujuh air terjun tersembunyi di lembah hijau Bali Utara. Dianggap air terjun paling indah di Bali.", Latitude: -8.1574, Longitude: 115.1494, Address: "Sekumpul, Lemukih, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Danau Tamblingan", Description: "Danau sakral yang dikelilingi hutan hujan tropis lebat. Belum terjamah pariwisata massal dengan suasana mistis.", Latitude: -8.2521, Longitude: 115.1102, Address: "Munduk, Banjar, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pemandian Air Panas Banjar", Description: "Pemandian air panas alami dengan kolam bertingkat di tengah kebun kelapa sawit di Bali Utara.", Latitude: -8.1847, Longitude: 114.9874, Address: "Banjar, Buleleng, Bali", CategoryID: category.ID},

		// Bali Barat
		{ID: uuid.NewString(), Name: "Taman Nasional Bali Barat", Description: "Satu-satunya hutan lindung di Bali dengan ekosistem lengkap. Habitat jalak Bali dan berbagai satwa liar.", Latitude: -8.1539, Longitude: 114.5571, Address: "Cekik, Jembrana, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Medewi", Description: "Pantai ombak panjang di Bali Barat, favorit surfer profesional. Suasana tenang dan jauh dari keramaian.", Latitude: -8.3672, Longitude: 114.8459, Address: "Medewi, Pekutatan, Jembrana, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Taman Nasional Bali Barat Pos Sumber Klampok", Description: "Pantai berpasir putih di dalam kawasan Taman Nasional Bali Barat. Tempat bertelur penyu laut.", Latitude: -8.1289, Longitude: 114.5012, Address: "Sumber Klampok, Gerokgak, Buleleng, Bali", CategoryID: category.ID},

		// Bali Timur
		{ID: uuid.NewString(), Name: "Pantai Amed", Description: "Desa nelayan di pantai timur Bali terkenal dengan snorkeling dan diving melihat bangkai kapal USS Liberty.", Latitude: -8.3462, Longitude: 115.6578, Address: "Amed, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Tirtagangga Water Palace", Description: "Taman air kerajaan dengan kolam bertingkat, pancuran air, dan patung Hindu yang indah di Karangasem.", Latitude: -8.4130, Longitude: 115.5847, Address: "Ababi, Abang, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Taman Ujung Soekasada", Description: "Bekas istana air kerajaan Karangasem dengan arsitektur Bali-Eropa yang megah dan kolam besar.", Latitude: -8.4928, Longitude: 115.6123, Address: "Tumbu, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Virgin (Pasir Putih)", Description: "Pantai terpencil dengan pasir putih lembut dan air biru jernih. Masih sepi dan alami di Bali Timur.", Latitude: -8.4814, Longitude: 115.5702, Address: "Bugbug, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Tulamben Dive Site", Description: "Situs penyelaman kelas dunia dengan bangkai kapal USAT Liberty yang dapat dijangkau dari tepi pantai.", Latitude: -8.2932, Longitude: 115.5963, Address: "Tulamben, Kubu, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Candidasa Beach", Description: "Pantai yang tenang di Bali Timur dengan pemandangan laut lepas, cocok untuk diving dan snorkeling.", Latitude: -8.5099, Longitude: 115.5624, Address: "Candidasa, Karangasem, Bali", CategoryID: category.ID},

		// Nusa Penida
		{ID: uuid.NewString(), Name: "Kelingking Beach", Description: "Pantai ikonik Nusa Penida dengan tebing karang berbentuk kepala T-Rex. Salah satu pemandangan paling viral di Indonesia.", Latitude: -8.7479, Longitude: 115.4528, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Angel's Billabong", Description: "Kolam alami di tepi tebing dengan air jernih yang membentuk infinity pool alami menghadap Samudra Hindia.", Latitude: -8.7298, Longitude: 115.4740, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Broken Beach", Description: "Lengkungan batu karang alami yang membentuk jembatan di atas laut dengan kolam alami di dalamnya.", Latitude: -8.7258, Longitude: 115.4698, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Crystal Bay Nusa Penida", Description: "Teluk bening dengan visibilitas air kristal jernih. Lokasi terbaik melihat ikan mola-mola dan snorkeling.", Latitude: -8.7130, Longitude: 115.4392, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pantai Atuh", Description: "Pantai tersembunyi di sisi timur Nusa Penida dengan bebatuan karang unik dan air berwarna toska.", Latitude: -8.7798, Longitude: 115.5408, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Diamond Beach", Description: "Pantai mewah di Nusa Penida dengan pasir putih murni dan bebatuan karang yang menjulang. Akses melalui tangga di tebing.", Latitude: -8.7805, Longitude: 115.5434, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Manta Point Nusa Penida", Description: "Lokasi menyelam dan snorkeling bersama pari manta raksasa. Salah satu spot diving terbaik di dunia.", Latitude: -8.7696, Longitude: 115.4282, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
	}
	seedBatch(db, locations)
}

func seedHealth(db *gorm.DB) {
	var category entity.Category
	if err := db.Where("name = ?", "health").First(&category).Error; err != nil {
		log.Println("Category 'health' not found, skipping")
		return
	}

	locations := []entity.Location{
		// Bali Selatan & Tengah
		{ID: uuid.NewString(), Name: "RSUP Sanglah", Description: "Rumah sakit umum pusat terbesar di Bali dan rujukan utama untuk Nusa Tenggara.", Latitude: -8.6726, Longitude: 115.2131, Address: "Jl. Diponegoro, Denpasar Barat, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "BIMC Hospital Kuta", Description: "Rumah sakit internasional melayani wisatawan dan ekspatriat dengan dokter berbahasa Inggris 24 jam.", Latitude: -8.7253, Longitude: 115.1740, Address: "Jl. By Pass Ngurah Rai No.100X, Kuta, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "RS Kasih Ibu", Description: "Rumah sakit swasta di Denpasar dengan pelayanan lengkap termasuk IGD, rawat inap, dan berbagai poli spesialis.", Latitude: -8.6596, Longitude: 115.2178, Address: "Jl. Teuku Umar No.120, Denpasar Barat, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "BIMC Hospital Nusa Dua", Description: "Cabang BIMC di kawasan Nusa Dua melayani wisatawan dengan standar internasional.", Latitude: -8.7939, Longitude: 115.2268, Address: "BTDC Area Lot 2, Nusa Dua, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "RS Prima Medika", Description: "Rumah sakit swasta modern di Denpasar dengan layanan kesehatan komprehensif.", Latitude: -8.6452, Longitude: 115.2191, Address: "Jl. Pulau Serangan No.9, Denpasar Utara, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Klinik Ubud Clinic", Description: "Klinik kesehatan di jantung Ubud melayani wisatawan dan warga lokal dengan dokter umum.", Latitude: -8.5069, Longitude: 115.2624, Address: "Jl. Raya Campuhan, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "RS Siloam Denpasar", Description: "Rumah sakit jaringan Siloam dengan fasilitas modern dan layanan kesehatan berstandar internasional.", Latitude: -8.6691, Longitude: 115.2107, Address: "Jl. Sunset Road No.818, Kuta, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Bali Royal Hospital", Description: "Rumah sakit swasta premium di Denpasar dengan layanan bedah, rawat inap, dan ICU.", Latitude: -8.6674, Longitude: 115.2294, Address: "Jl. Letda Tantular No.6, Renon, Denpasar, Bali", CategoryID: category.ID},

		// Bali Utara
		{ID: uuid.NewString(), Name: "RSUD Buleleng Singaraja", Description: "Rumah sakit umum daerah terbesar di Bali Utara yang melayani masyarakat Singaraja dan sekitarnya.", Latitude: -8.1127, Longitude: 115.0896, Address: "Jl. Ngurah Rai No.30, Singaraja, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "RS Kertha Usada Singaraja", Description: "Rumah sakit swasta di Singaraja dengan fasilitas lengkap dan dokter spesialis untuk warga Bali Utara.", Latitude: -8.1152, Longitude: 115.0923, Address: "Jl. Ngurah Rai, Singaraja, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Puskesmas Lovina", Description: "Pusat kesehatan masyarakat yang melayani wisatawan dan warga sekitar kawasan wisata Lovina.", Latitude: -8.1590, Longitude: 115.0249, Address: "Kalibukbuk, Buleleng, Bali", CategoryID: category.ID},

		// Bali Barat
		{ID: uuid.NewString(), Name: "RSUD Negara Jembrana", Description: "Rumah sakit umum daerah di Negara, Jembrana. Pusat layanan kesehatan utama untuk masyarakat Bali Barat.", Latitude: -8.3563, Longitude: 114.6251, Address: "Jl. Wijaya Kusuma, Negara, Jembrana, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Puskesmas Gilimanuk", Description: "Puskesmas di pintu gerbang Bali yang melayani penumpang penyeberangan dan warga sekitar Gilimanuk.", Latitude: -8.1703, Longitude: 114.4468, Address: "Gilimanuk, Melaya, Jembrana, Bali", CategoryID: category.ID},

		// Bali Timur
		{ID: uuid.NewString(), Name: "RSUD Karangasem", Description: "Rumah sakit umum daerah di Karangasem yang melayani masyarakat Bali Timur dan wisatawan di Amed-Candidasa.", Latitude: -8.4519, Longitude: 115.6102, Address: "Jl. Ngurah Rai, Amlapura, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Klinik Candidasa", Description: "Klinik kesehatan di kawasan wisata Candidasa melayani wisatawan yang membutuhkan penanganan medis cepat.", Latitude: -8.5089, Longitude: 115.5611, Address: "Candidasa, Karangasem, Bali", CategoryID: category.ID},

		// Nusa Penida
		{ID: uuid.NewString(), Name: "Puskesmas Nusa Penida", Description: "Pusat kesehatan masyarakat utama di Nusa Penida. Satu-satunya fasilitas kesehatan terdekat di pulau ini.", Latitude: -8.7285, Longitude: 115.5442, Address: "Sampalan, Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
	}
	seedBatch(db, locations)
}

func seedHotel(db *gorm.DB) {
	var category entity.Category
	if err := db.Where("name = ?", "hotel").First(&category).Error; err != nil {
		log.Println("Category 'hotel' not found, skipping")
		return
	}

	locations := []entity.Location{
		// Bali Selatan & Tengah
		{ID: uuid.NewString(), Name: "The Mulia Bali", Description: "Resort mewah bintang 5 di Nusa Dua dengan pantai privat, kolam renang infinity, dan spa kelas dunia.", Latitude: -8.7927, Longitude: 115.2298, Address: "Jl. Raya Nusa Dua Selatan, Nusa Dua, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "COMO Uma Ubud", Description: "Resort butik mewah di tengah hutan Ubud menawarkan retreat spa, yoga, dan pemandangan sawah terasering.", Latitude: -8.5063, Longitude: 115.2551, Address: "Jl. Raya Sanggingan, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Alila Villas Uluwatu", Description: "Villa mewah di tebing Uluwatu dengan pemandangan Samudra Hindia dan infinity pool.", Latitude: -8.8167, Longitude: 115.0884, Address: "Jl. Belimbing Sari, Pecatu, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Four Seasons Jimbaran", Description: "Resort bintang 5 di tepi pantai Jimbaran dengan villa berkolam renang pribadi.", Latitude: -8.7717, Longitude: 115.1621, Address: "Jimbaran, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "W Bali Seminyak", Description: "Hotel trendi bintang 5 di jantung Seminyak dengan beach club, spa WET, dan kolam renang spektakuler.", Latitude: -8.6896, Longitude: 115.1589, Address: "Jl. Petitenget, Seminyak, Kuta Utara, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Hanging Gardens of Bali", Description: "Resort ikonik di Ubud dengan kolam renang bertingkat menghadap hutan hujan tropis dan Sungai Ayung.", Latitude: -8.4752, Longitude: 115.2499, Address: "Desa Buahan, Payangan, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Ayana Resort Jimbaran", Description: "Resort mewah dengan Rock Bar di tepi tebing karang, spa AYANA, dan berbagai restoran premium.", Latitude: -8.7793, Longitude: 115.1540, Address: "Jl. Karang Mas Sejahtera, Jimbaran, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Legian Beach Hotel", Description: "Hotel bintang 4 di tepi Pantai Legian yang populer dengan harga terjangkau dan akses langsung ke pantai.", Latitude: -8.7039, Longitude: 115.1659, Address: "Jl. Melasti, Legian, Kuta, Badung, Bali", CategoryID: category.ID},

		// Bali Utara
		{ID: uuid.NewString(), Name: "Damai Lovina Villas", Description: "Resort organik premium di perbukitan Lovina dengan pemandangan laut 180 derajat dan restoran farm-to-table.", Latitude: -8.1456, Longitude: 115.0187, Address: "Kayuputih, Sukasada, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Hotel Aneka Lovina", Description: "Hotel bintang 3 populer di Lovina dengan kolam renang, akses pantai, dan paket wisata lumba-lumba.", Latitude: -8.1598, Longitude: 115.0264, Address: "Kalibukbuk, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Puri Bagus Lovina", Description: "Resort tepi pantai di Lovina dengan cottage tradisional Bali, kolam renang, dan suasana tenang.", Latitude: -8.1621, Longitude: 115.0289, Address: "Lovina, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Munduk Moding Plantation", Description: "Resort perkebunan kopi di dataran tinggi Munduk dengan pemandangan sawah, danau, dan hutan dari ketinggian.", Latitude: -8.2698, Longitude: 115.1021, Address: "Munduk, Banjar, Buleleng, Bali", CategoryID: category.ID},

		// Bali Barat
		{ID: uuid.NewString(), Name: "Menjangan Dynasty Resort", Description: "Resort eksklusif di tepi Taman Nasional Bali Barat dengan akses snorkeling ke Pulau Menjangan.", Latitude: -8.1178, Longitude: 114.5024, Address: "Banyuwedang, Gerokgak, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Medewi Beach Retreat", Description: "Penginapan sederhana di Pantai Medewi, favorit peselancar yang mencari ombak di Bali Barat.", Latitude: -8.3685, Longitude: 114.8473, Address: "Medewi, Pekutatan, Jembrana, Bali", CategoryID: category.ID},

		// Bali Timur
		{ID: uuid.NewString(), Name: "Amankila Resort", Description: "Resort mewah eksklusif di tebing menghadap Selat Lombok dengan kolam renang bertingkat dan pantai privat.", Latitude: -8.5214, Longitude: 115.5581, Address: "Manggis, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "The Reef Bali Amed", Description: "Boutique resort di Amed dengan akses langsung ke spot diving, bungalow tepi laut, dan restoran seafood.", Latitude: -8.3474, Longitude: 115.6591, Address: "Amed, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Lotus Bungalows Candidasa", Description: "Bungalow nyaman di Candidasa dengan pemandangan laguna dan kolam air tawar. Akses mudah ke diving spot.", Latitude: -8.5104, Longitude: 115.5634, Address: "Candidasa, Karangasem, Bali", CategoryID: category.ID},

		// Nusa Penida
		{ID: uuid.NewString(), Name: "Semabu Hills Nusa Penida", Description: "Penginapan di bukit Nusa Penida dengan pemandangan panoramik menakjubkan ke Gunung Agung dan laut.", Latitude: -8.7248, Longitude: 115.5396, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Adiwana Warnakali Nusa Penida", Description: "Resort eksklusif di tebing Nusa Penida dengan villa berkolam renang privat dan pemandangan laut yang spektakuler.", Latitude: -8.7423, Longitude: 115.4591, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
	}
	seedBatch(db, locations)
}

func seedRestoran(db *gorm.DB) {
	var category entity.Category
	if err := db.Where("name = ?", "restoran").First(&category).Error; err != nil {
		log.Println("Category 'restoran' not found, skipping")
		return
	}

	locations := []entity.Location{
		// Bali Selatan & Tengah
		{ID: uuid.NewString(), Name: "Locavore", Description: "Restoran fine dining ikonik di Ubud dengan konsep farm-to-table menggunakan bahan lokal segar dari petani Bali.", Latitude: -8.5066, Longitude: 115.2630, Address: "Jl. Dewi Sita No.17, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Mozaic Restaurant", Description: "Restoran mewah di Ubud yang menggabungkan teknik masak Perancis dengan cita rasa Asia.", Latitude: -8.5021, Longitude: 115.2589, Address: "Jl. Raya Sanggingan, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Merah Putih", Description: "Restoran modern Indonesia di Seminyak yang menyajikan masakan tradisional nusantara dengan presentasi kontemporer.", Latitude: -8.6862, Longitude: 115.1624, Address: "Jl. Petitenget No.100X, Seminyak, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Naughty Nuri's Warung", Description: "Warung legendaris di Ubud yang terkenal dengan BBQ ribs, babi guling, dan cocktail sejak 1995.", Latitude: -8.5027, Longitude: 115.2594, Address: "Jl. Raya Sanggingan, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Jimbaran Bay Seafood", Description: "Deretan warung seafood di tepi Pantai Jimbaran. Makan malam dengan kaki di pasir sambil menikmati sunset.", Latitude: -8.7748, Longitude: 115.1607, Address: "Pantai Jimbaran, Jimbaran, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Warung Babi Guling Ibu Oka", Description: "Warung babi guling paling terkenal di Bali. Direkomendasikan oleh Anthony Bourdain.", Latitude: -8.5067, Longitude: 115.2638, Address: "Jl. Tegal Sari No.2, Ubud, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "KU DE TA", Description: "Beach club dan restoran ikonik di Seminyak terkenal dengan sunset views, cocktail premium, dan musik DJ.", Latitude: -8.6887, Longitude: 115.1591, Address: "Jl. Kayu Aya No.9, Seminyak, Kuta Utara, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Bambu Restaurant Seminyak", Description: "Restoran masakan Indonesia dan Bali di Seminyak. Terkenal dengan rijsttafel Bali dan kelas memasak.", Latitude: -8.6903, Longitude: 115.1634, Address: "Jl. Oberoi, Seminyak, Kuta Utara, Badung, Bali", CategoryID: category.ID},

		// Bali Utara
		{ID: uuid.NewString(), Name: "Warung Bambu Lovina", Description: "Warung tradisional di Lovina yang menyajikan masakan Bali autentik dan seafood segar dengan harga lokal.", Latitude: -8.1597, Longitude: 115.0259, Address: "Kalibukbuk, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Sea Breeze Cafe Lovina", Description: "Kafe tepi pantai di Lovina dengan menu internasional dan Indonesia. Tempat nongkrong saat matahari terbenam.", Latitude: -8.1611, Longitude: 115.0272, Address: "Lovina Beach, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Damai Restaurant Lovina", Description: "Restoran farm-to-table premium di perbukitan Lovina dengan pemandangan laut. Menu menggunakan bahan dari kebun sendiri.", Latitude: -8.1461, Longitude: 115.0191, Address: "Kayuputih, Sukasada, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Warung Mina Lovina", Description: "Warung seafood legendaris di Singaraja yang terkenal dengan ikan bakar dan nasi campur Bali Utara.", Latitude: -8.1124, Longitude: 115.0891, Address: "Singaraja, Buleleng, Bali", CategoryID: category.ID},

		// Bali Barat
		{ID: uuid.NewString(), Name: "Warung Satria Negara", Description: "Warung makan lokal di Negara yang terkenal dengan masakan khas Jembrana seperti sate lilit dan lindung goreng.", Latitude: -8.3549, Longitude: 114.6235, Address: "Negara, Jembrana, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Medewi Surf Cafe", Description: "Kafe santai di Pantai Medewi dengan menu sederhana dan suasana surfer yang rileks.", Latitude: -8.3680, Longitude: 114.8467, Address: "Medewi, Pekutatan, Jembrana, Bali", CategoryID: category.ID},

		// Bali Timur
		{ID: uuid.NewString(), Name: "Warung Telaga Candidasa", Description: "Warung tepi danau di Candidasa yang menyajikan masakan Bali segar dengan suasana tenang dan alami.", Latitude: -8.5091, Longitude: 115.5619, Address: "Candidasa, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Sama Sama Reggae Bar Amed", Description: "Bar dan restoran di Amed yang terkenal di kalangan penyelam dengan seafood segar dan suasana santai.", Latitude: -8.3469, Longitude: 115.6582, Address: "Amed, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Tirta Ayu Restaurant", Description: "Restoran di dalam kompleks Tirtagangga Water Palace dengan menu Bali-Indonesia di tepi kolam air kerajaan.", Latitude: -8.4133, Longitude: 115.5851, Address: "Tirtagangga, Abang, Karangasem, Bali", CategoryID: category.ID},

		// Nusa Penida
		{ID: uuid.NewString(), Name: "Warung Bu Wayan Nusa Penida", Description: "Warung lokal paling populer di Nusa Penida yang menyajikan nasi campur khas pulau dan ikan segar.", Latitude: -8.7289, Longitude: 115.5436, Address: "Sampalan, Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Penida Colada Beach Bar", Description: "Beach bar santai di Nusa Penida dengan cocktail segar dan menu ringan menghadap laut biru jernih.", Latitude: -8.7142, Longitude: 115.4398, Address: "Crystal Bay, Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
	}
	seedBatch(db, locations)
}

func seedPura(db *gorm.DB) {
	var category entity.Category
	if err := db.Where("name = ?", "pura").First(&category).Error; err != nil {
		log.Println("Category 'pura' not found, skipping")
		return
	}

	locations := []entity.Location{
		// Bali Selatan & Tengah
		{ID: uuid.NewString(), Name: "Pura Besakih", Description: "Pura terbesar dan paling suci di Bali di lereng Gunung Agung. Dikenal sebagai Pura Ibu Bali.", Latitude: -8.3743, Longitude: 115.4517, Address: "Besakih, Rendang, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Tanah Lot", Description: "Pura Hindu ikonik di atas batu karang di tengah laut. Paling difoto saat matahari terbenam.", Latitude: -8.6210, Longitude: 115.0866, Address: "Beraban, Kediri, Tabanan, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Uluwatu", Description: "Pura di tebing karang setinggi 70 meter di ujung selatan Bali. Salah satu Sad Kahyangan Bali.", Latitude: -8.8291, Longitude: 115.0849, Address: "Pecatu, Kuta Selatan, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Tirta Empul", Description: "Pura dengan mata air suci untuk ritual melukat, dibangun tahun 962 M di Tampaksiring.", Latitude: -8.4153, Longitude: 115.3150, Address: "Manukaya, Tampaksiring, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Ulun Danu Beratan", Description: "Pura yang tampak mengapung di Danau Beratan Bedugul. Didedikasikan untuk Dewi Danu.", Latitude: -8.2748, Longitude: 115.1677, Address: "Candikuning, Baturiti, Tabanan, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Taman Ayun", Description: "Pura kerajaan Mengwi yang dikelilingi kolam. Dibangun tahun 1634 dan masuk Warisan Budaya Dunia UNESCO.", Latitude: -8.5424, Longitude: 115.1757, Address: "Mengwi, Badung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Gunung Kawi", Description: "Kompleks candi purbakala abad ke-11 yang dipahat langsung dari tebing batu di lembah Sungai Pakerisan.", Latitude: -8.4197, Longitude: 115.3122, Address: "Tampaksiring, Gianyar, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Kehen", Description: "Pura kerajaan Bangli yang megah dengan gapura bertingkat, pohon beringin raksasa, dan relief indah.", Latitude: -8.4443, Longitude: 115.3566, Address: "Cempaga, Bangli, Bali", CategoryID: category.ID},

		// Bali Utara
		{ID: uuid.NewString(), Name: "Pura Maduwe Karang", Description: "Pura unik di Bali Utara yang terkenal dengan ukiran relief sepeda kuno pada dindingnya. Dibangun tahun 1890.", Latitude: -8.0851, Longitude: 115.1693, Address: "Kubutambahan, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Pulaki", Description: "Pura suci di tepi pantai Bali Utara yang dikelilingi ratusan monyet. Terletak di antara dua tebing laut.", Latitude: -8.1649, Longitude: 114.7842, Address: "Banyupoh, Gerokgak, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Ponjok Batu", Description: "Pura yang menjorok ke laut di ujung tebing Bali Utara. Salah satu pura tepi laut paling dramatis di Bali.", Latitude: -8.0674, Longitude: 115.4047, Address: "Julah, Tejakula, Buleleng, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Ulun Danu Tamblingan", Description: "Pura sakral di tepi Danau Tamblingan yang hanya dapat dikunjungi dengan perahu tradisional melalui hutan.", Latitude: -8.2524, Longitude: 115.1105, Address: "Munduk, Banjar, Buleleng, Bali", CategoryID: category.ID},

		// Bali Barat
		{ID: uuid.NewString(), Name: "Pura Rambut Siwi", Description: "Pura suci di tepi tebing pantai Bali Barat. Berdiri kokoh menghadap Samudra Hindia, didirikan oleh Dang Hyang Nirartha.", Latitude: -8.3570, Longitude: 114.8208, Address: "Yehembang, Mendoyo, Jembrana, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Gede Perancak", Description: "Pura bersejarah di muara sungai Jembrana tempat Dang Hyang Nirartha pertama kali menginjakkan kaki di Bali.", Latitude: -8.4079, Longitude: 114.5738, Address: "Perancak, Negara, Jembrana, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Luhur Batukaru", Description: "Pura suci di lereng Gunung Batukaru, dikelilingi hutan tropis lebat. Salah satu Sad Kahyangan Bali.", Latitude: -8.3872, Longitude: 115.1245, Address: "Wongaya Gede, Penebel, Tabanan, Bali", CategoryID: category.ID},

		// Bali Timur
		{ID: uuid.NewString(), Name: "Pura Lempuyang Luhur", Description: "Pura tertinggi di Bali di lereng Gunung Lempuyang. Terkenal dengan Gerbang Surga (Gates of Heaven) yang ikonik.", Latitude: -8.3921, Longitude: 115.6287, Address: "Lemukih, Abang, Karangasem, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Goa Lawah", Description: "Pura gua kelelawar di tepi pantai timur Bali. Dihuni ribuan kelelawar, salah satu Sad Kahyangan Bali.", Latitude: -8.5445, Longitude: 115.4556, Address: "Pesinggahan, Dawan, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Pasar Agung Besakih", Description: "Pura di lereng Gunung Agung yang menjadi gerbang pendakian spiritual. Terletak di ketinggian 1700 mdpl.", Latitude: -8.3219, Longitude: 115.5063, Address: "Selat, Karangasem, Bali", CategoryID: category.ID},

		// Nusa Penida
		{ID: uuid.NewString(), Name: "Pura Goa Giri Putri", Description: "Pura di dalam gua batu raksasa di Nusa Penida. Salah satu pura paling sakral dengan stalagmit dan stalagtit.", Latitude: -8.6940, Longitude: 115.4857, Address: "Suana, Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Dalem Penataran Ped", Description: "Pura utama di Nusa Penida yang dipercaya sebagai rumah Ratu Gede Mecaling, dewa penjaga pulau.", Latitude: -8.7001, Longitude: 115.5341, Address: "Ped, Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
		{ID: uuid.NewString(), Name: "Pura Segara Kidul Nusa Penida", Description: "Pura di tepi laut Nusa Penida yang menghadap Samudra Hindia dengan pemandangan alam yang dramatis.", Latitude: -8.7694, Longitude: 115.4291, Address: "Nusa Penida, Klungkung, Bali", CategoryID: category.ID},
	}
	seedBatch(db, locations)
}

func seedBatch(db *gorm.DB, locations []entity.Location) {
	for _, loc := range locations {
		var count int64
		db.Model(&entity.Location{}).Where("name = ?", loc.Name).Count(&count)
		if count == 0 {
			if err := db.Create(&loc).Error; err != nil {
				log.Printf("Failed to seed '%s': %v", loc.Name, err)
			} else {
				log.Printf("✓ Seeded: %s", loc.Name)
			}
		}
	}
}
