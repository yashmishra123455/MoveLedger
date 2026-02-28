/* script.js - Full chess engine (Unicode) with fixed unique keys so each side has:
   2 rooks, 2 knights, 2 bishops, 1 queen, 1 king, 8 pawns
*/

const UNICODE = {
  w_king: '♔', w_queen: '♕', w_rook: '♖', w_bishop: '♗', w_knight: '♘', w_pawn: '♙',
  b_king: '♚', b_queen: '♛', b_rook: '♜', b_bishop: '♝', b_knight: '♞', b_pawn: '♟'
};

const boardEl = document.getElementById('board');
const turnText = document.getElementById('turnText');
const moveListEl = document.getElementById('moveList');
const statusEl = document.getElementById('status');
const promoModal = document.getElementById('promo');
const promoChoicesEl = document.getElementById('promoChoices');

let historyStack = []; // for undo
let animDuration = 120; // ms

/* ---------- Game State ---------- */
let state = {
  board: {},         // mapping "x_y" -> pieceKey or null
  pieces: {},        // pieceKey -> { key, type, color, pos, moved, captured }
  turn: 'w',         // 'w' or 'b'
  selected: null,    // square id "x_y"
  legalMoves: [],    // moves for selected
  lastMove: null,    // last move object {from,to,piece,pawnDouble}
  moveHistory: [],   // array of SAN-like moves
  gameOver: false
};

/* ---------- Initialization ---------- */
function initEmptyBoard() {
  for (let x = 1; x <= 8; x++) for (let y = 1; y <= 8; y++) state.board[`${x}_${y}`] = null;
}

/* Important fix:
   - Use unique piece keys (include x position index) so multiple pieces of same type don't overwrite each other.
   - Keep 'type' as "w_rook" (without index) so UNICODE lookup and logic still works.
*/
function setupNewGame() {
  state.turn = 'w';
  state.selected = null;
  state.legalMoves = [];
  state.lastMove = null;
  state.moveHistory = [];
  state.gameOver = false;
  state.pieces = {};
  initEmptyBoard();

  // Standard order for main rows (left to right from white's perspective)
  const order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  // Black main row y=8 (unique keys: include x index)
  for (let x = 1; x <= 8; x++) {
    const pieceType = `b_${order[x - 1]}`;               // type used for logic and Unicode (no unique suffix)
    const key = `b_${order[x - 1]}_${x}`;               // unique key (includes x)
    state.pieces[key] = { key, type: pieceType, color: 'b', pos: `${x}_8`, moved: false, captured: false };
    state.board[`${x}_8`] = key;
  }

  // Black pawns y=7
  for (let x = 1; x <= 8; x++) {
    const key = `b_pawn_${x}`;
    state.pieces[key] = { key, type: 'b_pawn', color: 'b', pos: `${x}_7`, moved: false, captured: false };
    state.board[`${x}_7`] = key;
  }

  // White pawns y=2
  for (let x = 1; x <= 8; x++) {
    const key = `w_pawn_${x}`;
    state.pieces[key] = { key, type: 'w_pawn', color: 'w', pos: `${x}_2`, moved: false, captured: false };
    state.board[`${x}_2`] = key;
  }

  // White main row y=1 (unique keys: include x index)
  for (let x = 1; x <= 8; x++) {
    const pieceType = `w_${order[x - 1]}`;
    const key = `w_${order[x - 1]}_${x}`;
    state.pieces[key] = { key, type: pieceType, color: 'w', pos: `${x}_1`, moved: false, captured: false };
    state.board[`${x}_1`] = key;
  }

  historyStack = [];
  renderBoard();
  updateHUD();
}

/* ---------- UI Rendering ---------- */
function buildBoardSquares() {
  boardEl.innerHTML = '';
  // top to bottom y=8..1 so white is at bottom visually
  for (let y = 8; y >= 1; y--) {
    for (let x = 1; x <= 8; x++) {
      const sq = document.createElement('div');
      sq.className = `square ${((x + y) % 2 === 0) ? 'light' : 'dark'}`;
      sq.dataset.id = `${x}_${y}`;
      sq.addEventListener('click', onSquareClick);
      boardEl.appendChild(sq);
    }
  }
}

