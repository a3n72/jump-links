(function () {
  const config = window.LINK_PAGE_CONFIG || {};
  const links = Array.isArray(config.links) ? config.links : [];

  const titleElement = document.getElementById("page-title");
  const descriptionElement = document.getElementById("page-description");
  const eyebrowElement = document.querySelector(".eyebrow");
  const linksListElement = document.getElementById("links-list");

  if (config.title) {
    document.title = config.title;
    titleElement.textContent = config.title;
  }

  if (config.description) {
    descriptionElement.textContent = config.description;
  }

  if (config.eyebrow) {
    eyebrowElement.textContent = config.eyebrow;
  }

  if (!links.length) {
    linksListElement.innerHTML = '<p class="empty-state">目前尚未設定任何連結。</p>';
    return;
  }

  const groupOrder = ["ios", "android", "other"];
  const groupMeta = {
    ios: { title: "iOS", className: "platform-ios" },
    android: { title: "Android", className: "platform-android" },
    other: { title: "其他", className: "platform-other" }
  };
  const groups = { ios: [], android: [], other: [] };

  links.forEach((link) => {
    if (!link || !link.url || !link.label) {
      return;
    }
    const key = (link.platform || "").toLowerCase() === "android"
      ? "android"
      : (link.platform || "").toLowerCase() === "ios"
        ? "ios"
        : "other";
    groups[key].push(link);
  });

  const fragment = document.createDocumentFragment();

  groupOrder.forEach((key) => {
    const items = groups[key];
    if (!items.length) return;

    const groupEl = document.createElement("section");
    groupEl.className = `link-group link-group-${key}`;

    const heading = document.createElement("h2");
    heading.className = `group-title ${groupMeta[key].className}`;
    heading.textContent = groupMeta[key].title;
    groupEl.appendChild(heading);

    const list = document.createElement("div");
    list.className = "group-cards";

    items.forEach((link) => {
      const anchor = document.createElement("a");
      anchor.className = link.image ? "link-card has-image" : "link-card";
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.setAttribute("aria-label", `開啟 ${link.label}`);

      if (link.color) {
        anchor.style.setProperty("--link-color", link.color);
      }

      if (link.image) {
        const image = document.createElement("img");
        image.src = link.image;
        image.alt = link.imageAlt || link.label;
        image.loading = "lazy";
        anchor.appendChild(image);
      }

      const content = document.createElement("span");
      content.className = "link-content";

      if (link.tag) {
        const tag = document.createElement("span");
        tag.className = "link-tag";
        tag.textContent = link.tag;
        content.appendChild(tag);
      }

      const label = document.createElement("span");
      label.className = "link-label";
      label.textContent = link.label;
      content.appendChild(label);

      if (link.description) {
        const description = document.createElement("span");
        description.className = "link-description";
        description.textContent = link.description;
        content.appendChild(description);
      }

      anchor.appendChild(content);
      list.appendChild(anchor);
    });

    groupEl.appendChild(list);
    fragment.appendChild(groupEl);
  });

  linksListElement.appendChild(fragment);
})();
