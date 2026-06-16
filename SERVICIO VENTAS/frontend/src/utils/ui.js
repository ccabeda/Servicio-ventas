import { escapeAttribute, escapeHtml } from "./html.js";

export function setButtonLoading(button, isLoading, loadingLabel) {
  if (!button) return;

  if (!button.dataset.label) {
    button.dataset.label = button.textContent.trim();
  }

  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.setAttribute("aria-busy", String(isLoading));
  button.textContent = isLoading ? loadingLabel : button.dataset.label;
}

export function showToast(container, message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

export function rowEmpty(message, colspan) {
  return `<tr><td colspan="${colspan}" class="table-empty">${escapeHtml(message)}</td></tr>`;
}

export function rowState({ title, description = "", type = "empty", colspan }) {
  return `
    <tr>
      <td colspan="${colspan}" class="table-empty">
        <div class="table-state table-state-${type}">
          <span class="table-state-icon" aria-hidden="true"></span>
          <strong>${escapeHtml(title)}</strong>
          ${description ? `<small>${escapeHtml(description)}</small>` : ""}
        </div>
      </td>
    </tr>
  `;
}

export function rowSkeleton(columns, rows = 5) {
  return Array.from({ length: rows }, () => `
    <tr class="skeleton-row" aria-hidden="true">
      ${Array.from({ length: columns }, (_, index) => `
        <td><span class="skeleton-line ${index === 0 ? "is-wide" : ""}"></span></td>
      `).join("")}
    </tr>
  `).join("");
}

export function fieldHtml(label, name, value = "", required = false, type = "text", step = "") {
  const requiredAttr = required ? "required" : "";
  const stepAttr = step ? `step="${step}"` : "";
  const safeValue = value ?? "";

  return `
    <label class="field">
      <span>${label}</span>
      <input name="${name}" type="${type}" value="${escapeAttribute(String(safeValue))}" ${requiredAttr} ${stepAttr}>
    </label>
  `;
}

export function selectHtml(label, name, options, value = "", required = false) {
  const requiredAttr = required ? "required" : "";
  const safeValue = String(value ?? "");

  return `
    <label class="field">
      <span>${label}</span>
      <select name="${name}" ${requiredAttr}>
        ${options.map(option => `
          <option value="${escapeAttribute(String(option.value))}" ${safeValue === String(option.value) ? "selected" : ""}>
            ${escapeHtml(String(option.label))}
          </option>
        `).join("")}
      </select>
    </label>
  `;
}

export function checkboxHtml(label, name, checked = false) {
  return `
    <label class="check-field">
      <input name="${name}" type="checkbox" ${checked ? "checked" : ""}>
      <span>${label}</span>
    </label>
  `;
}
