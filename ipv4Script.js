document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // Utility Functions
  // ======================
  
  const getBrowserLanguage = () => {
    if (document.documentElement.lang) {
      return document.documentElement.lang.slice(0, 2).toLowerCase();
    }
    if (navigator.languages && navigator.languages.length > 0) {
      return navigator.languages[0].slice(0, 2).toLowerCase();
    }
    if (navigator.language) {
      return navigator.language.slice(0, 2).toLowerCase();
    }
    return 'en';
  };

  const getInvalidOctetMessage = () => {
    const lang = getBrowserLanguage();
    const messages = {
      'es': "Octeto no válido.",
      'en': "Invalid octet.",
      'fr': "Octet invalide.",
      'it': "Ottetto non valido.",
      'pt': "Octeto inválido.",
      'de': "Ungültiges Oktett.",
      'zh': "无效的八位字节。",
      'ja': "無効なオクテットです。"
    };
    return messages[lang] || messages['en'];
  };
  
  const getIncompleteMessage = () => {
      const lang = getBrowserLanguage();
      const messages = {
        'es': "Complete este campo.",
        'en': "Please fill out this field.",
        'fr': "Veuillez remplir ce champ.",
        'it': "Compila questo campo.",
        'pt': "Preencha este campo.",
        'de': "Füllen Sie dieses Feld aus.",
        'zh': "请填写此字段。",
        'ja': "このフィールドに入力してください。"
      };
      return messages[lang] || messages['en'];
  };

  const isValidOctet = (value) => {
    const trimmed = value.trim();
    const num = parseInt(trimmed, 10);
    return trimmed !== "" && !isNaN(num) && num >= 0 && num <= 255;
  };

  const cleanOctetValue = (value) => {
    if (!value) return "";
    if (value === "00" || value === "000") return "0";
    if (value.length > 1 && value.startsWith("0"))
      return value.replace(/^0+/, "");
    return value;
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

  const getConsoleWarnMessage = (value) => {
    const lang = getBrowserLanguage();
    const messages = {
      'es': `El valor especificado '${value}' no es una dirección IPv4 válida.`,
      'en': `The specified value '${value}' is not a valid IPv4 address.`,
      'fr': `La valeur spécifiée '${value}' n'est pas une adresse IPv4 valide.`,
      'it': `Il valore specificato '${value}' non è un indirizzo IPv4 valido.`,
      'pt': `O valor especificado '${value}' não é um endereço IPv4 válido.`,
      'de': `Der angegebene Wert '${value}' ist keine gültige IPv4-Adresse.`,
      'zh': `指定的值 '${value}' 不是有效的 IPv4 地址。`,
      'ja': `指定された値 '${value}' は有効なIPv4アドレスではありません。`
    };
    return messages[lang] || messages['en'];
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

    let firstOctetId = null;
    if (originalInput.id) {
        firstOctetId = `${originalInput.id}_octet_1`;
        const label = document.querySelector(`label[for="${originalInput.id}"]`);
        if (label) {
            label.setAttribute("for", firstOctetId);
        }
    }

    const getValue = () => {
      const octetInputs = container.querySelectorAll(".ipv4-input");
      const octets = [];
      let allValid = true;
      octetInputs.forEach((input) => {
        const value = cleanOctetValue(input.value.trim());
        if (!isValidOctet(value)) allValid = false;
        octets.push(value);
      });
      return octets.length === 4 && allValid ? octets.join(".") : "";
    };

    const updateHiddenValue = () => {
      hiddenInput.setAttribute("value", getValue());
    };

    const distributeValue = (fullString, startIndex = 0) => {
        const inputs = container.querySelectorAll(".ipv4-input");
        const rawValues = fullString.replace(/[^0-9.]/g, "").split(".");
        
        if (rawValues.length <= 1 && !fullString.includes(".")) return false;

        let currentIndex = startIndex;

        rawValues.forEach((rawSeg) => {
          if (currentIndex < inputs.length) {
            let finalValue = "";
            let shouldMarkError = false;

            if (rawSeg !== "") {
              const num = parseInt(rawSeg, 10);
              if (!isNaN(num) && num >= 0 && num <= 255) {
                finalValue = num.toString();
              } else {
                finalValue = "";
                shouldMarkError = true;
              }
            }

            const inputElem = inputs[currentIndex];
            inputElem.value = finalValue;
            
            inputElem.setCustomValidity("");

            if (shouldMarkError) {
              inputElem.classList.add("error");
            } else {
              inputElem.classList.remove("error");
            }
            currentIndex++;
          }
        });
        updateHiddenValue();
        
        const nextFocusIndex = Math.min(currentIndex, 3);
        if (inputs[nextFocusIndex]) inputs[nextFocusIndex].focus();
        
        return true;
    };

    const setValue = (newValue) => {
      const octetInputs = container.querySelectorAll(".ipv4-input");
      newValue = typeof newValue === "string" ? newValue : "";

      if (newValue === "") {
        octetInputs.forEach((input) => {
          input.value = "";
          input.classList.remove("error");
          input.setCustomValidity("");
        });
        updateHiddenValue();
        return;
      }

      const parts = newValue.split(".");
      let isStructureValid = parts.length === 4;
      if (isStructureValid) {
        isStructureValid = parts.every(part => isValidOctet(part));
      }

      if (!isStructureValid) {
        console.warn(getConsoleWarnMessage(newValue));
        octetInputs.forEach((input) => {
            input.value = "";
            input.classList.remove("error");
            input.setCustomValidity("");
        });
        updateHiddenValue();
        return; 
      }

      distributeValue(newValue);
    };

    Object.defineProperty(container, "value", {
      get: () => getValue(),
      set: (newValue) => setValue(newValue),
    });

    Object.defineProperty(hiddenInput, "value", {
      get: () => container.value,
      set: (newValue) => {
        container.value = newValue;
        updateHiddenValue();
      },
    });

    const isRequired = originalInput.hasAttribute("required");

    for (let i = 0; i < 4; i++) {
      const octetInput = document.createElement("input");
      octetInput.type = "text";
      octetInput.classList.add("ipv4-input");
      octetInput.maxLength = 3;

      if (i === 0 && firstOctetId) {
          octetInput.id = firstOctetId;
      }

      if (isRequired) octetInput.required = true;

      // === INPUT EVENT ===
      octetInput.addEventListener("input", (e) => {
        octetInput.setCustomValidity("");

        if (octetInput.value.includes(".") || octetInput.value.length > 3) {
            const wasDistributed = distributeValue(octetInput.value, i);
            if (wasDistributed) {
                e.preventDefault(); 
                return;
            }
        }

        let value = octetInput.value.replace(/\D/g, "");
        const num = parseInt(value, 10);

        if (value !== "" && num > 255) {
          octetInput.classList.add("error");
        } else {
          octetInput.classList.remove("error");
        }

        octetInput.value = value;
        if (value.length === 3 && num <= 255) {
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
          if (inputs[i - 1]) {
            inputs[i - 1].focus();
          }
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
        octetInput.value = cleanOctetValue(octetInput.value);
        updateHiddenValue();
      });

      // === PASTE EVENT ===
      octetInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
          ? e.clipboardData.getData("text")
          : window.clipboardData.getData("text");

        distributeValue(pastedData, i);
      });

      container.appendChild(octetInput);
      if (i < 3) {
        const dotSpan = document.createElement("span");
        dotSpan.textContent = ".";
        container.appendChild(dotSpan);
      }
    }

    if (originalInput.value) {
      setValue(originalInput.value);
    }

    originalInput.insertAdjacentElement("afterend", hiddenInput);
    originalInput.replaceWith(container);
    updateHiddenValue();
  };

  // ======================
  // Style Rules
  // ======================
  const styleRules = {
    ".ipv4-input": {
      width: "35px",
      textAlign: "center",
    },
    ".ipv4-container": {
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      verticalAlign: "middle",
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
    const ipv4Containers = e.target.querySelectorAll(".ipv4-container");
    let hasError = false;

    for (const container of ipv4Containers) {
        if (hasError) break;

        const octetInputs = container.querySelectorAll(".ipv4-input");
        const octets = [...octetInputs].map((input) => cleanOctetValue(input.value.trim()));
        
        const allEmpty = octets.every((o) => o === "");
        const isPartial = !allEmpty && octets.some(o => o === "");

        for (let i = 0; i < 4; i++) {
            const input = octetInputs[i];
            const val = octets[i];
            
            if (isPartial && val === "") {
                input.setCustomValidity(getIncompleteMessage());
                input.reportValidity();
                e.preventDefault();
                hasError = true;
                break;
            }

            if (val !== "" && !isValidOctet(val)) {
                input.setCustomValidity(getInvalidOctetMessage());
                input.reportValidity();
                e.preventDefault();
                hasError = true;
                break;
            }
        }
    }
    
  });

  document.addEventListener("reset", (e) => {
    if (e.target.tagName === "FORM") {
      setTimeout(() => {
        e.target.querySelectorAll(".ipv4-input").forEach((input) => {
          input.classList.remove("error");
          input.setCustomValidity("");
        });
        e.target.querySelectorAll(".ipv4-container").forEach((container) => {
          const hiddenInput = container.nextElementSibling;
          container.value = hiddenInput.value;
        });
      }, 0);
    }
  });

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