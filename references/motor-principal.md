# Motor principal de v�deo 3D

Para Reels com personagens e rob�, a M�quina de Reels deve usar o `animador-zero` como motor principal de produ��o.
Ele � respons�vel por personagens, c�mera, cortes, anima��o de boca, legendas, trilha, pr�via e render quadro a quadro.

A M�quina de Reels funciona como painel e diretora: coleta o briefing, define o formato, escreve o roteiro, escolhe as
vozes, prepara o �udio, chama o `animador-zero`, revisa a pr�via e s� ent�o entrega o render final.

Para o estilo de refer�ncia, priorizar frases curtas, leitura r�pida, cortes limpos por fala, poucos elementos na tela,
texto grande e aus�ncia de pausas longas. N�o exibir pre�o ou qualquer valor quando o briefing pedir remo��o de pre�o.

## Motor de criativos em Remotion (regras de criação de vídeo)

Para criativos de anúncio em vídeo vertical (9:16, 25 a 35 segundos), o motor padrão é **Remotion montado por código**, renderizado no computador do usuário. Não gere o vídeo inteiro em IA de vídeo.

**Ferramentas**
- Remotion 4 (React): composições, `@remotion/bundler` + `@remotion/renderer` em scripts (empacotar uma vez, `selectComposition`, `renderStill` para prévia, `renderMedia` para o MP4). Use script de bundle com `publicDir`; o `--public-dir` pelo CLI falha com áudio.
- three.js + `@react-three/fiber` + `@remotion/three` (`ThreeCanvas`) para personagens 3D de blocos (voxel/low poly) e cenários; renderize com `chromiumOptions: {gl: 'angle'}`.
- ElevenLabs com timestamps (`/with-timestamps`, `eleven_multilingual_v2`, `language_code: pt`) para voz; os tempos por palavra alimentam a legenda e a boca do personagem.
- FFmpeg para efeito de voz do robô (filtro aplicado depois de gerar a fala), trilha, folha de prévia e conferência do arquivo final.
- Whisper/Faster-Whisper para transcrever referências e vídeos brutos.

**Estrutura do projeto**
- Roteiro = lista de falas; cada fala tem `scene` (nome da cena), `text`, `key` (palavra de destaque) e, nos diálogos, `who`.
- Um script gera as vozes e um `manifest` (arquivo da voz, duração, palavras com tempo). A linha do tempo é calculada pela duração de cada fala (frames = duração x 30 + 2).
- Registro de cenas por nome; cada criativo é uma composição que recebe o manifest e, quando for 3D, um `theme` (roupa, cor do robô, céu, paleta).

**Regras**
1. Voz: uma fala por arquivo, em cache por hash (texto + voz). Reaproveite tudo que já existe; variações geram só as falas novas.
2. Variação de criativo que vende: troque só o gancho (2 ou 3 primeiras falas) mantendo o corpo, ou só o corpo mantendo o gancho. Nunca os dois juntos.
3. IA de imagem (ex.: Higgsfield) só se o usuário pedir, só imagem parada, no máximo 1 ou 2 por criativo, e informar o custo antes e esperar o ok.
4. Prévia obrigatória: gerar quadros por fala (folha de contato) antes do render completo, a menos que o usuário já tenha aprovado o estilo e mandado fazer direto; nesse caso conferir quadros do MP4 depois.
5. Cada criativo novo tem personagem e cenário novos (muda roupa, cabelo, cores). Não clonar o vídeo de referência: copiar só estrutura, ritmo e tipo de animação.
6. Vídeos brutos do usuário (Reels de amostra) entram em celulares, mosaicos, listas "em alta" e timelines que simulam edição. Não baixar mídia de concorrente em massa e não aplicar filtros que deformem o vídeo.
7. Estilo: fundo escuro com grade e brilho, cartões/janelas de app, texto grande, legenda palavra por palavra com a palavra ativa destacada, personagem com boca sincronizada, cortes a cada fala. Cada bloco da fala mostra algo que ilustra o que está sendo dito.
8. Copy: só benefício, sem depoimento, número de prova ou resultado inventado; CTA final no formato definido pelo briefing (ex.: "Toque em Saiba mais"); remover preço quando o briefing pedir.
9. Entrega: conferir duração, 1080x1920, peso abaixo de 30 MB e extrair quadros do MP4 final. Falas curtas que deixam o vídeo abaixo de 25 s devem ser completadas com falas já em cache.
10. Voz do robô/personagem: usar os IDs de voz escolhidos pelo cliente (veja `references/configuracao-publica.md`), nunca IDs pessoais como padrão.

**Onde está o motor e como usar (`motor-video/`, instalado pelo `scripts/setup.ps1`)**
1. Roteiro: copie `motor-video/roteiros/exemplo-escuro.json` e edite. Cada fala tem `scene`, `text` e, se quiser o personagem na tela, `"person": true`. Em `marca` coloque o nome do produto do cliente (aparece no rótulo, no logo e no CTA). `comp` escolhe o estilo: `vsl` (escuro com janelas de app e Reels em celulares), `voxel` (3D de blocos, diálogo personagem x robô), `pixel` ou `classico`.
2. Cenas do estilo `vsl`: mosaic, fora, rise, editar, edicao, horas, ideia, semana, logo, radar, link, copia, lista, resultado, pipeline, duvidas, formato, nichos, tres, simples, hist, dia, maquina, esteira, compara e cta. Use a que ilustra o que a fala diz.
3. Vozes: `node scripts/gerar-voz.mjs roteiros/<arquivo>.json` (use `--dry` para ver o custo em caracteres antes). Só gera as falas novas; informa a duração e avisa se ficar fora de 25 a 35 s. Chaves e IDs vêm de `.env.local`.
4. Prévia: `node scripts/previa.mjs <id>` gera `out/PREVIA-<id>.png` com um quadro por fala. Mostrar ao usuário antes do render.
5. Render: `node scripts/render.mjs <id>` gera `out/<id>.mp4`. Depois conferir duração, 1080x1920, peso e um quadro do arquivo final.
6. Variação: duplique o projeto no JSON e troque só as 2 ou 3 primeiras falas (ou só o corpo). As falas já geradas ficam em cache e não custam de novo.
7. Os Reels do cliente ficam em `motor-video/public/clips/c1.mp4` a `c5.mp4` e entram nas cenas automaticamente.