function renderBoard() {
  buildBoardSquares();
  // place pieces (unicode)
  for (const pk in state.pieces) {
    const p = state.pieces[pk];
    if (p.captured) continue;
    const cell = document.querySelector(`[data-id="${p.pos}"]`);
    if (cell) {
      const char = UNICODE[p.type] || '';
      cell.textContent = char;
    }
  }
  clearHighlights();
}

function clearHighlights() {
  document.querySelectorAll('.square').forEach(s => {
    s.classList.remove('highlight', 'capture', 'selected');
  });
}

/* ---------- Utilities ---------- */
const inside = (x, y) => x >= 1 && x <= 8 && y >= 1 && y <= 8;
const idOf = (x, y) => `${x}_${y}`;
const parseId = s => s.split('_').map(n => parseInt(n, 10));
const opposite = c => c === 'w' ? 'b' : 'w';

/* ---------- Move Generation Helpers ---------- */
/* pseudo-legal moves generator (does not consider final-check) */
function pseudoMovesFrom(squareId) {
  const pieceKey = state.board[squareId];
  if (!pieceKey) return [];
  const piece = state.pieces[pieceKey];
  const [fx, fy] = parseId(squareId);
  const moves = [];

  const push = (tx, ty, extras = {}) => {
    if (!inside(tx, ty)) return;
    const toId = idOf(tx, ty);
    const occupant = state.board[toId];
    if (occupant && state.pieces[occupant].color === piece.color) return;
    moves.push(Object.assign({ from: squareId, to: toId, pieceKey, capture: !!occupant }, extras));
  };

  const slide = (dx, dy, limit = 8) => {
    for (let step = 1; step <= limit; step++) {
      const tx = fx + dx * step, ty = fy + dy * step;
      if (!inside(tx, ty)) break;
      const tid = idOf(tx, ty);
      const occ = state.board[tid];
      if (!occ) moves.push({ from: squareId, to: tid, pieceKey, capture: false });
      else { if (state.pieces[occ].color !== piece.color) moves.push({ from: squareId, to: tid, pieceKey, capture: true }); break; }
    }
  };

  switch (piece.type) {
    case 'w_pawn':
    case 'b_pawn': {
      const dir = piece.color === 'w' ? 1 : -1;
      // forward one
      const one = idOf(fx, fy + dir);
      if (inside(fx, fy + dir) && state.board[one] === null) {
        moves.push({ from: squareId, to: one, pieceKey, capture: false, pawnMove: 1 });
        // double forward
        const two = idOf(fx, fy + 2 * dir);
        if (!piece.moved && inside(fx, fy + 2 * dir) && state.board[two] === null && state.board[one] === null) {
          moves.push({ from: squareId, to: two, pieceKey, capture: false, pawnMove: 2, pawnDouble: true });
        }
      }
      // captures and en-passant
      for (const dx of [-1, 1]) {
        const tx = fx + dx, ty = fy + dir;
        if (!inside(tx, ty)) continue;
        const tid = idOf(tx, ty);
        const occ = state.board[tid];
        if (occ && state.pieces[occ].color !== piece.color) {
          moves.push({ from: squareId, to: tid, pieceKey, capture: true });
        } else {
          if (state.lastMove && state.lastMove.pawnDouble && state.lastMove.to === idOf(tx, fy)) {
            moves.push({ from: squareId, to: idOf(tx, ty), pieceKey, capture: true, enPassant: true, epTakenSquare: state.lastMove.to });
          }
        }
      }
      break;
    }

    case 'w_knight':
    case 'b_knight': {
      const deltas = [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1]];
      deltas.forEach(d => push(fx + d[0], fy + d[1]));
      break;
    }

    case 'w_bishop':
    case 'b_bishop': { slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); break; }
    case 'w_rook':
    case 'b_rook': { slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); break; }
    case 'w_queen':
    case 'b_queen': { slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); break; }

    case 'w_king':
    case 'b_king': {
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        push(fx + dx, fy + dy);
      }
      // castling conditions
      if (!piece.moved && !isSquareAttacked(squareId, opposite(piece.color))) {
        const rank = (piece.color === 'w') ? 1 : 8;
        // king side (rook on x=8)
        if (state.board[idOf(8, rank)]) {
          const rookKey = state.board[idOf(8, rank)];
          const rook = state.pieces[rookKey];
          if (rook && !rook.moved && rook.type.endsWith('rook')) {
            const sq1 = idOf(6, rank), sq2 = idOf(7, rank);
            if (state.board[sq1] === null && state.board[sq2] === null) {
              if (!isSquareAttacked(sq1, opposite(piece.color)) && !isSquareAttacked(sq2, opposite(piece.color))) {
                moves.push({ from: squareId, to: idOf(7, rank), pieceKey, castle: { rookFrom: idOf(8, rank), rookTo: idOf(6, rank) } });
              }
            }
          }
        }
        // queen side (rook on x=1)
        if (state.board[idOf(1, rank)]) {
          const rookKey = state.board[idOf(1, rank)];
          const rook = state.pieces[rookKey];
          if (rook && !rook.moved && rook.type.endsWith('rook')) {
            const sq1 = idOf(4, rank), sq2 = idOf(3, rank), sq3 = idOf(2, rank);
            if (state.board[sq1] === null && state.board[sq2] === null && state.board[sq3] === null) {
              if (!isSquareAttacked(sq1, opposite(piece.color)) && !isSquareAttacked(sq2, opposite(piece.color))) {
                moves.push({ from: squareId, to: idOf(3, rank), pieceKey, castle: { rookFrom: idOf(1, rank), rookTo: idOf(4, rank) } });
              }
            }
          }
        }
      }
      break;
    }
  }

  return moves;
}

