# Arquitetura

```text
painel de perguntas
  ?
briefing de oferta e lead
  ?
pesquisa e an�lise de tend�ncias
  ?
roteiro original
  ?
voz e timestamps
  ?
roteamento: c�mera | sem rosto | h�brido | 3D
  ?
edi��o, anima��o, legendas e �udio
  ?
pr�via e revis�o
  ?
aprova��o
  ?
publica��o/agendamento, se conectado
```

## Componentes reutiliz�veis

- `editar-criativo`: fluxo de an�ncios verticais, Whisper, gera��o de voz, FFmpeg, efeitos, captions, LUFS, folhas de frames e varia��es.
- `animador-zero`: Faster-Whisper, env de volume, cenas 3D, personagens, boca, c�mera, cart�es, render via Puppeteer/Three.js, pr�via e finaliza��o.
- `trend-discovery` e `competitor-social-research`: quando instalados e conectados a fontes, apoiam pesquisa de tend�ncia e concorrentes.
- `remotion-captions` e `remotion-render`: quando instalados, apoiam captions temporizadas e render por composi��o.
- `social-publisher`: quando autenticado e validado, apoia agendamento/publica��o.

## Depend�ncias externas

Pesquisa de Instagram/TikTok, clonagem de voz, notifica��es, publica��o e DMs n�o s�o garantidas pelo SKILL.md. Elas precisam de API, navegador autenticado, ferramenta intermedi�ria ou integra��o local. Registrar cada depend�ncia como pend�ncia no projeto.
