# Estado compacto do projeto

Mantenha um arquivo curto, por exemplo `estado-maquina-reels.json` ou `estado-maquina-reels.md`, com:

```text
projeto:
status:
oferta:
nicho:
publico:
formato:
voz:
arquivos_principais:
roteiro:
pendencias:
ultima_verificacao:
proximo_passo:
```

Ao retomar um projeto, leia primeiro esse arquivo e apenas os recursos ligados ao `proximo_passo`. NÃ£o reanalise a conversa, o ZIP ou todos os arquivos se o estado jÃ¡ registrar a decisÃ£o.

## RelatÃ³rio econÃ´mico

Use este formato:

```text
STATUS: concluÃ­do | parcial | bloqueado
RESULTADO: uma frase
ARQUIVO: caminho principal
PENDÃŠNCIA: somente se existir
PRÃ“XIMO PASSO: uma frase
```

