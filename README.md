# DentAI — Yapay Zekâ Destekli Diş Kliniği & Poliklinik Yönetim SaaS Platformu

Ağız ve diş sağlığı poliklinikleri, özel muayenehaneler ve sağlık turizmi merkezleri için yapay zekâ destekli, modern ve abonelik modeliyle çalışan klinik yönetim ve hasta kazanım platformu.

## İhtiyaç Analizi ve Pazarlanabilirlik Odaklı Mimari

Diş kliniklerinin en büyük 5 ticari ve operasyonel problemi doğrudan çözülmüştür:
1. **Boş Kalan Koltuk (Ünit No-Show) Sorunu**: Randevudan 24 saat ve 2 saat önce WhatsApp üzerinden konum pini ve *"Geliyorum (1) / Ertelemek İstiyorum (2)"* butonlu onay mesajıyla koltuk boş kalma oranını %28'den %2.1'e düşürür.
2. **Mesai Dışı Gece Diş Ağrısı & Yurt Dışı Hasta Kaybı**: Akşam 19:00 – Sabah 09:00 arasında şiddetli diş ağrısıyla veya saat farkıyla yurt dışından yazan hastaları 2 saniyede karşılar, ön triyaj yapar ve sabah ilk saate randevu açar.
3. **İnteraktif FDI 32-Diş Odontogram & Tedavi Planlama**: 11–48 FDI numaralandırma sistemine sahip görsel diş şeması üzerinden İmplant, Zirkonyum Kuron, Kanal Tedavisi ve Cerrahi Çekim durumlarının tek tıkla yönetimi.
4. **Tıbbi Anamnez Güvenlik Uyarıları & Protez Laboratuvar Takibi**: Penisilin alerjisi, kan sulandırıcı kullanımı, diyabet ve hipertansiyon uyarılarının hem CRM hem AI Triyaj ekranında görünmesi; Zirkonyum ve Şeffaf Plak laboratuvar aşamalarının takibi.
5. **Yarım Kalan Tedavi Teklifleri & 6 Aylık Recall**: Muayene olup fiyat teklifi alan ("düşüneyim" diyen) hastalara 3. gün otomatik takip ve tedavisi biten hastalara 6. ayda otomatik diş taşı temizliği / kontrol çağrısı.

## Modüller

- **Genel Bakış (`/`)**: Poliklinik performans özeti, canlı Ünit (Koltuk) durumu şeridi, 6 aylık ciro/seans grafiği, hasta dönüşüm hunisi ve yaklaşan randevular.
- **Tedavi Planları & İnteraktif Diş Şeması (`/tedaviler`)**: FDI 32-diş interaktif Odontogram şeması, 8 diş hekimliği branşı (İmplant, Gülüş Tasarımı & Zirkonyum, Şeffaf Plak & Ortodonti, Endodonti, Beyazlatma, Gömülü 20'lik Cerrahisi, Periodontoloji, Pedodonti), laboratuvar aşaması ve ara tahsilat yönetimi.
- **Hastalar & Klinik CRM (`/hastalar`)**: *Yeni Başvuru, Muayene & Planlama, Tedavisi Devam Eden, Tamamlandı & Kontrolde* aşamalarıyla Kanban pano ve liste görünümü, kırmızı tıbbi anamnez uyarıları ve bakiye takibi.
- **Randevu & Ünit Takvimi (`/randevular`)**: Haftalık ünit bazlı (`Ünit 1 Cerrahi`, `Ünit 2 Estetik`, `Ünit 3 Endodonti`, `3D CBCT`) randevu takvimi ve WhatsApp teyit durumu.
- **AI Hasta Asistanı & Triyaj (`/ai-asistan`)**: Doğal Türkçe konuşan WhatsApp & Instagram asistanı, TDB uyumlu sıfır tıbbi halüsinasyon koruma kalkanı, acil ağrı triyajı ve hekime/koordinatöre devir.
- **Otomatik Klinik İşlemleri (`/otomasyonlar`)**: Randevu onaylama, cerrahi sonrası 1. gün bakım mesajı, onay bekleyen tedavi teklifi hatırlatma, 6 aylık diş taşı temizliği (Recall), laboratuvar prova bildirimi ve Başhekim gün sonu özeti.
- **Poliklinik Ayarları (`/ayarlar`)**: Klinik ruhsat bilgileri, hekim ve ünit kadrosu, AI triyaj kuralları, WhatsApp Business bağlantısı ve SaaS abonelik paketleri.

## Kurulum ve Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.
