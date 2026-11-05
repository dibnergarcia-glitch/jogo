# 🏓 Ping Pong

Jogo de Ping Pong clássico com visual neon, feito com HTML5 + CSS + JavaScript (Canvas). Sem dependências.

## Como jogar

Abra o `index.html` no navegador ou acesse via GitHub Pages.

### Modos
- **Jogador vs IA** — você controla a raquete esquerda (W/S ou mouse/toque)
- **2 Jogadores** — P1 (W/S) vs P2 (↑/↓) no mesmo teclado

### Controles
| Ação | Tecla |
|------|-------|
| Jogador 1 mover | `W` / `S` ou mouse/toque |
| Jogador 2 mover | `↑` / `↓` |
| Pausar | `P` |
| Reiniciar | `R` |
| Servir / Confirmar | `Espaço` |

### Regras
- Vence quem chegar a 5, 7 ou 11 pontos (configurável no menu)
- A bola fica mais rápida a cada rebatida
- O ângulo da bola depende de onde ela bate na raquete

### IA
Dificuldade Fácil / Médio / Difícil, selecionável no menu inicial.

## Estrutura
```
index.html
style.css
js/
  main.js   # loop principal e estados
  ball.js   # física da bola
  paddle.js # raquetes e IA
  input.js  # teclado/mouse/toque
  audio.js  # sons via Web Audio
  ui.js     # telas/menu
```

## Publicação no GitHub Pages
Settings → Pages → Source: `main` / `/ (root)` — o jogo fica jogável pela web.