/* ---------- Check & Legality ---------- */
// generate legal moves (filter those that would leave king in check)
function legalMovesFrom(squareId) {
  const pseudo = pseudoMovesFrom(squareId);
  const legal = [];
  for (const m of pseudo) {
    if (!wouldLeaveKingInCheck(m)) legal.push(m);
  }
  return legal;
}

function wouldLeaveKingInCheck(move) {
  // shallow clone of board and deep copy of pieces
  const sim = {
    board: Object.assign({}, state.board),
    pieces: JSON.parse(JSON.stringify(state.pieces)),
    lastMove: state.lastMove ? Object.assign({}, state.lastMove) : null
  };

  const fromKey = sim.board[move.from];
  if (!fromKey) return true;

  // en-passant capture removal
  if (move.enPassant && move.epTakenSquare) {
    const capturedKey = sim.board[move.epTakenSquare];
    if (capturedKey) { sim.pieces[capturedKey].captured = true; sim.board[move.epTakenSquare] = null; }
  }

  // normal capture
  if (sim.board[move.to]) {
    const capk = sim.board[move.to];
    sim.pieces[capk].captured = true;
    sim.board[move.to] = null;
  }

  // move piece in sim
  sim.board[move.from] = null;
  sim.board[move.to] = fromKey;
  sim.pieces[fromKey].pos = move.to;
  sim.pieces[fromKey].moved = true;

  // simulate castle rook movement
  if (move.castle && move.castle.rookFrom) {
    for (const pk in sim.pieces) {
      const p = sim.pieces[pk];
      if (!p.captured && p.type.endsWith('rook') && p.pos === move.castle.rookFrom) {
        sim.board[move.castle.rookFrom] = null;
        sim.board[move.castle.rookTo] = pk;
        sim.pieces[pk].pos = move.castle.rookTo;
        sim.pieces[pk].moved = true;
        break;
      }
    }
  }

  const moverColor = state.pieces[fromKey].color;
  // find king pos of mover
  let kingPos = null;
  for (const pk in sim.pieces) {
    if (sim.pieces[pk].captured) continue;
    if (sim.pieces[pk].type === moverColor + '_king') { kingPos = sim.pieces[pk].pos; break; }
  }
  if (!kingPos) return true;

  return isSquareAttackedSim(kingPos, opposite(moverColor), sim);
}

