class TagAge extends HTMLElement {
  static get observedAttributes() { return ["today","from","to","max-date","max-age"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  static #parseISO(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const y = +m[1], mo = +m[2]-1, d = +m[3];
    const t = Date.UTC(y, mo, d);
    const dt = new Date(t);
    return (dt.getUTCFullYear()===y && dt.getUTCMonth()===mo && dt.getUTCDate()===d) ? dt : null;
  }

  static #todayUTC() {
    const n = new Date();
    return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
  }

  static #ageYears(from, ref) {
    let a = ref.getUTCFullYear() - from.getUTCFullYear();
    const rm = ref.getUTCMonth(), fm = from.getUTCMonth();
    if (rm < fm || (rm === fm && ref.getUTCDate() < from.getUTCDate())) a--;
    return a;
  }

  render() {
    const g = a => this.getAttribute(a);
    const from = TagAge.#parseISO(g("from"));
    if (!from) return void (this.textContent = "");

    const maxDate = TagAge.#parseISO(g("max-date"));
    let ref = this.hasAttribute("today") ? TagAge.#todayUTC() : TagAge.#parseISO(g("to"));
    if (!ref) return void (this.textContent = "");

    if (maxDate && ref > maxDate) ref = maxDate;

    let age = TagAge.#ageYears(from, ref);
    const maxAgeAttr = g("max-age");
    if (maxAgeAttr != null && maxAgeAttr !== "") {
      const maxAge = Number(maxAgeAttr);
      if (Number.isFinite(maxAge)) age = Math.min(age, maxAge);
    }
    this.textContent = String(age);
  }
}

customElements.define("x-age", TagAge);