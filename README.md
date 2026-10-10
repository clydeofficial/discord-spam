# 📨 Spam Bot
Botu sunucuya eklemeden, User Install ile hesabına ekleyip her yerde `/spam` ile mesajı otomatik gönderen Discord botu.

## Nasıl Çalışır?

1. Botu bir kez hesabına eklersin (User Install), sunucuya eklemen gerekmez.
2. Herhangi bir sunucuda ya da DM'de `/spam mesaj:merhaba` yazarsın.
3. Bot sadece sana görünen bir önizleme + **Gönder / İptal** butonu gösterir.
4. **Gönder**'e basarsan mesaj 5 kez gönderilir, **İptal**'e basarsan hiçbir şey gönderilmez.

## Kurulum

```bash
cp .env.example .env
```

`.env` dosyasını açıp tokenini yaz:

```env
TOKEN=bot_tokenin_buraya
```

Sonra bağımlılıkları kurup başlat:

```bash
npm install
npm start
```

## Destek

- Yardım için Discord sunucumuz: `https://discord.gg/uSkGQmsbPv`
- Video anlatım ve güncellemeler için YouTube kanalımız: `https://www.youtube.com/@ClydeResmi`
