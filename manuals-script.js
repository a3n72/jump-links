(function () {
  const config = window.MANUAL_PAGE_CONFIG || {};
  const manuals = Array.isArray(config.manuals) ? config.manuals : [];

  const titleElement = document.getElementById("page-title");
  const descriptionElement = document.getElementById("page-description");
  const eyebrowElement = document.querySelector(".eyebrow");
  const listElement = document.getElementById("manuals-list");

  if (config.title) {
    document.title = config.title;
    if (titleElement) titleElement.textContent = config.title;
  }
  if (config.description && descriptionElement) {
    descriptionElement.textContent = config.description;
  }
  if (config.eyebrow && eyebrowElement) {
    eyebrowElement.textContent = config.eyebrow;
  }

  const viewer = document.getElementById("pdf-viewer");
  const viewerTitle = document.getElementById("pdf-viewer-title");
  const viewerFrame = document.getElementById("pdf-viewer-frame");
  const viewerFallback = document.getElementById("pdf-viewer-fallback");

  function openViewer(manual) {
    if (!viewer || !viewerFrame) return;
    viewerTitle.textContent = manual.label || "教學手冊";
    viewerFallback.hidden = true;
    const sep = manual.pdf.indexOf("#") === -1 ? "#" : "&";
    viewerFrame.src = `${manual.pdf}${sep}toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    viewer.hidden = false;
    document.body.style.overflow = "hidden";

    fetch(manual.pdf, { method: "HEAD" }).then((res) => {
      if (!res.ok) {
        viewerFallback.hidden = false;
      }
    }).catch(() => {
      viewerFallback.hidden = false;
    });
  }

  function closeViewer() {
    if (!viewer) return;
    viewer.hidden = true;
    viewerFrame.src = "about:blank";
    document.body.style.overflow = "";
  }

  if (viewer) {
    viewer.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.dataset.action === "close") {
        closeViewer();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer && !viewer.hidden) {
      closeViewer();
    }
  });

  if (!manuals.length) {
    listElement.innerHTML = '<p class="empty-state">目前尚未設定任何教學手冊。</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  manuals.forEach((manual) => {
    if (!manual || !manual.label || !manual.pdf) return;

    const anchor = document.createElement("a");
    anchor.className = "link-card manual-card";
    anchor.href = manual.pdf;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", `閱讀 ${manual.label}`);

    if (manual.color) {
      anchor.style.setProperty("--link-color", manual.color);
    }

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      openViewer(manual);
    });

    const content = document.createElement("span");
    content.className = "link-content";

    if (manual.tag) {
      const tag = document.createElement("span");
      tag.className = "link-tag";
      tag.textContent = manual.tag;
      content.appendChild(tag);
    }

    const label = document.createElement("span");
    label.className = "link-label";
    label.textContent = manual.label;
    content.appendChild(label);

    if (manual.description) {
      const description = document.createElement("span");
      description.className = "link-description";
      description.textContent = manual.description;
      content.appendChild(description);
    }

    anchor.appendChild(content);
    fragment.appendChild(anchor);
  });

  listElement.appendChild(fragment);
})();
