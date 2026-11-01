import { SERVERS } from './src/servers.mjs';
import {
  buildPairCodeUrl,
  extractPairCode,
  normalizeBaseUrl,
  normalizePhoneNumber,
  selectHealthyServer
} from './src/pairing-core.mjs';

const MAX_SERVER_SLOTS = 7;
const HEALTH_TIMEOUT_MS = 5000;
const CODE_TIMEOUT_MS = 30000;

const autoServerButton = document.querySelector('#autoServerButton');
const serverList = document.querySelector('#serverList');
const serverSummary = document.querySelector('#serverSummary');
const pairForm = document.querySelector('#pairForm');
const phoneNumberInput = document.querySelector('#phoneNumber');
const generateButton = document.querySelector('#generateButton');
const generateButtonLabel = generateButton.querySelector('.button-label');
const notice = document.querySelector('#notice');
const codeResult = document.querySelector('#codeResult');
const pairCode = document.querySelector('#pairCode');
const copyButton = document.querySelector('#copyButton');
const copyLabel = copyButton.querySelector('span');

const slots = Array.isArray(SERVERS) ? SERVERS.slice(0, MAX_SERVER_SLOTS) : [];
while (slots.length < MAX_SERVER_SLOTS) {
  const number = slots.length + 1;
  slots.push({ id: `server-${number}`, name: `Server ${number}`, baseUrl: '' });
}

const serverStates = new Map();
let selectedServerId = '';
let routingMode = 'auto';
let checkingServers = false;

function getSlotUrl(slot) {
  return normalizeBaseUrl(slot?.baseUrl);
}

function getConfiguredSlots() {
  return slots.filter(slot => getSlotUrl(slot));
}

function getSelectedSlot() {
  return slots.find(slot => slot.id === selectedServerId && getSlotUrl(slot)) || null;
}

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle('is-error', isError);
  notice.hidden = false;
}

function clearNotice() {
  notice.textContent = '';
  notice.classList.remove('is-error');
  notice.hidden = true;
}

function getStatus(slot) {
  if (!getSlotUrl(slot)) return 'empty';
  return serverStates.get(slot.id) || 'not-checked';
}

function renderServers() {
  const fragment = document.createDocumentFragment();

  for (const [index, slot] of slots.entries()) {
    const configured = Boolean(getSlotUrl(slot));
    const status = getStatus(slot);
    const row = document.createElement('label');
    row.className = 'server-option';
    if (!configured) row.classList.add('is-empty');
    if (slot.id === selectedServerId) row.classList.add('is-selected');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'serverChoice';
    radio.value = slot.id;
    radio.checked = slot.id === selectedServerId;
    radio.disabled = !configured || checkingServers || status === 'offline';
    radio.setAttribute('aria-label', configured ? slot.name : `${slot.name}, empty slot`);
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      selectedServerId = slot.id;
      routingMode = 'manual';
      autoServerButton.setAttribute('aria-pressed', 'false');
      clearNotice();
      renderServers();
      updateServerSummary();
    });

    const copy = document.createElement('span');
    copy.className = 'server-option-copy';
    const name = document.createElement('span');
    name.className = 'server-name';
    name.textContent = slot.name || `Server ${index + 1}`;
    const meta = document.createElement('span');
    meta.className = 'server-meta';
    const dot = document.createElement('span');
    dot.className = 'status-dot';
    if (status === 'online') dot.classList.add('is-online');
    if (status === 'offline') dot.classList.add('is-offline');
    const statusText = document.createElement('span');
    if (!configured) {
      statusText.textContent = 'Empty slot · add URL in src/servers.mjs';
    } else if (status === 'checking') {
      statusText.textContent = 'Checking availability';
    } else if (status === 'online') {
      statusText.textContent = 'Online';
    } else if (status === 'offline') {
      statusText.textContent = 'Not reachable';
    } else {
      statusText.textContent = 'Configured';
    }
    meta.append(dot, statusText);
    copy.append(name, meta);
    row.append(radio, copy);
    fragment.append(row);
  }

  serverList.replaceChildren(fragment);
  autoServerButton.disabled = checkingServers;
}

function updateServerSummary() {
  const configuredCount = getConfiguredSlots().length;
  const onlineCount = getConfiguredSlots().filter(slot => getStatus(slot) === 'online').length;

  if (configuredCount === 0) {
    serverSummary.textContent = 'No server URLs are configured yet. Add them in src/servers.mjs.';
    return;
  }

  const selected = getSelectedSlot();
  const selectedName = selected?.name || 'No server selected';
  const modeLabel = routingMode === 'auto' ? 'Auto Server' : 'Manual selection';
  serverSummary.textContent = `${modeLabel}: ${selectedName} · ${onlineCount} online · ${configuredCount} configured of 7 slots`;
}

