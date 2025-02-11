document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // Utility Functions
  // ======================
  const isValidOctet = (value) => {
    const trimmed = value.trim();
    const num = parseInt(trimmed, 10);
    return trimmed !== "" && !isNaN(num) && num >= 0 && num <= 255;
  };

  const getDefaultComputedStyle = (element, property) => {
    const temp = document.createElement(element.tagName);
    if (
      element.tagName.toLowerCase() === "input" &&
      element.getAttribute("type")
    ) {
      temp.setAttribute("type", element.getAttribute("type"));
    }
    document.body.appendChild(temp);
    const defaultValue = window.getComputedStyle(temp)[property];
    document.body.removeChild(temp);
    return defaultValue;
  };

  const applyStyleIfNotPresent = (element, property, value) => {
    if (element.style[property]) return;
    const computed = window.getComputedStyle(element)[property];
    const defaultValue = getDefaultComputedStyle(element, property);
    if (computed === defaultValue) element.style[property] = value;
  };

  const applyStylesToElement = (element) => {
    Object.keys(styleRules).forEach((selector) => {
      if (element.matches(selector)) {
        const styles = styleRules[selector];
        Object.entries(styles).forEach(([property, value]) => {
          applyStyleIfNotPresent(element, property, value);
        });
      }
    });
  };

  const applyStylesRecursively = (root) => {
    if (root.nodeType === Node.ELEMENT_NODE) {
      applyStylesToElement(root);
      root
        .querySelectorAll("*")
        .forEach((child) => applyStylesToElement(child));
    }
  };

  // ======================
  // IPv4 Input Creation and Management
  // ======================
  const createIPv4Input = (originalInput) => {
    const container = document.createElement("div");
    container.classList.add("ipv4-container");
    if (originalInput.id) container.id = originalInput.id;
    if (originalInput.className) {
      originalInput.className
        .split(" ")
        .forEach((cls) => container.classList.add(cls));
    }

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    if (originalInput.name) hiddenInput.name = originalInput.name;
    if (originalInput.id) hiddenInput.id = `${originalInput.id}-hidden`;
    hiddenInput.classList.add("ipv4-hidden-input");
    if (originalInput.className) {
      originalInput.className
        .split(" ")
        .forEach((cls) => hiddenInput.classList.add(cls));
    }

    const getValue = () => {
      const octetInputs = container.querySelectorAll(".ipv4-input");
      const octets = [];
      let allValid = true;
      octetInputs.forEach((input) => {
        const value = input.value.trim();
        if (!isValidOctet(value)) allValid = false;
        octets.push(value);
      });
      return octets.length === 4 && allValid ? octets.join(".") : "";
    };

    const setValue = (newValue) => {
      const octetInputs = container.querySelectorAll(".ipv4-input");
      newValue = typeof newValue === "string" ? newValue : "";
      if (newValue === "") {
        octetInputs.forEach((input) => {
          input.value = "";
          input.dispatchEvent(new Event("input"));
        });
        updateHiddenValue();
        return;
      }
      const octets = newValue.split(".");
      let isValid = octets.length === 4;
      const validOctets = [];
      if (isValid) {
        octets.forEach((octet, index) => {
          if (/^\d+$/.test(octet)) {
            const num = parseInt(octet, 10);
            if (num >= 0 && num <= 255) {
              validOctets[index] = num.toString();
            } else {
              isValid = false;
            }
          } else {
            isValid = false;
          }
        });
      }
      if (!isValid || validOctets.length !== 4) {
        octetInputs.forEach((input) => {
          input.value = "";
          input.dispatchEvent(new Event("input"));
        });
        updateHiddenValue();
        return;
      }
      octetInputs.forEach((input, index) => {
        input.value = validOctets[index];
        input.dispatchEvent(new Event("input"));
      });
      updateHiddenValue();
    };

    Object.defineProperty(container, "value", {
      get: () => getValue(),
      set: (newValue) => setValue(newValue),
    });

    const updateHiddenValue = () => {
      hiddenInput.setAttribute("value", getValue());
    };

    Object.defineProperty(hiddenInput, "value", {
      get: () => container.value,
      set: (newValue) => {
        container.value = newValue;
        updateHiddenValue();
      },
    });

    for (let i = 0; i < 4; i++) {
      const octetInput = document.createElement("input");
      octetInput.type = "text";
      octetInput.classList.add("ipv4-input");
      octetInput.maxLength = 3;

      octetInput.addEventListener("input", () => {
        let value = octetInput.value.replace(/\D/g, "");
        if (value !== "" && parseInt(value, 10) > 255) {
          octetInput.classList.add("error");
        } else {
          octetInput.classList.remove("error");
        }
        octetInput.value = value;
        if (value.length === 3 && parseInt(value, 10) <= 255) {
          const inputs = container.querySelectorAll(".ipv4-input");
          if (inputs[i + 1]) inputs[i + 1].focus();
        }
        updateHiddenValue();
      });

      octetInput.addEventListener("keydown", (e) => {
        const isModifierKey = e.ctrlKey || e.metaKey || e.altKey;
        if (
          !isModifierKey &&
          e.key.length === 1 &&
          /\D/.test(e.key) &&
          e.key !== "."
        ) {
          e.preventDefault();
        }
        if (e.key === "Backspace" && octetInput.value === "" && i > 0) {
          const inputs = container.querySelectorAll(".ipv4-input");
          if (inputs[i - 1]) inputs[i - 1].focus();
        }
        if (e.key === ".") {
          if (
            octetInput.value.length > 0 &&
            parseInt(octetInput.value, 10) <= 255
          ) {
            const inputs = container.querySelectorAll(".ipv4-input");
            if (inputs[i + 1]) inputs[i + 1].focus();
          }
          e.preventDefault();
        }
      });

      octetInput.addEventListener("blur", () => {
        let value = octetInput.value;
        if (value === "00" || value === "000") {
          value = "0";
        } else if (value !== "0") {
          value = value.replace(/^0+/, "");
        }
        octetInput.value = value;
        updateHiddenValue();
      });

      octetInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
          ? e.clipboardData.getData("text")
          : window.clipboardData.getData("text");
        const values = pastedData
          .replace(/[^0-9.]/g, "")
          .split(".")
          .map((v) => v.replace(/^0+/, "").slice(0, 3));
        const inputs = container.querySelectorAll(".ipv4-input");
        let currentIndex = i;
        values.forEach((value) => {
          if (currentIndex < inputs.length) {
            inputs[currentIndex].value = value;
            inputs[currentIndex].dispatchEvent(new Event("input"));
            inputs[currentIndex].dispatchEvent(new Event("blur"));
            currentIndex++;
          }
        });
        updateHiddenValue();
      });

      container.appendChild(octetInput);
      if (i < 3) {
        const dotSpan = document.createElement("span");
        dotSpan.textContent = ".";
        container.appendChild(dotSpan);
      }
    }

    originalInput.insertAdjacentElement("afterend", hiddenInput);
    originalInput.replaceWith(container);
    updateHiddenValue();
  };

  // ======================
  // Style Rules and Application
  // ======================
  const styleRules = {
    ".ipv4-input": {
      width: "35px",
      textAlign: "center",
    },
    ".ipv4-container": {
      display: "flex",
      alignItems: "center",
      width: "fit-content",
    },
    ".ipv4-container span": {
      margin: "0 5px",
    },
  };

  applyStylesRecursively(document.body);

  const styleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            applyStylesRecursively(node);
          }
        });
      } else if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        if (mutation.target.nodeType === Node.ELEMENT_NODE) {
          applyStylesToElement(mutation.target);
        }
      }
    });
  });
  styleObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });

  // ======================
  // Dynamic IPv4 Input Handling
  // ======================
  document
    .querySelectorAll('input[type="ipv4"]')
    .forEach((input) => createIPv4Input(input));

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.tagName === "INPUT" &&
            node.getAttribute("type") === "ipv4"
          ) {
            createIPv4Input(node);
          }
          const ipv4Descendants = node.querySelectorAll?.('input[type="ipv4"]');
          if (ipv4Descendants && ipv4Descendants.length > 0) {
            ipv4Descendants.forEach((input) => createIPv4Input(input));
          }
        }
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // ======================
  // Form Submission Validation
  // ======================
  document.addEventListener("submit", (e) => {
    let formIsValid = true;
    let hasInvalidEntries = false;
    const ipv4Containers = e.target.querySelectorAll(".ipv4-container");

    ipv4Containers.forEach((container) => {
      const hiddenInput = container.nextElementSibling;
      const octetInputs = container.querySelectorAll(".ipv4-input");
      const octets = [...octetInputs].map((input) => input.value.trim());
      const allEmpty = octets.every((o) => o === "");
      const validOctets = octets.map((o) => isValidOctet(o));
      const isValid = octets.length === 4 && validOctets.every((v) => v);
      const hasPartialData = !allEmpty && octets.some((o) => o === "");
      const hasInvalidNumbers = validOctets.some((v) => !v);

      if (allEmpty) {
        hiddenInput.value = "";
      } else if (isValid) {
        hiddenInput.value = octets.join(".");
      }
      if ((hasPartialData || hasInvalidNumbers) && !allEmpty) {
        formIsValid = false;
        hasInvalidEntries = true;
      }
    });

    if (hasInvalidEntries) {
      e.preventDefault();
      let pageLang;

      if (document.documentElement.lang) {
        pageLang = document.documentElement.lang.slice(0, 2).toLowerCase();
      }
      else if (navigator.languages && navigator.languages.length > 0) {
        pageLang = navigator.languages[0].slice(0, 2).toLowerCase();
      }
      else if (navigator.language) {
        pageLang = navigator.language.slice(0, 2).toLowerCase();
      }
      else {
        pageLang = 'en';
      }

      const messages = {
        'es': "Hay direcciones IP introducidas no válidas.",
        'en': "Invalid IP addresses entered.",
        'fr': "Adresses IP entrées non valides.",
        'it': "Ci sono indirizzi IP non validi inseriti.",
        'pt': "Endereços IP inválidos inseridos.",
        'de': "Es wurden ungültige IP-Adressen eingegeben.",
        'zh': "輸入的 IP 位址無效",
        'ja': "無効な IP アドレスが入力されています"
      };

      if (!messages.hasOwnProperty(pageLang)) {
        pageLang = 'en';
      }

      alert(messages[pageLang]);
      return false;
    }

    return formIsValid;
  });

  document.addEventListener("reset", (e) => {
    if (e.target.tagName === "FORM") {
      setTimeout(() => {
        e.target.querySelectorAll(".ipv4-input").forEach((input) => {
          input.classList.remove("error");
        });
      }, 0);
    }
  });


  // ======================
  // Error Style Injection
  // ======================
  const checkAndInjectErrorStyle = () => {
    const errorSelector = ".ipv4-input.error";
    const defaultColor = "#ffcccc";
    let styleExists = false;

    const testElement = document.createElement("input");
    testElement.className = "ipv4-input error";
    testElement.style.display = "none";
    document.body.appendChild(testElement);

    const defaultElement = document.createElement("input");
    document.body.appendChild(defaultElement);

    try {
      const testStyles = getComputedStyle(testElement);
      const defaultStyles = getComputedStyle(defaultElement);
      styleExists =
        testStyles.backgroundColor !== defaultStyles.backgroundColor;
    } catch (e) {
      console.error("Error checking styles:", e.stack);
    } finally {
      document.body.removeChild(testElement);
      document.body.removeChild(defaultElement);
    }

    if (!styleExists) {
      const style = document.createElement("style");
      style.textContent = `${errorSelector} {
        background-color: ${defaultColor} !important;
      }`;
      document.head.appendChild(style);
    }
  };

  checkAndInjectErrorStyle();
});
