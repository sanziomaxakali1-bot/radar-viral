# Arquitetura

```text
painel de perguntas
  â†“
briefing de oferta e lead
  â†“
pesquisa e anÃ¡lise de tendÃªncias
  â†“
roteiro original
  â†“
voz e timestamps
  â†“
roteamento: cÃ¢mera | sem rosto | hÃ­brido | 3D
  â†“
ediÃ§Ã£o, animaÃ§Ã£o, legendas e Ã¡udio
  â†“
prÃ©via e revisÃ£o
  â†“
aprovaÃ§Ã£o
  â†“
publicaÃ§Ã£o/agendamento, se conectado
```

## Componentes reutilizÃ¡veis

- `editar-criativo`: fluxo de anÃºncios verticais, Whisper, geraÃ§Ã£o de voz, FFmpeg, efeitos, captions, LUFS, folhas de frames e variaÃ§Ãµes.
- `animador-zero`: Faster-Whisper, env de volume, cenas 3D, personagens, boca, cÃ¢mera, cartÃµes, render via Puppeteer/Three.js, prÃ©via e finalizaÃ§Ã£o.
- `trend-discovery` e `competitor-social-research`: quando instalados e conectados a fontes, apoiam pesquisa de tendÃªncia e concorrentes.
- `remotion-captions` e `remotion-render`: quando instalados, apoiam captions temporizadas e render por composiÃ§Ã£o.
- `social-publisher`: quando autenticado e validado, apoia agendamento/publicaÃ§Ã£o.

## DependÃªncias externas

Pesquisa de Instagram/TikTok, clonagem de voz, notificaÃ§Ãµes, publicaÃ§Ã£o e DMs nÃ£o sÃ£o garantidas pelo SKILL.md. Elas precisam de API, navegador autenticado, ferramenta intermediÃ¡ria ou integraÃ§Ã£o local. Registrar cada dependÃªncia como pendÃªncia no projeto.