function isSquareAttacked(squareId, attackerColor) {
  for (const pk in state.pieces) {
    const p = state.pieces[pk];
    if (p.captured) continue;
    if (p.color !== attackerColor) continue;
    const attacks = pseudoAttacksForPiece(p);
    if (attacks.includes(squareId)) return true;
  }
  return false;
}
function isSquareAttackedSim(squareId, attackerColor, sim) {
  for (const pk in sim.pieces) {
    const p = sim.pieces[pk];
    if (p.captured) continue;
    if (p.color !== attackerColor) continue;
    const attacks = pseudoAttacksForPieceSim(p, sim);
    if (attacks.includes(squareId)) return true;
  }
  return false;
}

/* helper: generate attack squares for piece (ignores moving into check) */
function pseudoAttacksForPiece(p) {
  const [fx, fy] = parseId(p.pos);
  const arr = [];
  const push = (tx, ty) => { if (inside(tx, ty)) arr.push(idOf(tx, ty)); };
  const slide = (dx, dy) => {
    for (let s = 1; s <= 8; s++) {
      const tx = fx + dx * s, ty = fy + dy * s;
      if (!inside(tx, ty)) break;
      arr.push(idOf(tx, ty));
      if (state.board[idOf(tx, ty)] !== null) break;
    }
  };

  if (p.type.endsWith('pawn')) {
    const dir = p.color === 'w' ? 1 : -1;
    push(fx - 1, fy + dir); push(fx + 1, fy + dir);
  } else if (p.type.endsWith('knight')) {
    [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1]].forEach(d => push(fx + d[0], fy + d[1]));
  } else if (p.type.endsWith('bishop')) { slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); }
  else if (p.type.endsWith('rook')) { slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); }
  else if (p.type.endsWith('queen')) { slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); }
  else if (p.type.endsWith('king')) { for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (!(dx === 0 && dy === 0)) push(fx + dx, fy + dy); }

  return arr;
}

function pseudoAttacksForPieceSim(p, sim) {
  const [fx, fy] = parseId(p.pos);
  const arr = [];
  const push = (tx, ty) => { if (inside(tx, ty)) arr.push(idOf(tx, ty)); };
  const slide = (dx, dy) => {
    for (let s = 1; s <= 8; s++) {
      const tx = fx + dx * s, ty = fy + dy * s;
      if (!inside(tx, ty)) break;
      arr.push(idOf(tx, ty));
      if (sim.board[idOf(tx, ty)] !== null) break;
    }
  };

  if (p.type.endsWith('pawn')) {
    const dir = p.color === 'w' ? 1 : -1;
    push(fx - 1, fy + dir); push(fx + 1, fy + dir);
  } else if (p.type.endsWith('knight')) {
    [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1]].forEach(d => push(fx + d[0], fy + d[1]));
  } else if (p.type.endsWith('bishop')) { slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); }
  else if (p.type.endsWith('rook')) { slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); }
  else if (p.type.endsWith('queen')) { slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); }
  else if (p.type.endsWith('king')) { for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (!(dx === 0 && dy === 0)) push(fx + dx, fy + dy); }

  return arr;
}

