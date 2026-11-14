# Instalação do Radar Viral

1. Tenha Node.js, FFmpeg, FFprobe e Python instalados.
2. Rode `scripts/setup.ps1` no Windows para verificar o ambiente.
3. Conecte o ElevenLabs sem colar chaves no chat:

```powershell
npx -y @elevenlabs/cli@latest onboard init
```

4. Em `Configurar voz`, escolha as vozes no ElevenLabs e informe apenas os IDs.
5. Para vídeos 3D, disponibilize o `animador-zero` no ambiente do cliente.

O instalador verifica dependências e instala o motor de vídeo (Remotion) na primeira vez; não cria cobranças automaticamente.

## Motor de vídeo (Remotion)

O `scripts/setup.ps1` roda `npm install` em `motor-video/` (Remotion + three.js) quando ainda não estiver instalado. Para pular: `scripts/setup.ps1 -SemMotor`.
Na primeira renderização o Remotion baixa o navegador dele (cerca de 200 a 300 MB).

Depois da instalação:
1. Coloque Reels do cliente em `motor-video/public/clips/` (c1.mp4 a c5.mp4).
2. Crie `motor-video/.env.local` com `ELEVENLABS_API_KEY`, `VOZ_NARRADOR` e `VOZ_ROBO` (nunca cole a chave no chat).
3. Escreva o roteiro (modelo em `motor-video/roteiros/exemplo-escuro.json`) e siga os comandos em [references/motor-principal.md](references/motor-principal.md).
