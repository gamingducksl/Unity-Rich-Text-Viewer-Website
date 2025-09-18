const input = document.getElementById("inputText");
    const output = document.getElementById("output");
    const warning = document.getElementById("warning");
    const tooltip = document.getElementById("tooltip");


    function parseURT(text) {
      return text
        .replace(/<b>([\s\S]*?)<\/b>/gi, "<strong>$1</strong>")
        .replace(/<i>([\s\S]*?)<\/i>/gi, "<em>$1</em>")
        .replace(/<u>([\s\S]*?)<\/u>/gi, "<u>$1</u>")
        .replace(/<s>([\s\S]*?)<\/s>/gi, "<del>$1</del>")
        .replace(/<color=(.+?)>([\s\S]*?)<\/color>/gi, "<span style='color:$1'>$2</span>")
        .replace(/<size=(\d+)>([\s\S]*?)<\/size>/gi, "<span style='font-size:$1px'>$2</span>")
        .replace(/<align=(left|center|right)>([\s\S]*?)<\/align>/gi, "<div style='text-align:$1'>$2</div>")
        .replace(/<link="(.+?)">([\s\S]*?)<\/link>/gi, "<a href='$1' target='_blank'>$2</a>");
    }

    function checkErrors(text) {
      let issues = [];
      const supportedTags = ["b", "i", "u", "s", "color", "size", "align", "link", "sub", "sup"];
      const tagRegex = /<\/?([a-z]+)(?:=[^>]*)?>/gi;
      const lines = text.split("\n");
      let stack = [];
      let match;

      lines.forEach((line, lineIndex) => {
        while ((match = tagRegex.exec(line)) !== null) {
          const tag = match[1].toLowerCase();
          const isClosing = match[0].startsWith("</");

          if (!supportedTags.includes(tag)) {
            issues.push({ msg: `Unsupported tag <${tag}>.`, line: lineIndex });
            continue;
          }

          if (!isClosing) {
            stack.push({ tag, line: lineIndex });
          } else {
            if (stack.length === 0 || stack[stack.length - 1].tag !== tag) {
              issues.push({ msg: `Unexpected closing tag </${tag}>.`, line: lineIndex });
            } else {
              stack.pop();
            }
          }
        }
      });

      if (stack.length > 0) {
        stack.forEach(item => {
          issues.push({ msg: `Unclosed tag <${item.tag}>.`, line: item.line });
        });
      }

      // Unsupported color check
      const allowedColors = [
        "red","green","blue","yellow","black","white","cyan","magenta",
        "gray","grey","pink","fuchsia","aqua","brown","lightblue","lime",
        "maroon","navy","olive","orange","silver","teal"
      ];
      const colorRegex = /<color=([^>]+)>/gi;
      let colorMatch;
      while ((colorMatch = colorRegex.exec(text)) !== null) {
        const colorVal = colorMatch[1].toLowerCase();
        const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(colorVal);
        if (!allowedColors.includes(colorVal) && !isHex) {
          const lineIndex = text.substr(0, colorMatch.index).split("\n").length - 1;
          issues.push({ msg: `Unsupported color value: "${colorVal}".`, line: lineIndex });
        }
      }

      return issues;
    }

    function highlightLine(lineIndex) {
      const lines = input.value.split("\n");
      let charIndex = 0;
      for (let i = 0; i < lineIndex; i++) {
        charIndex += lines[i].length + 1;
      }

      input.focus();
      input.setSelectionRange(charIndex, charIndex + lines[lineIndex].length);
      //input.classList.add("line-highlight");
      const style = document.createElement("style");
      style.textContent = `
        ::selection {
            background: red;
            color: black;
        }
    `;
    document.head.appendChild(style);
document.head.appendChild(style);

      const removeHighlight = () => {
        const style = document.createElement("style");
      style.textContent = `
        ::selection {
            background: #4aa3ff;
            color: white;
        }
    `;
    document.head.appendChild(style);
        input.removeEventListener("input", removeHighlight);
        input.removeEventListener("click", removeHighlight);
        input.removeEventListener("mousedown", removeHighlight);
      };
      input.addEventListener("input", removeHighlight);
      input.addEventListener("click", removeHighlight);
      input.addEventListener("mousedown", removeHighlight);
    }

    function updateOutput() {
      const text = input.value;
      output.innerHTML = parseURT(text);

      const errors = checkErrors(text);
      tooltip.innerHTML = "";

      if (errors.length > 0) {
        warning.style.visibility = "visible";
        errors.forEach((err, idx) => {
          let item = document.createElement("div");
          item.textContent = `Error ${idx+1}: ${err.msg} (line ${err.line+1})`;
          item.onclick = () => highlightLine(err.line);
          tooltip.appendChild(item);
        });
      } else {
        warning.style.visibility = "hidden";
      }
    }

    input.addEventListener("input", updateOutput);
    updateOutput();

    textarea = document.querySelector("textarea");
        textarea.addEventListener('input', autoResize, false);

        function autoResize() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        }

        window.onload = () => autoResize.call(textarea);