/* ---------- Execute Move ---------- */
function executeMove(move, promotionChoice = null, recordHistory = true) {
  // Save snapshot for undo
  const snapshot = {
    board: Object.assign({}, state.board),
    pieces: JSON.parse(JSON.stringify(state.pieces)),
    turn: state.turn,
    lastMove: state.lastMove ? Object.assign({}, state.lastMove) : null,
    moveHistory: state.moveHistory.slice()
  };
  historyStack.push(snapshot);

  const fromKey = state.board[move.from];
  if (!fromKey) return false;
  const piece = state.pieces[fromKey];

  // en-passant actual capture
  if (move.enPassant && move.epTakenSquare) {
    const capKey = state.board[move.epTakenSquare];
    if (capKey) {
      state.pieces[capKey].captured = true;
      state.board[move.epTakenSquare] = null;
    }
  }

  // normal capture
  if (state.board[move.to]) {
    const capKey = state.board[move.to];
    if (capKey) { state.pieces[capKey].captured = true; state.board[move.to] = null; }
  }

  // move piece
  state.board[move.from] = null;
  state.board[move.to] = fromKey;
  state.pieces[fromKey].pos = move.to;
  state.pieces[fromKey].moved = true;

  // castle: move rook
  if (move.castle && move.castle.rookFrom) {
    let rk = state.board[move.castle.rookFrom];
    if (!rk) {
      // fallback: find rook by pos
      for (const pk in state.pieces) {
        const p = state.pieces[pk];
        if (!p.captured && p.type.endsWith('rook') && p.pos === move.castle.rookFrom) { rk = pk; break; }
      }
    }
    if (rk) {
      state.board[move.castle.rookFrom] = null;
      state.board[move.castle.rookTo] = rk;
      state.pieces[rk].pos = move.castle.rookTo;
      state.pieces[rk].moved = true;
    }
  }

  // promotion
  if (state.pieces[fromKey].type.endsWith('pawn')) {
    const [, rank] = parseId(move.to);
    if ((state.pieces[fromKey].color === 'w' && rank === 8) || (state.pieces[fromKey].color === 'b' && rank === 1)) {
      const choice = promotionChoice || 'queen';
      state.pieces[fromKey].type = `${state.pieces[fromKey].color}_${choice}`;
    }
  }

  // lastMove data for en-passant detection
  state.lastMove = {
    from: move.from,
    to: move.to,
    piece: state.pieces[fromKey].type,
    pawnDouble: !!move.pawnDouble
  };

  // record notation
  if (recordHistory) state.moveHistory.push(moveToNotation(move, fromKey));

  // change turn
  state.turn = opposite(state.turn);
  state.selected = null;
  state.legalMoves = [];

  renderBoard();
  updateHUD();

  setTimeout(() => checkGameEnd(), 10);
  return true;
}

/* ---------- Notation ---------- */
function moveToNotation(move, pieceKey) {
  const pieceType = state.pieces[pieceKey].type.split('_')[1];
  const to = move.to;
  let sym = '';
  if (pieceType === 'pawn') {
    if (move.capture) sym = move.from.split('_')[0] + 'x' + to;
    else sym = to;
  } else {
    const map = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N' };
    sym = (map[pieceType] || pieceType[0].toUpperCase()) + (move.capture ? 'x' : '') + to;
  }
  if (move.castle) {
    if (move.castle.rookFrom.startsWith('8_')) return 'O-O';
    else return 'O-O-O';
  }
  return sym;
}

/* ---------- Square click handling & highlights ---------- */
function onSquareClick(e) {
  if (state.gameOver) return;
  const id = e.currentTarget.dataset.id;
  const pieceKey = state.board[id];

  // no selection yet
  if (!state.selected) {
    if (!pieceKey) return;
    if (state.pieces[pieceKey].color !== state.turn) return;
    state.selected = id;
    state.legalMoves = legalMovesFrom(id);
    highlightSelection();
    return;
  }

  // clicked same square => deselect
  if (state.selected === id) { state.selected = null; state.legalMoves = []; clearHighlights(); renderBoard(); return; }

  // clicked friendly piece to switch selection
  if (pieceKey && state.pieces[pieceKey].color === state.turn) {
    state.selected = id;
    state.legalMoves = legalMovesFrom(id);
    highlightSelection();
    return;
  }

  // clicked destination -> check legal move
  const chosen = state.legalMoves.find(m => m.to === id);
  if (chosen) {
    if (isPromotionMove(chosen)) {
      showPromotionModal(chosen);
    } else {
      executeMove(chosen);
    }
    return;
  } else {
    // invalid -> clear selection
    state.selected = null;
    state.legalMoves = [];
    clearHighlights();
    renderBoard();
    return;
  }
}