async function checkServer(slot) {
  const baseUrl = getSlotUrl(slot);
  if (!baseUrl) return false;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  serverStates.set(slot.id, 'checking');

  try {
    // No phone number is sent during a health check; the API answers that a number is required.
    const response = await fetch(new URL('/code', baseUrl), {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });
    const online = response.status > 0 && response.status < 500 && response.status !== 404;
    serverStates.set(slot.id, online ? 'online' : 'offline');
    return online;
  } catch {
    // A failed fetch includes unreachable hosts and hosts that do not permit browser CORS.
    serverStates.set(slot.id, 'offline');
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function checkConfiguredServers() {
  if (checkingServers) return;
  checkingServers = true;
  renderServers();
  updateServerSummary();

  const configured = getConfiguredSlots();
  await Promise.all(configured.map(slot => checkServer(slot)));

  checkingServers = false;
  renderServers();
  updateServerSummary();
}

async function chooseAutomaticServer({ silent = false } = {}) {
  routingMode = 'auto';
  autoServerButton.setAttribute('aria-pressed', 'true');
  clearNotice();
  await checkConfiguredServers();

  const candidates = getConfiguredSlots()
    .filter(slot => getStatus(slot) === 'online')
    .map(slot => ({ ...slot, online: true }));
  const choice = selectHealthyServer(candidates);

  if (!choice) {
    selectedServerId = '';
    renderServers();
    updateServerSummary();
    if (!silent) showNotice('No configured server is reachable. Check its URL and CORS settings, then try again.', true);
    return null;
  }

  selectedServerId = choice.id;
  renderServers();
  updateServerSummary();
  if (!silent) showNotice(`Auto Server selected ${choice.name}.`, false);
  return choice;
}

function setBusy(isBusy, busyLabel = 'Requesting code…') {
  generateButton.disabled = isBusy;
  generateButtonLabel.textContent = isBusy ? busyLabel : 'Generate Pair Code';
  phoneNumberInput.readOnly = isBusy;
}

function codeErrorMessage(payload, response) {
  if (typeof payload?.error === 'string' && payload.error.trim()) return payload.error.trim();
  if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message.trim();
  if (response && !response.ok) return `The server returned HTTP ${response.status}.`;
  return 'The server did not return a pairing code. Try again later.';
}

async function requestPairCode(server, phoneNumber) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CODE_TIMEOUT_MS);
  try {
    const response = await fetch(buildPairCodeUrl(server.baseUrl, phoneNumber), {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const code = extractPairCode(payload);
    if (!response.ok || !code) throw new Error(codeErrorMessage(payload, response));
    return code;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

pairForm.addEventListener('submit', async event => {
  event.preventDefault();
  clearNotice();
  codeResult.hidden = true;
  pairCode.textContent = '—';
  copyButton.disabled = true;

  const digits = normalizePhoneNumber(phoneNumberInput.value);
  if (digits.length < 10 || digits.length > 15) {
    showNotice('Enter 10–15 digits, including your country code. Do not include an extension.', true);
    phoneNumberInput.focus();
    return;
  }

  setBusy(true);
  try {
    let server = routingMode === 'auto' ? await chooseAutomaticServer({ silent: true }) : getSelectedSlot();
    if (!server) throw new Error('No available server is selected. Add a server URL or choose another server.');

    // Deliberately make one pairing request to one chosen server; no cross-server retry.
    const code = await requestPairCode(server, digits);
    pairCode.textContent = code;
    codeResult.hidden = false;
    copyButton.disabled = false;
    showNotice(`Pairing code received from ${server.name}.`, false);
  } catch (error) {
    if (error?.name === 'AbortError') {
      showNotice('The server took too long to respond. Check its status and try again.', true);
    } else {
      showNotice(error?.message || 'Could not reach the selected server. Check its URL and CORS settings.', true);
    }
  } finally {
    setBusy(false);
  }
});

autoServerButton.addEventListener('click', async () => {
  if (checkingServers) return;
  autoServerButton.disabled = true;
  try {
    await chooseAutomaticServer();
  } finally {
    autoServerButton.disabled = false;
  }
});

copyButton.addEventListener('click', async () => {
  const value = pairCode.textContent.trim();
  if (!value || value === '—') return;

  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch {
        // Continue to the selection-based fallback when mobile clipboard access is denied.
      }
    }

    if (!copied) {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = value;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.setAttribute('aria-hidden', 'true');
      temporaryInput.tabIndex = -1;
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.append(temporaryInput);
      temporaryInput.focus();
      temporaryInput.select();
      try {
        copied = typeof document.execCommand === 'function' && document.execCommand('copy');
      } finally {
        temporaryInput.remove();
      }
    }
    if (!copied) throw new Error('Clipboard access is unavailable.');
    copyLabel.textContent = 'Copied';
    window.setTimeout(() => { copyLabel.textContent = 'Copy'; }, 1400);
  } catch {
    showNotice('Could not copy automatically. Select and copy the code manually.', true);
  }
});

async function initializePanel() {
  setBusy(true, 'Checking servers…');
  renderServers();
  updateServerSummary();
  try {
    await chooseAutomaticServer({ silent: true });
  } finally {
    setBusy(false);
  }
}

initializePanel();