function highlightSelection() {
  clearHighlights();
  const selEl = document.querySelector(`[data-id="${state.selected}"]`);
  if (selEl) selEl.classList.add('selected');
  for (const m of state.legalMoves) {
    const el = document.querySelector(`[data-id="${m.to}"]`);
    if (!el) continue;
    if (m.capture) el.classList.add('capture'); else el.classList.add('highlight');
  }
}

/* ---------- Promotion Modal ---------- */
function isPromotionMove(move) {
  const pieceKey = state.board[move.from];
  if (!pieceKey) return false;
  if (!state.pieces[pieceKey].type.endsWith('pawn')) return false;
  const [, toRank] = parseId(move.to);
  const color = state.pieces[pieceKey].color;
  return (color === 'w' && toRank === 8) || (color === 'b' && toRank === 1);
}
function showPromotionModal(move) {
  promoChoicesEl.innerHTML = '';
  const color = state.pieces[state.board[move.from]].color;
  const choices = ['queen', 'rook', 'bishop', 'knight'];
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'promoButton';
    btn.textContent = UNICODE[`${color}_${choice}`];
    btn.title = choice;
    btn.onclick = () => {
      executeMove(move, choice);
      promoModal.style.display = 'none';
    };
    promoChoicesEl.appendChild(btn);
  });
  document.getElementById('promoCancel').onclick = () => {
    executeMove(move, 'queen'); // default to queen
    promoModal.style.display = 'none';
  };
  promoModal.style.display = 'flex';
}

/* ---------- Game End checks ---------- */
function legalMovesAllForColor(color) {
  const result = [];
  for (const sq in state.board) {
    const pk = state.board[sq];
    if (pk && state.pieces[pk].color === color) {
      const ms = legalMovesFrom(sq);
      for (const m of ms) result.push(m);
    }
  }
  return result;
}
function isKingInCheck(color) {
  for (const pk in state.pieces) {
    const p = state.pieces[pk];
    if (p.captured) continue;
    if (p.type === color + '_king') {
      return isSquareAttacked(p.pos, opposite(color));
    }
  }
  return false;
}
function checkGameEnd() {
  const color = state.turn;
  const allLegal = legalMovesAllForColor(color);
  const inCheck = isKingInCheck(color);

  if (inCheck) statusEl.textContent = 'Check!';
  else statusEl.textContent = '';

  if (allLegal.length === 0) {
    state.gameOver = true;
    if (inCheck) {
      statusEl.textContent = `Checkmate — ${state.turn === 'w' ? 'Black' : 'White'} wins`;
      turnText.textContent = '—';
    } else {
      statusEl.textContent = 'Stalemate — draw';
      turnText.textContent = '—';
    }
  }
}

/* ---------- Undo ---------- */
function undo() {
  if (historyStack.length === 0) return;
  const snap = historyStack.pop();
  state.board = Object.assign({}, snap.board);
  state.pieces = JSON.parse(JSON.stringify(snap.pieces));
  state.turn = snap.turn;
  state.lastMove = snap.lastMove;
  state.moveHistory = snap.moveHistory.slice();
  state.selected = null;
  state.legalMoves = [];
  state.gameOver = false;
  renderBoard();
  updateHUD();
}

/* ---------- HUD & Helpers ---------- */
function updateHUD() {
  turnText.textContent = state.turn === 'w' ? 'White' : 'Black';
  moveListEl.innerHTML = state.moveHistory.map((m, i) => `<div>${i + 1}. ${m}</div>`).join('');
  const inCheck = isKingInCheck(state.turn);
  document.getElementById('status').textContent = inCheck ? 'Check!' : '';
}

/* ---------- Init & Bind ---------- */
document.getElementById('newGame').addEventListener('click', () => {
  setupNewGame();
});
document.getElementById('undoBtn').addEventListener('click', () => undo());

setupNewGame();
renderBoard();